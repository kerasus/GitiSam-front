<template>
  <div class="dashboard">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-md-3">
        <q-skeleton v-if="!buildingData" height="150px" />
        <dashboard-card-2 v-else
                           title="تراز مالی ساختمان"
                           icon="price_change"
                           :number-unit="appConfigManager.currencyUnit"
                           :number="buildingData.current_balance"
                           show-status-color />
      </div>
      <div class="col-md-3">
        <q-skeleton v-if="!smsAccountBalance" height="150px" />
        <dashboard-card-2 v-else
                           title="شارژ پنل پیامکی"
                           icon="price_change"
                           number-unit="عدد پیامک"
                           :number="smsAccountBalance"
                           show-status-color />
      </div>
      <div v-if="userManager.isManager || userManager.isAccountant" class="col-md-3 flex justify-center items-center">
        <q-btn color="primary" :loading="sendMonthlyDebtRemindersLoading"
               @click="sendMonthlyDebtReminders">
          ارسال پیامک اعلان شارژ ماهیانه
        </q-btn>
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-md justify-center">
      <div class="col-md-3">
        <q-skeleton v-if="!buildingData" height="150px" />
        <dashboard-card v-else title="تراز اولیه ساختمان" icon="account_balance" :number="buildingData.base_balance" />
      </div>
      <div class="col-md-3">
        <q-skeleton v-if="!buildingData" height="150px" />
        <dashboard-card v-else title="درآمد ساختمان" icon="account_balance" :number="buildingData.total_income" />
      </div>
      <div class="col-md-3">
        <q-skeleton v-if="!buildingData" height="150px" />
        <dashboard-card v-else title="جمع کل هزینه های ساختمان" icon="receipt_long" :number="buildingData.total_debt" />
      </div>
      <div class="col-md-3">
        <q-skeleton v-if="!buildingData" height="150px" />
        <dashboard-card v-else title="جمع کل پرداختی های ساختمان" icon="payments" :number="buildingData.paid_amount" />
      </div>
    </div>
  </div>

  <q-separator class="q-my-md" />

  <entity-index
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
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
import SMSAPI from 'src/repositories/sms';
import { useUser } from 'src/stores/user';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import BuildingAPI from 'src/repositories/building';
import { useAppConfig } from 'src/stores/appConfig';
import { useBuildingStore } from 'src/stores/building';
import DashboardCard from 'src/components/DashBoardCard.vue';
import DashboardCard2 from 'src/components/DashBoardCard2.vue';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import UnitAPI, { type UnitType, getUnitUserFullname } from 'src/repositories/unit';

const smsAPI = new SMSAPI();
const userManager = useUser();
const dateManager = useDate();
const unitAPI = new UnitAPI();
const buildingAPI = new BuildingAPI();
const appConfigManager = useAppConfig();
const buildingStore = useBuildingStore();

const buildingData = ref();
const sendMonthlyDebtRemindersLoading = ref(false);
const smsAccountBalance = ref<number | null>(null);
const api = ref(unitAPI.endpoints.base);
const label = ref('واحد های بدهکار');
const showRouteName = ref('Panel.Unit.Show');
const itemIdentifyKey = ref('id');

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});

const table = ref({
  columns: [
    // {
    //   name: 'unit_number',
    //   required: true,
    //   label: 'ساختمان',
    //   align: 'left',
    //   field: (row: UnitType) => row.building?.name,
    // },
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
      name: 'number_of_residents',
      required: true,
      label: 'نعداد ساکنین',
      align: 'left',
      field: (row: UnitType) => row.number_of_residents,
    },
    {
      name: 'area',
      required: true,
      label: 'مساحت',
      align: 'left',
      field: (row: UnitType) => row.area,
    },
    {
      name: 'parking_spaces',
      required: true,
      label: 'تعداد پارکینگ',
      align: 'left',
      field: (row: UnitType) => row.parking_spaces,
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
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: UnitType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-',
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => '',
    },
  ],
});

const inputs = ref([
  {
    type: 'hidden',
    name: 'building_id',
    value: buildingStore.buildingId
  },
  {
    type: 'hidden',
    name: 'negativeBalance',
    value: 1
  },
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'desc'
  },
  {
    type: 'hidden',
    name: 'length',
    value: 30
  },
]);

async function loadBuildingData () {
  buildingData.value = await buildingAPI.get(buildingStore.buildingId)
}

async function getSMSAccountBalance () {
  smsAccountBalance.value = null
  const smsAccountBalanceResult = await smsAPI.getAccountBalance()
  smsAccountBalance.value = smsAccountBalanceResult.balance
}

async function sendMonthlyDebtReminders () {
  try {
    sendMonthlyDebtRemindersLoading.value = true
    await smsAPI.sendMonthlyDebtReminders()
  } finally {
    sendMonthlyDebtRemindersLoading.value = false
    await getSMSAccountBalance()
  }
}

onMounted(async ()=>{
  await loadBuildingData()
  await getSMSAccountBalance()
})
</script>
