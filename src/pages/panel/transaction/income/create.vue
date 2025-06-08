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
import { ref } from 'vue';
import { EntityCreate } from 'quasar-crud';
import { useBuildingStore } from 'src/stores/building';
import TransactionAPI from 'src/repositories/transaction';

const buildingStore = useBuildingStore();
const transactionAPI = new TransactionAPI();

const api = ref(transactionAPI.endpoints.storeIncome);
const label = ref('تراکنش جدید');
const indexRouteName = ref('Panel.Transaction.Income.List');
const showRouteName = ref('Panel.Transaction.Income.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  ...getInputs(buildingStore.buildingId)
]);
</script>
