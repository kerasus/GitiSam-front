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
      <template v-if="inputData.col.name === 'current_balance'">
        <currency-number :number="inputData.props.row.current_balance"
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
import BuildingAPI from 'src/repositories/building';
import CurrencyNumber from 'components/CurrencyNumber.vue';

const buildingAPI = new BuildingAPI();
const dateManager = useDate();

const api = ref(buildingAPI.endpoints.base);
const label = ref('ساختمان‌ها');
const createRouteName = ref('Panel.Building.Create');
const showRouteName = ref('Panel.Building.Show');
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
    {
      name: 'name',
      required: true,
      label: 'نام ساختمان',
      align: 'left',
      field: (row: any) => row.name,
    },
    {
      name: 'address',
      required: true,
      label: 'آدرس',
      align: 'left',
      field: (row: any) => row.address,
    },
    {
      name: 'city',
      required: true,
      label: 'شهر',
      align: 'left',
      field: (row: any) => row.city,
    },
    {
      name: 'district',
      required: true,
      label: 'منطقه',
      align: 'left',
      field: (row: any) => row.district,
    },
    {
      name: 'current_balance',
      required: true,
      label: 'تراز مالی',
      align: 'left',
      field: (row: any) => row.current_balance,
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: any) =>
        dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD'),
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
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'desc'
  },
]);
</script>
