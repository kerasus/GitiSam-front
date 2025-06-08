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
    :after-load-input-data="afterLoadInputData"
  />

  <q-separator v-if="invoiceData && invoiceData?.images.length > 0" class="q-my-md" />

  <imageable-list v-if="invoiceData && invoiceData?.images.length > 0"
                  :images="invoiceData?.images"
                  :can-manage="false" />

  <q-separator class="q-my-md" />

  <entity-index v-if="!invoiceData?.is_covered_by_monthly_charge"
    v-model:table-selected-values="selectedUnits"
    :table-selection-mode="'multiple'"
    :value="unitIndexInputs"
    :title="unitIndexLabel"
    :api="unitIndexApi"
    :table="unitIndexTable"
    :table-keys="unitIndexTableKeys"
    :show-close-button="false"
    :show-expand-button="true"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="unitIndexItemIdentifyKey"
    :item-indicator-key="getItemIndicatorKeyForUnitIndex"
  >
    <template #before-form-builder>
      <div class="q-pb-md">
        <form-builder v-model:value="invoiceDistributionInputs"
        :loading="createBulkInvoiceDistributionLoading"/>
      </div>
    </template>
    <template #after-index-table>
      <div class="q-pa-md">
        <q-btn color="primary" :loading="createBulkInvoiceDistributionLoading" @click="createBulkInvoiceDistribution">
          توزیع فاکتور بین واحدهای انتخاب شده
        </q-btn>
      </div>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import getInvoiceInputs from './inputs';
import { useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useDate } from 'src/composables/Date';
import { FormBuilder } from 'quasar-form-builder'
import { EntityShow, EntityIndex } from 'quasar-crud';
import { FormBuilderAssist } from 'quasar-form-builder';
import ImageableList from 'src/components/ImageableList.vue';
import InvoiceCategoryApi from 'src/repositories/invoiceCategory';
import InvoiceAPI, { type InvoiceType } from 'src/repositories/invoice';
import UnitAPI, { type UnitType, getUnitUserFullname } from 'src/repositories/unit';
import InvoiceDistributionAPI, { type InvoiceDistributionType } from 'src/repositories/invoiceDistribution';

const $q = useQuasar();
const route = useRoute();
const dateManager = useDate();
const unitAPI = new UnitAPI();
const invoiceAPI = new InvoiceAPI();
const invoiceCategoryApi = new InvoiceCategoryApi();
const invoiceDistributionAPI = new InvoiceDistributionAPI();

const invoiceId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(invoiceAPI.endpoints.byId(invoiceId.value));
const label = ref('مشاهده فاکتور');
const indexRouteName = ref('Panel.Invoice.List');
const showRouteName = ref('Panel.Invoice.Show');
const editRouteName = ref('Panel.Invoice.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');
const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInvoiceInputs()
]);

const invoiceData = ref<InvoiceType | null>(null);

const selectedUnits = ref<UnitType[]>([])
const unitIndexApi = ref(unitAPI.endpoints.base);
const unitIndexLabel = ref('توزیع فاکتور به واحدها');
const unitIndexItemIdentifyKey = ref('id');
const unitIndexTableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});
const unitIndexTable = ref({
  columns: [
    {
      name: 'unit_number',
      required: true,
      label: 'شماره واحد',
      align: 'left',
      field: (row: UnitType) => row.unit_number,
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
      name: 'floor',
      required: true,
      label: 'طبقه',
      align: 'left',
      field: (row: UnitType) => row.floor,
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
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: UnitType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-',
    }
  ],
});
const unitIndexInputs = ref([
  {
    type: 'hidden',
    name: 'length',
    value: 50
  },
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'asc'
  }
]);

const createBulkInvoiceDistributionLoading = ref(false);
const invoiceDistributionInputs = ref([
  {
    type: 'hidden',
    name: 'invoice_id',
    responseKey: 'invoice_id',
    value: invoiceId.value
  },
  {
    type: 'select',
    name: 'distribution_method',
    responseKey: 'distribution_method',
    label: 'روش توزیع',
    options: [
      { label: 'برابر', value: 'equal' },
      { label: 'بر اساس تعداد نفرات', value: 'per_person' },
      { label: 'بر اساس متراژ', value: 'area' },
      { label: 'بر اساس پارکینگ', value: 'parking' },
      // { label: 'دلخواه', value: 'custom' },
    ],
    placeholder: ' ',
    value: 'equal',
    col: 'col-md-6 col-12',
  }
]);

function afterLoadInputData(data: InvoiceType) {
  invoiceData.value = data;
  loadSelectedUnits();
}

function getItemIndicatorKeyForUnitIndex (item: UnitType) {
  const ownerFullname = getUnitUserFullname(item.owners)
  const residentsFullname = getUnitUserFullname(item.residents)
  const userOfUnit = residentsFullname !== '-' ? residentsFullname : ownerFullname
  return `${item.unit_number} (${userOfUnit})`
}

async function createBulkInvoiceDistribution () {
  const formData = FormBuilderAssist.getFormData(invoiceDistributionInputs.value) as any
  formData.distributions = selectedUnits.value.map(unit => {
    return {
      unit_id: unit.id
    }
  })
  createBulkInvoiceDistributionLoading.value = true
  try {
    await invoiceDistributionAPI.createBulk(formData)
    $q.notify({
      message: 'فاکتور با موفقیت توزیع شد',
      type: 'positive'
    })
  } finally {
    createBulkInvoiceDistributionLoading.value = false
  }
}

async function loadInputOptions() {
  const invoiceCategoryResult = await invoiceCategoryApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(inputs.value, 'invoice_category_id', 'options', invoiceCategoryResult.data);
}

function loadSelectedUnits () {
  const invoiceDistributions: InvoiceDistributionType[] | undefined = invoiceData.value?.invoice_distributions
  if (!invoiceDistributions) {
    return
  }
  selectedUnits.value = []
  invoiceDistributions.forEach(distribution => {
    if (distribution.unit) {
      selectedUnits.value.push(distribution.unit)
    }
  })
}

onMounted(() => {
  loadInputOptions();
});
</script>
