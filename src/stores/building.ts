import { defineStore } from 'pinia'

export interface State {
  buildingId: number
}

export const useBuildingStore = defineStore('building', {
  state: (): State => {
    return {
      buildingId: 1
    }
  }
})
