<template>
  <entity-index
    ref="entityIndexRef"
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
      <template v-else-if="inputData.col.name === 'transaction_status'">
        <span :class="{'text-green': inputData.props.row.transaction_status === 'paid', 'text-red': inputData.props.row.transaction_status === 'unpaid'}">
          {{ inputData.props.row.transaction_status_label }}
        </span>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
            <delete-btn :row="inputData.props.row"
                        :api="transactionAPI"
                        :use-flag="false"
                        @change="afterRemove"
            />
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
import { useQuasar } from 'quasar';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import { useBuildingStore } from 'src/stores/building';
import DeleteBtn from 'src/components/controls/deleteBtn.vue';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import TransactionAPI, { type TransactionType,
  transactionStatusOptions,
  transactionPaymentMethodOptions } from 'src/repositories/transaction';

const $q = useQuasar();
const dateManager = useDate();
const buildingStore = useBuildingStore();
const transactionAPI = new TransactionAPI();

const api = ref(transactionAPI.endpoints.base);
const label = ref('تراکنش‌ها');
const createRouteName = ref('Panel.Transaction.Income.Create');
const showRouteName = ref('Panel.Transaction.Income.Show');
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
      name: 'unit_id',
      required: true,
      label: 'شناسه واحد',
      align: 'left',
      field: (row: TransactionType) => row.unit_id,
    },
    {
      name: 'invoice_distribution_id',
      required: true,
      label: 'شناسه توزیع فاکتور',
      align: 'left',
      field: (row: TransactionType) => row.invoice_distribution_id,
    },
    {
      name: 'amount',
      required: true,
      label: 'مقدار',
      align: 'left',
      field: (row: TransactionType) => row.amount?.toString().toLocaleString(),
    },
    {
      name: 'payment_method',
      required: true,
      label: 'روش پرداخت',
      align: 'left',
      field: (row: TransactionType) => row.payment_method_label,
    },
    {
      name: 'receipt_image',
      required: true,
      label: 'تصویر رسید',
      align: 'left',
      field: (row: TransactionType) => (row.receipt_image ? 'دارد' : 'ندارد'),
    },
    {
      name: 'authority',
      required: true,
      label: 'کد مرجع',
      align: 'left',
      field: (row: TransactionType) => row.authority,
    },
    {
      name: 'transactionID',
      required: true,
      label: 'شناسه تراکنش',
      align: 'left',
      field: (row: TransactionType) => row.transactionID,
    },
    {
      name: 'transaction_status',
      required: true,
      label: 'وضعیت تراکنش',
      align: 'left',
      field: (row: TransactionType) => row.transaction_status_label,
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: TransactionType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
              row.created_at,
              'YYYY-MM-DDThh:mm:ss',
              'hh:mm:ss jYYYY/jMM/jDD',
            )
          : '-',
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
    type: 'hidden',
    name: 'transaction_type',
    value: 'building_income'
  },
  {
    type: 'hidden',
    name: 'building_id',
    value: buildingStore.buildingId
  },
  {
    type: 'select',
    name: 'payment_method',
    label: 'روش پرداخت',
    options: transactionPaymentMethodOptions,
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'number',
    name: 'min_amount',
    label: 'حداقل مقدار',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'number',
    name: 'max_amount',
    label: 'حداکثر مقدار',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]);
const entityIndexRef = ref();

function afterRemove () {
  entityIndexRef.value.reload()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}
</script>
