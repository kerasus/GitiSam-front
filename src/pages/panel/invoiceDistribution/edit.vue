<template>
  <entity-edit
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import InvoiceDistributionAPI from 'src/repositories/invoiceDistribution';

const invoiceDistributionAPI = new InvoiceDistributionAPI();
const route = useRoute();

const invoiceDistributionId = computed(() =>
  route.params.id ? parseInt(route.params.id?.toString()) : 0,
);

const api = ref(invoiceDistributionAPI.endpoints.byId(invoiceDistributionId.value));
const label = ref('ویرایش توزیع فاکتور');
const indexRouteName = ref('Panel.InvoiceDistribution.List');
const showRouteName = ref('Panel.InvoiceDistribution.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs()
]);
</script>
