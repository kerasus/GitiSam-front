import fs from 'fs';
import path from 'path';
import axios from 'axios';
import archiver from 'archiver';
import { config } from 'dotenv';
import { Client } from 'basic-ftp';
import { exec } from 'child_process';

// Load environment variables
config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_PORT = process.env.FTP_PORT || 21; // Default FTP port is 21
const FTP_USERNAME = process.env.FTP_USERNAME;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const REMOTE_PATH = process.env.REMOTE_PATH || '/'; // Destination path on the server

// Local paths
const LOCAL_PATH = path.join(process.cwd(), 'dist', 'spa');
const ARCHIVE_PATH = path.join(process.cwd(), 'dist', 'spa.zip');

// Build the project using Quasar CLI
async function buildProject() {
  return new Promise((resolve, reject) => {
    console.log('Building the project using Quasar CLI...');
    exec('quasar build', (error, stdout, stderr) => {
      if (error) {
        console.error('Error during build:', stderr || error.message);
        return reject(error);
      }
      console.log('Build completed successfully.');
      resolve();
    });
  });
}

// Compress the spa folder into a zip file
async function compressFolder() {
  return new Promise((resolve, reject) => {
    console.log(`Compressing folder ${LOCAL_PATH} into ${ARCHIVE_PATH}...`);

    const output = fs.createWriteStream(ARCHIVE_PATH);
    const archive = archiver('zip', { zlib: { level: 9 } }); // Use maximum compression level

    output.on('close', () => {
      console.log(`Compression completed. Archive size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      resolve();
    });

    archive.on('error', (err) => {
      console.error('Error during compression:', err.message);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(LOCAL_PATH, false); // Add the entire folder to the archive
    archive.finalize();
  });
}

// Upload the compressed file to the server
async function uploadFile(client, localFilePath, remoteFilePath) {
  try {
    console.log(`Uploading file: ${localFilePath} -> ${remoteFilePath}`);
    await client.uploadFrom(localFilePath, remoteFilePath);
    console.log('File upload completed successfully.');
  } catch (error) {
    console.error('Error during file upload:', error.message);
    throw error;
  }
}

async function triggerDeployment() {
  try {
    const response = await axios.get('http://gitisam.ir/deploy.php');
    console.log(response.data.message || 'Deployment triggered successfully.');
  } catch (error) {
    console.error('Error triggering deployment:', error.response?.data?.error || error.message);
  }
}

// Main function
async function main() {
  const client = new Client();
  try {
    // Step 1: Build the project
    await buildProject();

    // Step 2: Compress the folder
    await compressFolder();

    // Step 3: Connect to the FTP server
    console.log(`Connecting to FTP server at ${FTP_HOST}:${FTP_PORT}...`);
    await client.access({
      host: FTP_HOST,
      port: parseInt(FTP_PORT, 10),
      user: FTP_USERNAME,
      password: FTP_PASSWORD,
    });
    console.log('Connected successfully.');

    // Step 4: Ensure the remote directory exists
    await client.ensureDir(REMOTE_PATH);

    // Step 5: Upload the compressed file
    const remoteArchivePath = path.posix.join(REMOTE_PATH, 'spa.zip');
    await uploadFile(client, ARCHIVE_PATH, remoteArchivePath);

    // Call the function at the end of your publish process
    await triggerDeployment();

    console.log('Upload and extraction completed successfully.');
  } catch (error) {
    console.error('Error during process:', error.message);
  } finally {
    // Clean up: Delete the local archive file
    if (fs.existsSync(ARCHIVE_PATH)) {
      fs.unlinkSync(ARCHIVE_PATH);
      console.log('Local archive deleted.');
    }

    // Close the FTP connection
    await client.close();
    console.log('Disconnected from FTP server.');
  }
}

// Start the process
main();
