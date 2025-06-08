<template>
  <entity-show
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityShow } from 'quasar-crud';
import InvoiceCategoryAPI from 'src/repositories/invoiceCategory';

const invoiceCategoryAPI = new InvoiceCategoryAPI();
const route = useRoute();

const invoiceCategoryId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(invoiceCategoryAPI.endpoints.byId(invoiceCategoryId.value));
const label = ref('مشاهده دسته فاکتور');
const indexRouteName = ref('Panel.InvoiceCategory.List');
const showRouteName = ref('Panel.InvoiceCategory.Show');
const editRouteName = ref('Panel.InvoiceCategory.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
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
