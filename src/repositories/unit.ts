import type { ListType } from './BaseAPI';
import BaseAPI from './BaseAPI';
import { type UserType  } from './user';
import type { AxiosResponse } from 'axios';
import { type BuildingType } from './building';

export type UnitType = {
  id: number | null;
  building: BuildingType | null;
  building_id: number | null;
  unit_number: string | null;
  type: ('residential' | 'commercial') | null;
  type_label: string | null;
  area: number | null;
  floor: number | null;
  resident_base_balance: number | null;
  owner_base_balance: number | null;
  resident_paid_amount: number | null;
  owner_paid_amount: number | null;
  owner_debt: number | null;
  resident_debt: number | null;
  total_debt: number | null;
  current_balance: number | null;
  current_owner_balance: number | null;
  current_resident_balance: number | null;
  number_of_residents: number | null;
  number_of_rooms: number | null;
  parking_spaces: number | null;
  owners: UserType[];
  residents: UserType[];
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const unitTypeOptions = [
  { value: 'residential', label: 'مسکونی'},
  { value: 'commercial', label: 'تجاری'}
]

export function getUnitUserFullname (ownerOrResidents: UserType | UserType[] | undefined): string {
  if (!ownerOrResidents) {
    return '-'
  }
  if (Array.isArray(ownerOrResidents)) {
    const first = ownerOrResidents[0];
    if (!first) {
      return '-'
    }

    return first.firstname + ' ' + first.lastname
  }

  return ownerOrResidents.firstname + ' ' + ownerOrResidents.lastname
}

export default class UnitAPI extends BaseAPI<UnitType> {
  constructor() {
    super('/units');
    this.defaultObject = {
      id: null,
      building: null,
      building_id: null,
      unit_number: null,
      type: null,
      type_label: null,
      area: null,
      floor: null,
      resident_base_balance: null,
      owner_base_balance: null,
      resident_paid_amount: null,
      owner_paid_amount: null,
      owner_debt: null,
      resident_debt: null,
      total_debt: null,
      current_balance: null,
      current_owner_balance: null,
      current_resident_balance: null,
      number_of_residents: null,
      number_of_rooms: null,
      parking_spaces: null,
      owners: [],
      residents: [],
      description: null,
      created_at: null,
      updated_at: null,
    };
    // Override the endpoints
    this.endpoints = {
      ...this.endpoints,
      publicIndex: `${this.baseEndpoint}/publicIndex`,
      sendDebtSMS: (unitId: number, targetGroup: 'resident' | 'owner' ) => `${this.baseEndpoint}/${unitId}/${targetGroup}/send-debt-sms`,
      sendLoginInfo: (unitId: number) => `${this.baseEndpoint}/${unitId}/send-login-info`,
      getBalance: (unitId: number) => `${this.baseEndpoint}/${unitId}/get_balance`,
      updateBalance: (unitId: number) => `${this.baseEndpoint}/${unitId}/update_balance`,
      attachUser: (unitId: number) => `${this.baseEndpoint}/${unitId}/attach-user`,
      detachUser: (unitId: number, userId: number) => `${this.baseEndpoint}/${unitId}/detach-user/${userId}`
    }
  }

  async publicIndex(filters: any = { length: 10 }): Promise<ListType<UnitType>> {
    return new Promise((resolve, reject) => {
      this.getAxiosInstanceWithoutToken()
        .get(this.endpoints.publicIndex, {
          params: this.getNormalizedIndexFilter(filters),
        })
        .then((response) => {
          const normalizedListType = this.getNormalizedListType(response);
          normalizedListType.data = this.getNormalizedList(normalizedListType.data);
          resolve(normalizedListType);
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    });
  }

  async getBalance(unitId: number): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithoutToken()
        .get(this.endpoints.getBalance(unitId));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

  async updateBalance(unitId: number): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.updateBalance(unitId));
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

  async sendDebtSMS(unitId: number, targetGroup: 'resident' | 'owner'): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.sendDebtSMS(unitId, targetGroup));
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async sendLoginInfo(unitId: number, userId: number): Promise<UnitType> {
    try {
      const response: AxiosResponse<UnitType> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.sendLoginInfo(unitId), { user_id: userId });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async attachUser(unitId: number, data: { user_id: string, role: 'resident' | 'owner' }): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.attachUser(unitId), data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

  async detachUser(unitId: number, userId: number): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.getAxiosInstanceWithToken()
        .delete(this.endpoints.detachUser(unitId, userId));
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
