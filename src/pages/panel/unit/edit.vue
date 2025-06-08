<template>
  <entity-edit
    :key="entityEditKey"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :after-load-input-data="afterLoadInputData"
  />

  <q-separator class="q-my-md" />

  <q-card v-if="unitData">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-12">
          <unit-user-list :unit-id="unitId"
                          :users="unitData.residents"
                          user-role="resident"
                          :edit-mode="true"
                          @change="onChangehUsers"
          />
        </div>
        <div class="col-md-6 col-12">
          <unit-user-list :unit-id="unitId"
                          :users="unitData.owners"
                          user-role="owner"
                          :edit-mode="true"
                          @change="onChangehUsers"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import { computed, ref, onMounted } from 'vue';
import BuildingApi from 'src/repositories/building';
import { FormBuilderAssist } from 'quasar-form-builder';
import UnitUserList from 'src/components/unitUserList.vue';
import UnitAPI, { type UnitType } from 'src/repositories/unit';

const route = useRoute();
const unitAPI = new UnitAPI();
const buildingApi = new BuildingApi();

const entityEditKey = ref(Date.now());
const unitData = ref<UnitType | null>(null);
const unitId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));
const api = ref(unitAPI.endpoints.byId(unitId.value));
const label = ref('ویرایش واحد');
const indexRouteName = ref('Panel.Unit.List');
const showRouteName = ref('Panel.Unit.Show');
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

async function loadInputOptions() {
  const result = await buildingApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(
    inputs.value,
    'building_id',
    'options',
    result.data,
  );
}

function afterLoadInputData(data: UnitType) {
  unitData.value = data;
}

function onChangehUsers () {
  entityEditKey.value = Date.now();
}

onMounted(() => {
  loadInputOptions();
});
</script>
