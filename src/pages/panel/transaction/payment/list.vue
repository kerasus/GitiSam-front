<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
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
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import { useBuildingStore } from 'src/stores/building';
import DeleteBtn from 'src/components/controls/deleteBtn.vue';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import TransactionAPI, {
  type TransactionType,
  transactionStatusOptions,
  transactionTargetGroupOptions,
  transactionPaymentMethodOptions
} from 'src/repositories/transaction';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const dateManager = useDate();
const buildingStore = useBuildingStore();
const transactionAPI = new TransactionAPI();

const api = ref(transactionAPI.endpoints.base);
const label = ref('تراکنش‌ها');
const showRouteName = ref('Panel.Transaction.Payment.Show');
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
      name: 'unit_number',
      required: true,
      label: 'شماره واحد',
      align: 'left',
      field: (row: TransactionType) => row.unit?.unit_number,
    },
    {
      name: 'target_group',
      required: true,
      label: 'پرداخت کننده',
      align: 'left',
      field: (row: TransactionType) => row.target_group_label,
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
      name: 'paid_at',
      required: true,
      label: 'زمان پرداخت',
      align: 'left',
      field: (row: TransactionType) =>
        row.paid_at
          ? dateManager.miladiToShamsi(
            row.paid_at,
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
    value: 'unit_transaction'
  },
  {
    type: 'hidden',
    name: 'building_id',
    value: buildingStore.buildingId
  },
  {
    type: 'input',
    name: 'unitNumber',
    label: 'شماره واحد',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'target_group',
    label: 'پرداخت کننده',
    options: transactionTargetGroupOptions,
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'payment_method',
    label: 'روش پرداخت',
    options: transactionPaymentMethodOptions,
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  }
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
