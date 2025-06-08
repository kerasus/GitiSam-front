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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import BuildingAPI from 'src/repositories/building';

const buildingAPI = new BuildingAPI();
const route = useRoute();

const buildingId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(buildingAPI.endpoints.byId(buildingId.value));
const label = ref('ویرایش ساختمان');
const indexRouteName = ref('Panel.Building.List');
const showRouteName = ref('Panel.Building.Show');
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
