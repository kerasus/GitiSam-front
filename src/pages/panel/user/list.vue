<template>
  <entity-index
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey"
  >
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
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
import { ref } from 'vue';
import { EntityIndex } from 'quasar-crud';
import UserAPI from 'src/repositories/user';
import { useDate } from 'src/composables/Date';

const userAPI = new UserAPI();
const dateManager = useDate();
const api = ref(userAPI.endpoints.base);
const label = ref('کاربران');
const createRouteName = ref('Panel.User.Create');
const showRouteName = ref('Panel.User.Show');
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
    {
      name: 'firstname',
      required: true,
      label: 'نام',
      align: 'left',
      field: (row: any) => row.firstname,
    },
    {
      name: 'lastname',
      required: true,
      label: 'نام خانوادگی',
      align: 'left',
      field: (row: any) => row.lastname,
    },
    {
      name: 'username',
      required: true,
      label: 'نام کاربری',
      align: 'left',
      field: (row: any) => row.username,
    },
    {
      name: 'mobile',
      required: true,
      label: 'موبایل',
      align: 'left',
      field: (row: any) => row.mobile,
    },
    {
      name: 'email',
      required: true,
      label: 'ایمیل',
      align: 'left',
      field: (row: any) => row.email,
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: any) =>
        dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD'),
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
  {
    type: 'input',
    name: 'mobile',
    label: 'موبایل',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'input',
    name: 'firstname',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'input',
    name: 'lastname',
    label: 'نام خانوادگی',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
]);
</script>
