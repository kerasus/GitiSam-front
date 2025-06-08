<template>
  <entity-create
    v-if="invoiceDistributionData"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
  />
  <q-linear-progress v-else indeterminate color="primary" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { EntityCreate } from 'quasar-crud';
import { computed, ref, onMounted } from 'vue';
import { transactionPaymentMethodOptions, transactionStatusOptions } from 'src/repositories/transaction';
import InvoiceDistributionAPI, { type InvoiceDistributionType } from 'src/repositories/invoiceDistribution';

const invoiceDistributionAPI = new InvoiceDistributionAPI();

const route = useRoute();
const invoiceDistributionData = ref<InvoiceDistributionType | null>(null);
const api = ref(invoiceDistributionAPI.endpoints.base);
const label = ref('ایجاد توزیع فاکتور جدید');
const indexRouteName = ref('Panel.InvoiceDistribution.List');
const showRouteName = ref('Panel.InvoiceDistribution.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const invoiceDistributionId = computed(() =>
  route.params.invoice_distribution_id ? parseInt(route.params.invoice_distribution_id?.toString()) : 0,
);
const unitId = computed(() =>
  route.params.unit_id ? parseInt(route.params.unit_id?.toString()) : 0,
);

const inputs = ref([
  {
    type: 'hidden',
    name: 'unit_id',
    responseKey: 'unit_id',
    value: unitId.value,
  },
  {
    type: 'hidden',
    name: 'invoice_distribution_id',
    responseKey: 'invoice_distribution_id',
    value: invoiceDistributionId.value,
  },
  {
    type: 'input',
    name: 'amount',
    responseKey: 'amount',
    label: 'مقدار',
    placeholder: ' ',
    value: invoiceDistributionData.value?.amount,
    readonly: true,
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

async function loadInvoiceDistributionAPI () {
  invoiceDistributionData.value = await invoiceDistributionAPI.get(invoiceDistributionId.value)
}

onMounted(async ()=>{
  await loadInvoiceDistributionAPI();
})
</script>
