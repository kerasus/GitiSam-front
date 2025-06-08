<template>
  <entity-create
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EntityCreate } from 'quasar-crud';
import TransactionAPI, {
  transactionStatusOptions,
  transactionPaymentMethodOptions,
} from 'src/repositories/transaction';

const transactionAPI = new TransactionAPI();

const api = ref(transactionAPI.endpoints.base);
const label = ref('تراکنش جدید');
const indexRouteName = ref('Panel.Transaction.Payment.List');
const showRouteName = ref('Panel.Transaction.Payment.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'input',
    name: 'unit_id',
    responseKey: 'unit_id',
    label: 'شناسه واحد',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'invoice_distribution_id',
    responseKey: 'invoice_distribution_id',
    label: 'شناسه توزیع فاکتور',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'amount',
    responseKey: 'amount',
    label: 'مقدار',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'payment_method',
    responseKey: 'payment_method',
    label: 'روش پرداخت',
    options: transactionPaymentMethodOptions,
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'file',
    name: 'receipt_image',
    responseKey: 'receipt_image',
    label: 'تصویر رسید',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'authority',
    responseKey: 'authority',
    label: 'کد مرجع',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'transactionID',
    responseKey: 'transactionID',
    label: 'شناسه تراکنش',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    responseKey: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]);
</script>
