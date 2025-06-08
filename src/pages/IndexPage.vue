<template>
  <q-linear-progress v-if="unitsLoading" indeterminate />
  <entity-index v-else
    :value="inputs"
    :title="label"
    :loaded-data="units"
    :table="table"
    :table-keys="tableKeys"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="false"
    :row-key="itemIdentifyKey"
  >
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'current_resident_balance'">
        <currency-number :number="inputData.props.row.current_resident_balance"
                         show-status-color/>
      </template>
      <template v-else-if="inputData.col.name === 'current_owner_balance'">
        <currency-number :number="inputData.props.row.current_owner_balance"
                         show-status-color/>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }"
          />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EntityIndex } from 'quasar-crud';
import { useAppConfig } from 'src/stores/appConfig';
import { useBuildingStore } from 'src/stores/building';
import type { ListType } from 'src/repositories/BaseAPI';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import UnitAPI, { type UnitType, getUnitUserFullname } from 'src/repositories/unit';

const unitAPI = new UnitAPI();
const appConfigManager = useAppConfig();
const buildingStore = useBuildingStore();

const unitsLoading = ref(false);
const label = ref('واحد های بدهکار');
const showRouteName = ref('Panel.Unit.Show');
const itemIdentifyKey = ref('id');
const units = ref<ListType<UnitType>>({
  data: [],
  current_page: 0,
  per_page: 0,
  from: 0,
  to: 0,
  total: 0
})

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});

const table = ref({
  columns: [
    {
      name: 'floor',
      required: true,
      label: 'طبقه',
      align: 'left',
      field: (row: UnitType) => row.floor,
    },
    {
      name: 'unit_number',
      required: true,
      label: 'شماره واحد',
      align: 'left',
      field: (row: UnitType) => row.unit_number,
    },
    {
      name: 'resident_name',
      required: true,
      label: 'ساکن',
      align: 'left',
      field: (row: UnitType) => getUnitUserFullname(row.residents),
    },
    {
      name: 'owner_name',
      required: true,
      label: 'مالک',
      align: 'left',
      field: (row: UnitType) => getUnitUserFullname(row.owners),
    },
    {
      name: 'current_resident_balance',
      required: true,
      label: `تراز مالی ساکن (${appConfigManager.currencyUnit})`,
      align: 'left',
      field: (row: any) => row.current_owner_balance,
    },
    {
      name: 'current_owner_balance',
      required: true,
      label: `تراز مالی مالک (${appConfigManager.currencyUnit})`,
      align: 'left',
      field: (row: any) => row.current_owner_balance,
    },
  ],
});

const inputs = ref([]);

async function getUnits () {
  try {
    unitsLoading.value = true;
    units.value = await unitAPI.publicIndex({
      building_id: buildingStore.buildingId,
      negativeBalance: 1,
      length: 50
    });
  } finally {
    unitsLoading.value = false;
  }
}

onMounted(async ()=>{
  await getUnits()
})
</script>
