import BaseAPI from './BaseAPI';

export type InvoiceCategoryType = {
  id: number | null;
  name: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class InvoiceCategoryAPI extends BaseAPI<InvoiceCategoryType> {
  constructor() {
    super('/invoice-categories');
    this.defaultObject = {
      id: null,
      name: null,
      description: null,
      created_at: null,
      updated_at: null,
    };
  }
}
