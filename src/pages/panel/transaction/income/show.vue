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
import getInputs from './inputs';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityShow } from 'quasar-crud';
import { useBuildingStore } from 'src/stores/building';
import TransactionAPI from 'src/repositories/transaction';

const route = useRoute();
const buildingStore = useBuildingStore();
const transactionAPI = new TransactionAPI();

const transactionId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(transactionAPI.endpoints.byId(transactionId.value));
const label = ref('مشاهده تراکنش');
const indexRouteName = ref('Panel.Transaction.Income.List');
const showRouteName = ref('Panel.Transaction.Income.Show');
const editRouteName = ref('Panel.Transaction.Income.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs(buildingStore.buildingId)
]);
</script>
