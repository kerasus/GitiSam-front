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
import InvoiceDistributionAPI, {
  invoiceDistributionMethodOptions,
  invoiceDistributionStatusOptions
} from 'src/repositories/invoiceDistribution';

const invoiceDistributionAPI = new InvoiceDistributionAPI();

const api = ref(invoiceDistributionAPI.endpoints.base);
const label = ref('ایجاد توزیع فاکتور جدید');
const indexRouteName = ref('Panel.InvoiceDistribution.List');
const showRouteName = ref('Panel.InvoiceDistribution.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'number',
    name: 'invoice_id',
    responseKey: 'invoice_id',
    label: 'شناسه فاکتور',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'number',
    name: 'unit_id',
    responseKey: 'unit_id',
    label: 'شناسه واحد',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'distribution_method',
    responseKey: 'distribution_method',
    label: 'روش توزیع',
    readonly: true,
    options: invoiceDistributionMethodOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'number',
    name: 'amount',
    responseKey: 'amount',
    label: 'مقدار',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'status',
    responseKey: 'status',
    label: 'وضعیت',
    options: invoiceDistributionStatusOptions,
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]);
</script>
