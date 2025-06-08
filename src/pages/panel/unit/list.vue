<template>
  <entity-index
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey"
  >
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'current_resident_balance'">
        <currency-number :number="inputData.props.row.current_resident_balance"
                         show-status-color/>
      </template>
      <template v-else-if="inputData.col.name === 'current_owner_balance'">
        <currency-number :number="inputData.props.row.current_owner_balance"
                         show-status-color/>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }"
          />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import { useAppConfig } from 'src/stores/appConfig';
import { useBuildingStore } from 'src/stores/building';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import UnitAPI, { type UnitType, getUnitUserFullname } from 'src/repositories/unit';

const unitAPI = new UnitAPI();
const dateManager = useDate();
const appConfigManager = useAppConfig();
const buildingStore = useBuildingStore();

const api = ref(unitAPI.endpoints.base);
const label = ref('واحد‌ها');
const createRouteName = ref('Panel.Unit.Create');
const showRouteName = ref('Panel.Unit.Show');
const itemIdentifyKey = ref('id');

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});

const table = ref({
  columns: [
    // {
    //   name: 'unit_number',
    //   required: true,
    //   label: 'ساختمان',
    //   align: 'left',
    //   field: (row: UnitType) => row.building?.name,
    // },
    {
      name: 'floor',
      required: true,
      label: 'طبقه',
      align: 'left',
      field: (row: UnitType) => row.floor,
    },
    {
      name: 'unit_number',
      required: true,
      label: 'شماره واحد',
      align: 'left',
      field: (row: UnitType) => row.unit_number,
    },
    {
      name: 'resident_name',
      required: true,
      label: 'ساکن',
      align: 'left',
      field: (row: UnitType) => getUnitUserFullname(row.residents),
    },
    {
      name: 'number_of_residents',
      required: true,
      label: 'نعداد ساکنین',
      align: 'left',
      field: (row: UnitType) => row.number_of_residents,
    },
    {
      name: 'area',
      required: true,
      label: 'مساحت',
      align: 'left',
      field: (row: UnitType) => row.area,
    },
    {
      name: 'parking_spaces',
      required: true,
      label: 'تعداد پارکینگ',
      align: 'left',
      field: (row: UnitType) => row.parking_spaces,
    },
    {
      name: 'owner_name',
      required: true,
      label: 'مالک',
      align: 'left',
      field: (row: UnitType) => getUnitUserFullname(row.owners),
    },
    {
      name: 'current_resident_balance',
      required: true,
      label: `تراز مالی ساکن (${appConfigManager.currencyUnit})`,
      align: 'left',
      field: (row: any) => row.current_owner_balance,
    },
    {
      name: 'current_owner_balance',
      required: true,
      label: `تراز مالی مالک (${appConfigManager.currencyUnit})`,
      align: 'left',
      field: (row: any) => row.current_owner_balance,
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: UnitType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-',
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => '',
    },
  ],
});

const inputs = ref([
  // {
  //   type: 'hidden',
  //   name: 'sortation_field',
  //   value: 'created_at'
  // },
  // {
  //   type: 'hidden',
  //   name: 'sortation_order',
  //   value: 'asc'
  // },
  {
    type: 'hidden',
    name: 'length',
    value: 30
  },
  {
    type: 'hidden',
    name: 'building_id',
    value: buildingStore.buildingId,
  },
  {
    type: 'input',
    name: 'floor',
    label: 'شماره طبقه',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'input',
    name: 'unit_number',
    label: 'شماره واحد',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'checkbox',
    name: 'negativeBalance',
    label: 'بدهکار',
    value: false,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  // {
  //   type: 'select',
  //   name: 'type',
  //   responseKey: 'type',
  //   label: 'نوع واحد',
  //   options: unitTypeOptions,
  //   placeholder: ' ',
  //   col: 'col-md-6 col-12',
  // }
]);
</script>
