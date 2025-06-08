import BaseAPI from './BaseAPI';
import { type InvoiceCategoryType } from './invoiceCategory';
import { type InvoiceDistributionType } from './invoiceDistribution';
import type { AxiosResponse } from 'axios';
import type { UnitType } from 'src/repositories/unit';

export interface ImageType {
  id: number;
  url: string;
  imageable_id: number;
  imageable_type: string;
}

export type InvoiceType = {
  id: number | null;
  title: string | null;
  description: string | null;
  amount: number | null;
  due_date: string | null; // ISO date format
  images: ImageType[];
  invoice_category_id: number | null;
  invoice_category: InvoiceCategoryType | null;
  invoice_distributions: InvoiceDistributionType[];
  status_label: string | null;
  status: 'unpaid' | 'paid' | 'pending' | 'cancelled' | null;
  target_group: 'owner' | 'resident' | null;
  target_group_label: string | null;
  type: 'monthly_charge' | 'planned_expense' | 'unexpected_expense' | null;
  type_label: string | null;
  is_covered_by_monthly_charge: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export const invoiceTypeOptions = [
  { label: 'شارژ ماهیانه', value: 'monthly_charge' },
  { label: 'هزینه‌های پیش‌بینی‌ شده', value: 'planned_expense' },
  { label: 'هزینه های پیش‌بینی‌ نشده', value: 'unexpected_expense' },
];

export const invoiceStatusOptions = [
  { label: 'لغو شده', value: 'cancelled' },
  { label: 'در حال بررسی', value: 'pending' },
  { label: 'پرداخت شده', value: 'paid' },
  { label: 'پرداخت نشده', value: 'unpaid' },
]

export const invoiceTargetGroupOptions = [
  { label: 'ساکنین', value: 'resident' },
  { label: 'مالکین', value: 'owner' },
]

export default class InvoiceAPI extends BaseAPI<InvoiceType> {
  constructor() {
    super('/invoices');
    this.defaultObject = {
      id: null,
      title: null,
      description: null,
      amount: null,
      due_date: null,
      images: [],
      invoice_distributions: [],
      invoice_category: null,
      invoice_category_id: null,
      status_label: null,
      status: null,
      target_group: null,
      target_group_label: null,
      type: null,
      type_label: null,
      is_covered_by_monthly_charge: null,
      created_at: null,
      updated_at: null,
    };
    // Override the endpoints
    this.endpoints = {
      ...this.endpoints,
      attachImageToInvoice: (invoiceId: number) => `${this.baseEndpoint}/${invoiceId}/attach-image`,
      detachImageFromInvoice: (invoiceId: number, imageId: number) => `${this.baseEndpoint}/${invoiceId}/detach-image/${imageId}`
    }
  }

  async attachImageToInvoice(invoiceId: number, formData: FormData): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.attachImageToInvoice(invoiceId), formData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

  async detachImageFromInvoice(invoiceId: number, imageId: number): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .delete(this.endpoints.detachImageFromInvoice(invoiceId, imageId));
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
