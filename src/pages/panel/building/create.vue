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
import BuildingAPI from 'src/repositories/building';

const buildingAPI = new BuildingAPI();

const api = ref(buildingAPI.endpoints.base);
const label = ref('ساختمان جدید');
const indexRouteName = ref('Panel.Building.List');
const showRouteName = ref('Panel.Building.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'input',
    name: 'name',
    responseKey: 'name',
    label: 'نام ساختمان',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'address',
    responseKey: 'address',
    label: 'آدرس',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'city',
    responseKey: 'city',
    label: 'شهر',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'district',
    responseKey: 'district',
    label: 'منطقه',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'latitude',
    responseKey: 'latitude',
    label: 'عرض جغرافیایی',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'longitude',
    responseKey: 'longitude',
    label: 'طول جغرافیایی',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]);
</script>
