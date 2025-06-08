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
import InvoiceCategoryAPI from 'src/repositories/invoiceCategory';

const invoiceCategoryAPI = new InvoiceCategoryAPI();

const api = ref(invoiceCategoryAPI.endpoints.base);
const label = ref('ایجاد دسته فاکتور جدید');
const indexRouteName = ref('Panel.InvoiceCategory.List');
const showRouteName = ref('Panel.InvoiceCategory.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'input',
    name: 'name',
    responseKey: 'name',
    label: 'نام دسته فاکتور',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'inputEditor',
    name: 'description',
    responseKey: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-md-12 col-12',
  },
]);
</script>
