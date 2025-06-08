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
import getInputs from './inputs';
import { ref, computed, watch, onMounted } from 'vue';
import { EntityCreate } from 'quasar-crud';
import InvoiceAPI from 'src/repositories/invoice';
import { FormBuilderAssist } from 'quasar-form-builder';
import InvoiceCategoryApi from 'src/repositories/invoiceCategory';

const invoiceAPI = new InvoiceAPI();
const invoiceCategoryApi = new InvoiceCategoryApi();

const api = ref(invoiceAPI.endpoints.base);
const label = ref('ایجاد فاکتور جدید');
const indexRouteName = ref('Panel.Invoice.List');
const showRouteName = ref('Panel.Invoice.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref(getInputs());

const selectedInvoiceType = computed(() => FormBuilderAssist.getInputsByName(inputs.value, 'type')?.value)

async function loadInputOptions() {
  const result = await invoiceCategoryApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(inputs.value, 'invoice_category_id', 'options', result.data);
}

watch(selectedInvoiceType, (newValue)=>{
  if (newValue === 'monthly_charge') {
    FormBuilderAssist.setAttributeByName(inputs.value, 'is_covered_by_monthly_charge', 'readonly', true);
    FormBuilderAssist.setAttributeByName(inputs.value, 'is_covered_by_monthly_charge', 'value', false);
  } else {
    FormBuilderAssist.setAttributeByName(inputs.value, 'is_covered_by_monthly_charge', 'readonly', false);
    FormBuilderAssist.setAttributeByName(inputs.value, 'is_covered_by_monthly_charge', 'value', true);
  }
})

onMounted(() => {
  loadInputOptions();
});
</script>
