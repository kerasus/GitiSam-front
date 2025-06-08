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
import { ref, onMounted } from 'vue';
import { EntityCreate } from 'quasar-crud';
import UnitAPI, { unitTypeOptions } from 'src/repositories/unit';
import BuildingApi from 'src/repositories/building';
import { FormBuilderAssist } from 'quasar-form-builder';

const unitAPI = new UnitAPI();
const buildingApi = new BuildingApi();

const api = ref(unitAPI.endpoints.base);
const label = ref('واحد جدید');
const indexRouteName = ref('Panel.Unit.List');
const showRouteName = ref('Panel.Unit.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'select',
    name: 'building_id',
    responseKey: 'building_id',
    label: 'ساختمان',
    options: [],
    optionValue: 'id',
    optionLabel: 'name',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'type',
    responseKey: 'type',
    label: 'نوع واحد',
    options: unitTypeOptions,
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'floor',
    responseKey: 'floor',
    label: 'طبقه',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'unit_number',
    responseKey: 'unit_number',
    label: 'شماره واحد',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'area',
    responseKey: 'area',
    label: 'مساحت',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'number_of_residents',
    responseKey: 'number_of_residents',
    label: 'تعداد ساکنین',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'number_of_rooms',
    responseKey: 'number_of_rooms',
    label: 'تعداد اتاق‌ها',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'parking_spaces',
    responseKey: 'parking_spaces',
    label: 'فضای پارکینگ',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  { type: 'separator', name: 'space', size: '0', col: 'col-md-12' },
  {
    type: 'input',
    name: 'resident_name',
    responseKey: 'resident_name',
    label: 'نام ساکن',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'resident_phone',
    responseKey: 'resident_phone',
    label: 'تلفن ساکن',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'owner_name',
    responseKey: 'owner_name',
    label: 'نام مالک',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'owner_phone',
    responseKey: 'owner_phone',
    label: 'تلفن مالک',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]);

async function loadInputOptions() {
  const result = await buildingApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(inputs.value, 'building_id', 'options', result.data);
}

onMounted(() => {
  loadInputOptions();
});
</script>
