import BaseAPI from './BaseAPI';
import type { AxiosResponse } from 'axios';
import type { ImageType } from './invoice';
import type { UnitType } from 'src/repositories/unit';

export type TransactionType = {
  id: number | null;
  user_id: number | null;
  unit_id: number | null;
  unit: UnitType | null;
  images: ImageType[];
  invoice_distribution_id: number | null;
  amount: number | null;
  payment_method: string | null;
  payment_method_label: string | null;
  receipt_image: string | null;
  authority: string | null;
  transactionID: string | null;
  transaction_status: string | null;
  transaction_status_label: string | null;
  target_group: 'owner' | 'resident' | null;
  target_group_label: string | null;
  description: string | null;
  paid_at: string | null;
  verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const transactionPaymentMethodOptions = [
  { label: 'پرداخت با درگاه زرین پال', value: 'bank_gateway_zarinpal' },
  { label: 'پرداخت با درگاه بانک سامان', value: 'bank_gateway_saman' },
  { label: 'انتقال وجه موبایل بانک', value: 'mobile_banking' },
  { label: 'انتقال وجه ATM', value: 'atm' },
  { label: 'انتقال وجه نقدی', value: 'cash' },
  { label: 'انتقال وجه چک', value: 'check' },
]

export const transactionStatusOptions = [
  { label: 'انتقال به پرداخت', value: 'transferred_to_pay' },
  { label: 'ناکام', value: 'unsuccessful' },
  { label: 'پرداخت شده', value: 'paid' },
  { label: 'پرداخت نشده', value: 'unpaid' },
]

export const transactionTargetGroupOptions = [
  { label: 'مالک', value: 'owner' },
  { label: 'ساکن', value: 'resident' },
]

export default class TransactionAPI extends BaseAPI<TransactionType> {
  constructor() {
    super('/transactions');
    this.defaultObject = {
      id: null,
      user_id: null,
      unit_id: null,
      unit: null,
      images: [],
      invoice_distribution_id: null,
      amount: null,
      payment_method: null,
      payment_method_label: null,
      receipt_image: null,
      authority: null,
      transactionID: null,
      transaction_status: null,
      transaction_status_label: null,
      target_group: null,
      target_group_label: null,
      description: null,
      paid_at: null,
      verified_at: null,
      created_at: null,
      updated_at: null,
    };
    // Override the endpoints
    this.endpoints = {
      ...this.endpoints,
      storeIncome: `${this.baseEndpoint}/store_income`,
      redirectToGateway: `${this.baseEndpoint}/redirect-to-gateway`,
      getPublicData: (transactionId: number) => `${this.baseEndpoint}/${transactionId}/public-data`,
      attachImage: (transactionId: number) => `${this.baseEndpoint}/${transactionId}/attach-image`,
      detachImage: (transactionId: number, imageId: number) => `${this.baseEndpoint}/${transactionId}/detach-image/${imageId}`
    }
  }

  async getPublicData(id: number): Promise<TransactionType> {
    const a = this.getAxiosInstanceWithoutToken();
    const url = this.endpoints.getPublicData(id);
    const response = await a.get(url);

    return this.getNormalizedItem(this.normalize(response.data, this.defaultObject));
  }

  /**
   * Redirect user to Zarinpal payment gateway.
   * @param data - The transaction data including user_id, unit_id, amount, and description.
   * @returns The redirect URL to the payment gateway.
   */
  async redirectToGateway(data: Partial<TransactionType>): Promise<string> {
    try {
      // Validate required fields
      if (!data.user_id || !data.unit_id || !data.amount || !data.description) {
        throw new Error('Missing required fields: user_id, unit_id, amount, or description');
      }

      // Send POST request to the server
      const response: AxiosResponse<string> = await this.getAxiosInstanceWithToken().post(
        this.endpoints.redirectToGateway,
        {
          user_id: data.user_id,
          unit_id: data.unit_id,
          target_group: data.target_group,
          amount: data.amount,
          description: data.description,
        }
      );

      // Return the redirect URL
      // return response.data.redirect_url; // for zarinpal
      return response.data; // for saman
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Access the message property
      } else {
        throw new Error('An unknown error occurred while redirecting to the payment gateway');
      }
    }
  }

  async attachImage(transactionId: number, formData: FormData): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.attachImage(transactionId), formData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

  async detachImage(transactionId: number, imageId: number): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .delete(this.endpoints.detachImage(transactionId, imageId));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }
}
