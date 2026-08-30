import fs from 'fs';
import path from 'path';
import axios from 'axios';
import archiver from 'archiver';
import { config } from 'dotenv';
import { Client } from 'basic-ftp';
import { spawn } from 'child_process';
import chalk from 'chalk';
import boxen from 'boxen';
import ProgressBar from 'progress';

// Load environment variables
config();

const APP_NAME = process.env.APP_NAME;
const FTP_HOST = process.env.FTP_HOST;
const FTP_PORT = process.env.FTP_PORT || 21; // Default FTP port is 21
const FTP_USERNAME = process.env.FTP_USERNAME;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const REMOTE_PATH = process.env.REMOTE_PATH || '/'; // Destination path on the server
const DEPLOY_WEBHOOK_URL = process.env.DEPLOY_WEBHOOK_URL;

// Local paths
const LOCAL_PATH = path.join(process.cwd(), 'dist', 'spa');
const ARCHIVE_PATH = path.join(process.cwd(), 'dist', 'spa.zip');

function logStep(title) {
  console.log(chalk.cyanBright.bold(`\n🚀 ${title} ...`));
}

function logDone(message) {
  console.log(chalk.green.bold(`✔️ ${message}`));
}

function logError(message) {
  console.error(chalk.red.bold(`❌ ${message}`));
}

// Build project using Quasar CLI via PNPM
async function buildProject() {
  logStep('Building project using Quasar CLI');
  return new Promise((resolve, reject) => {
    const buildStart = Date.now();

    // اجرای تمیز و بومی به کمک pnpm exec
    const child = spawn('pnpm', ['exec', 'quasar', 'build'], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        logError(`Quasar build failed with exit code ${code}`);
        return reject(new Error(`Quasar build exited with code ${code}`));
      }
      const duration = ((Date.now() - buildStart) / 1000).toFixed(1);
      logDone(`Build completed successfully in ${duration}s`);
      resolve();
    });

    child.on('error', (err) => {
      logError(`Failed to start build process: ${err.message}`);
      reject(err);
    });
  });
}

// Compress the spa folder into a zip file
async function compressFolder() {
  logStep(`Compressing folder ${chalk.yellow(LOCAL_PATH)} → ${chalk.yellow(ARCHIVE_PATH)}`);
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ARCHIVE_PATH);
    const archive = archiver('zip', { zlib: { level: 9 } }); // Use maximum compression level

    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      logDone(`Compression finished — archive size: ${chalk.magentaBright(sizeMB + ' MB')}`);
      resolve();
    });

    archive.on('error', (err) => {
      logError(`Error during compression: ${err.message}`);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(LOCAL_PATH, false); // Add the entire folder to the archive
    archive.finalize();
  });
}

// Upload the compressed file to the server
async function uploadFile(client, localFilePath, remoteFilePath) {
  logStep(`Uploading ${chalk.yellow(localFilePath)} → ${chalk.yellow(remoteFilePath)}`);

  const fileSize = fs.statSync(localFilePath).size;
  const progressBar = new ProgressBar('Uploading [:bar] :percent :etas', {
    width: 40,
    complete: chalk.green('█'),
    incomplete: chalk.gray('░'),
    total: fileSize,
    clear: true, // prevents extra newline output
  });

  let uploadedBytes = 0;

  // prevent multiple newlines and color escape misalignment
  const cleanBar = () => process.stdout.write('\r\x1b[K');

  client.trackProgress(info => {
    uploadedBytes += info.bytes;
    progressBar.tick(info.bytes);
  });

  try {
    await client.uploadFrom(localFilePath, remoteFilePath);

    // stop tracking and clean the bar
    client.trackProgress();
    cleanBar();
    progressBar.interrupt(chalk.green('✔ Upload complete!'));
    logDone(`File upload completed — total uploaded: ${(uploadedBytes / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    cleanBar();
    logError(`Error during file upload: ${error.message}`);
    throw error;
  } finally {
    cleanBar();
  }
}

// Trigger remote deployment
async function triggerDeployment() {
  logStep('Triggering remote deployment...');
  try {
    const response = await axios.get(DEPLOY_WEBHOOK_URL);
    logDone(response.data.message || 'Deployment triggered successfully.');
  } catch (error) {
    logError(error.response?.data?.error || error.message);
  }
}

// Main process
async function main() {
  const client = new Client();

  const appTag = chalk.bgHex('#FFD700').black.bold(`  ${(APP_NAME || 'GitiSam').toUpperCase()}  `);
  const title = chalk.hex('#FF0080').bold('DEPLOYMENT PIPELINE');
  const version = chalk.hex('#00DFD8')('[v2.0]');
  const divider = chalk.gray('─'.repeat(46));
  const details = `${chalk.hex('#00FFA3')('• Quasar SPA')}   ${chalk.hex('#FF4D4D')('• Cloud FTP')}   ${chalk.hex('#F5A623')('• Webhook Active')}`;

  const content = `${appTag}  ${title} ${version}\n${divider}\n${details}`;

  console.log(
    boxen(content, {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: 1,
      borderStyle: 'round',
      borderColor: '#FFD700'
    })
  );


  try {
    // Step 1: Build the project
    await buildProject();

    // Step 2: Compress the folder
    await compressFolder();

    // Step 3: Connect to the FTP server
    logStep(`Connecting to FTP server ${chalk.yellow(`${FTP_HOST}:${FTP_PORT}`)}`);
    await client.access({
      host: FTP_HOST,
      port: parseInt(FTP_PORT, 10),
      user: FTP_USERNAME,
      password: FTP_PASSWORD,
    });
    logDone('Connected successfully.');

    // Step 4: Ensure the remote directory exists
    await client.ensureDir(REMOTE_PATH);

    // Step 5: Upload the compressed file
    const remoteArchivePath = path.posix.join(REMOTE_PATH, 'spa.zip');
    await uploadFile(client, ARCHIVE_PATH, remoteArchivePath);

    // Call the function at the end of your publish process
    await triggerDeployment();

    logDone('All steps completed successfully 💐');
  } catch (error) {
    logError(`Process failed: ${error.message}`);
  } finally {
    // Clean up: Delete the local archive file
    if (fs.existsSync(ARCHIVE_PATH)) {
      fs.unlinkSync(ARCHIVE_PATH);
      logDone('Local archive deleted.');
    }

    // Close the FTP connection
    await client.close();
    logDone('FTP connection closed.');
    console.log(chalk.blueBright('\n✨ Publish process finished.\n'));
  }
}

// Start the process
main();

