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
      <template v-if="inputData.col.name === 'actions'">
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
import InvoiceCategoryAPI from 'src/repositories/invoiceCategory';

const dateManager = useDate();
const invoiceCategoryAPI = new InvoiceCategoryAPI();

const api = ref(invoiceCategoryAPI.endpoints.base);
const label = ref('دسته های فاکتور');
const createRouteName = ref('Panel.InvoiceCategory.Create');
const showRouteName = ref('Panel.InvoiceCategory.Show');
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
      label: 'نام دسته فاکتور',
      align: 'left',
      field: (row: any) => row.name,
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
  {
    type: 'input',
    name: 'name',
    label: 'نام دسته فاکتور',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'textarea',
    name: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]);
</script>
