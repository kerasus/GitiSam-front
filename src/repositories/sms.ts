import BaseAPI from './BaseAPI';
import type { AxiosResponse } from 'axios';

export type SMSType = {
  balance: number | null;
  message: string | null;
};

export default class SMSAPI extends BaseAPI<SMSType> {
  constructor() {
    super('/sms');
    this.defaultObject = {
      balance: null,
      message: null
    };
    // Override the endpoints
    this.endpoints = {
      ...this.endpoints,
      accountBalance: `${this.baseEndpoint}/account-balance`,
      sendDebtNotice: (targetGroup: 'resident' | 'owner') => `${this.baseEndpoint}/send-debt-notice/${targetGroup}`
    }
  }

  async getAccountBalance(): Promise<SMSType> {
    try {
      const response: AxiosResponse<SMSType> = await this.getAxiosInstanceWithToken()
        .get(this.endpoints.accountBalance);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on get account balance');
      }
    }
  }

  async sendDebtNotice(targetGroup: 'resident' | 'owner'): Promise<SMSType> {
    try {
      const response: AxiosResponse<SMSType> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.sendDebtNotice(targetGroup));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on get account balance');
      }
    }
  }
}
