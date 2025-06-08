import BaseAPI from './BaseAPI';

export type BuildingType = {
  id: number | null;
  name: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  total_income: number | null;
  base_balance: number | null;
  paid_amount: number | null;
  total_debt: number | null;
  current_balance: number | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string | null;
  updated_at: string | null;
};
export default class BuildingAPI extends BaseAPI<BuildingType> {
  constructor() {
    super('/buildings');
    this.defaultObject = {
      id: null,
      name: null,
      address: null,
      city: null,
      district: null,
      latitude: null,
      longitude: null,
      total_income: null,
      base_balance: null,
      paid_amount: null,
      total_debt: null,
      current_balance: null,
      created_at: null,
      updated_at: null,
    };
  }
}
