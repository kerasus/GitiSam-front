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
      <template v-if="inputData.col.name === 'amount'">
        <currency-number :number="inputData.props.row.amount" />
      </template>
      <template v-else-if="inputData.col.name === 'status'">
        <span :class="{'text-green': inputData.props.row.status === 'paid', 'text-red': inputData.props.row.status === 'unpaid'}">
          {{ inputData.props.row.status_label }}
        </span>
      </template>
      <template v-else-if="inputData.col.name === 'is_covered_by_monthly_charge'">
        <span :class="{'text-green': inputData.props.row.is_covered_by_monthly_charge, 'text-red': !inputData.props.row.is_covered_by_monthly_charge}">
          <template v-if="inputData.props.row.is_covered_by_monthly_charge">
            بله
          </template>
          <template v-else>
            خیر
          </template>
        </span>
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
import { ref, onMounted } from 'vue';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import { FormBuilderAssist } from 'quasar-form-builder';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import InvoiceCategoryApi from 'src/repositories/invoiceCategory';
import InvoiceAPI, { invoiceTargetGroupOptions, type InvoiceType } from 'src/repositories/invoice';

const dateManager = useDate();
const invoiceAPI = new InvoiceAPI();
const invoiceCategoryApi = new InvoiceCategoryApi();

const api = ref(invoiceAPI.endpoints.base);
const label = ref('فاکتورها');
const createRouteName = ref('Panel.Invoice.Create');
const showRouteName = ref('Panel.Invoice.Show');
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
      name: 'invoice_category',
      required: true,
      label: 'دسته فاکتور',
      align: 'left',
      field: (row: InvoiceType) => row.invoice_category?.name,
    },
    {
      name: 'title',
      required: true,
      label: 'عنوان فاکتور',
      align: 'left',
      field: (row: InvoiceType) => row.title,
    },
    {
      name: 'target_group',
      required: true,
      label: 'پرداخت کننده',
      align: 'left',
      field: (row: InvoiceType) => row.target_group_label,
    },
    {
      name: 'is_covered_by_monthly_charge',
      required: true,
      label: 'تحت پوشش شارژ ماهیانه',
      align: 'left',
      field: (row: InvoiceType) => row.is_covered_by_monthly_charge,
    },
    {
      name: 'amount',
      required: true,
      label: 'مبلغ',
      align: 'left',
      field: (row: InvoiceType) => row.amount?.toString().toLocaleString(),
    },
    {
      name: 'due_date',
      required: true,
      label: 'تاریخ سررسید',
      align: 'left',
      field: (row: InvoiceType) =>
        row.due_date
          ? dateManager.miladiToShamsi(row.due_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD')
          : '-',
    },
    {
      name: 'status',
      required: true,
      label: 'وضعیت',
      align: 'left',
      field: (row: InvoiceType) => row.status_label,
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
    type: 'select',
    name: 'target_group',
    responseKey: 'target_group',
    label: 'پرداخت کننده',
    options: invoiceTargetGroupOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'invoice_category_id',
    label: 'دسته فاکتور',
    options: [],
    optionValue: 'id',
    optionLabel: 'name',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'input',
    name: 'title',
    label: 'عنوان فاکتور',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
]);

async function loadInputOptions() {
  const result = await invoiceCategoryApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(inputs.value, 'invoice_category_id', 'options', result.data);
}

onMounted(() => {
  loadInputOptions();
});
</script>
