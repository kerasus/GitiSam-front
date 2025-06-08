import BaseAPI from './BaseAPI';
import { type UnitType } from './unit';
import { type InvoiceType } from './invoice';

export type InvoiceDistributionType = {
  id: number | null;
  invoice_id: number | null;
  invoice: InvoiceType | null;
  unit: UnitType | null;
  unit_id: number | null;
  distribution_method: string | null;
  distribution_method_label: string | null;
  amount: number | null;
  paid_amount: number | null;
  current_balance: number | null;
  status: string | null;
  description: string | null;
  status_label: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InvoiceDistributionBulkTypeDistributionItem = {
  unit_id: number;
  status?: 'unpaid' | 'paid'| 'pending' | 'cancelled';
  amount?: number;
};

export type InvoiceDistributionBulkType = {
  invoice_id: number;
  distribution_method: 'equal' | 'per_person'| 'area' | 'parking' | 'custom';
  distributions: InvoiceDistributionBulkTypeDistributionItem[];
};

export const invoiceDistributionStatusOptions = [
  { label: 'پرداخت نشده', value: 'unpaid' },
  { label: 'پرداخت شده', value: 'paid' },
  { label: 'در حال بررسی', value: 'pending' },
  { label: 'لغو شده', value: 'cancelled' },
]

export const invoiceDistributionMethodOptions = [
  { label: 'برابر', value: 'equal' },
  { label: 'بر اساس تعداد نفرات', value: 'per_person' },
  { label: 'بر اساس متراژ', value: 'area' },
  { label: 'بر اساس پارکینگ', value: 'parking' },
  { label: 'دلخواه', value: 'custom' },
]

export default class InvoiceDistributionAPI extends BaseAPI<InvoiceDistributionType> {
  constructor() {
    super('/invoice-distributions');
    this.defaultObject = {
      id: null,
      invoice_id: null,
      invoice: null,
      unit: null,
      unit_id: null,
      distribution_method: null,
      distribution_method_label: null,
      amount: null,
      paid_amount: null,
      current_balance: null,
      status: null,
      description: null,
      status_label: null,
      created_at: null,
      updated_at: null,
    };
    // Override the endpoints
    this.endpoints = {
      ...this.endpoints,
      bulkStore: `${this.baseEndpoint}/bulk`
    }
  }

  async createBulk(data: InvoiceDistributionBulkType): Promise<void> {
    try {
      await this.getAxiosInstanceWithToken().post(
        this.endpoints.bulkStore,
        data,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Access the message property
      } else {
        throw new Error('An unknown error occurred on create'); // Handle non-Error types
      }
    }
  }
}
