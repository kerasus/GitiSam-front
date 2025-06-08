<template>
  <entity-index
    ref="entityIndexRef"
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
      <template v-if="inputData.col.name === 'amount'">
        <currency-number :number="inputData.props.row.amount" />
      </template>
      <template v-else-if="inputData.col.name === 'current_balance'">
        <currency-number :number="(inputData.props.row.current_balance || 0) * -1"
                         show-status-color/>
      </template>
      <template v-else-if="inputData.col.name === 'status_label'">
        <span :class="{'text-green': inputData.props.row.status === 'paid', 'text-red': inputData.props.row.status === 'unpaid'}">
          {{ inputData.props.row.status_label }}
        </span>
      </template>
      <template v-else-if="inputData.col.name === 'is_covered_by_monthly_charge'">
        <span :class="{'text-green': inputData.props.row.invoice?.is_covered_by_monthly_charge, 'text-red': !inputData.props.row.invoice?.is_covered_by_monthly_charge}">
          <template v-if="inputData.props.row.invoice?.is_covered_by_monthly_charge">
            بله
          </template>
          <template v-else>
            خیر
          </template>
        </span>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn :row="inputData.props.row"
                      :api="invoiceDistributionAPI"
                      :use-flag="false"
                      @change="afterRemove"
          />
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
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import { FormBuilderAssist } from 'quasar-form-builder';
import { getUnitUserFullname } from 'src/repositories/unit';
import DeleteBtn from 'src/components/controls/deleteBtn.vue';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import InvoiceCategoryAPI, { type InvoiceCategoryType } from 'src/repositories/invoiceCategory';
import InvoiceDistributionAPI, {
  invoiceDistributionMethodOptions,
  invoiceDistributionStatusOptions,
  type InvoiceDistributionType
} from 'src/repositories/invoiceDistribution';
import { invoiceTargetGroupOptions } from 'src/repositories/invoice';

const $q = useQuasar();
const dateManager = useDate();
const invoiceCategoryAPI = new InvoiceCategoryAPI();
const invoiceDistributionAPI = new InvoiceDistributionAPI();

const invoiceCategories = ref<InvoiceCategoryType[]>([]);
const api = ref(invoiceDistributionAPI.endpoints.base);
const label = ref('توزیع فاکتورها');
// const createRouteName = ref('Panel.InvoiceDistribution.Create');
const showRouteName = ref('Panel.InvoiceDistribution.Show');
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
      name: 'invoice_title',
      required: true,
      label: 'عنوان فاکتور',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.title,
    },
    {
      name: 'target_group',
      required: true,
      label: 'پرداخت کننده',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.target_group_label,
    },
    {
      name: 'invoice_category',
      required: true,
      label: 'دسته فاکتور',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.invoice_category?.name,
    },
    {
      name: 'distribution_method',
      required: true,
      label: 'روش توزیع',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.distribution_method_label,
    },
    {
      name: 'is_covered_by_monthly_charge',
      required: true,
      label: 'تحت پوشش شارژ ماهیانه',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.is_covered_by_monthly_charge,
    },
    {
      name: 'unit_id',
      required: true,
      label: 'شماره واحد',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.unit?.unit_number,
    },
    {
      name: 'unit_id',
      required: true,
      label: 'نام ساکن واحد',
      align: 'left',
      field: (row: InvoiceDistributionType) => getUnitUserFullname(row.unit?.residents),
    },
    {
      name: 'current_balance',
      required: true,
      label: 'مقدار پرداخت نشده',
      align: 'left',
      field: (row: InvoiceDistributionType) => (row.current_balance || 0) * -1,
    },
    {
      name: 'amount',
      required: true,
      label: 'مقدار کل',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.amount,
    },
    {
      name: 'status_label',
      required: true,
      label: 'وضعیت',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.status_label,
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: InvoiceDistributionType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
              row.created_at,
              'YYYY-MM-DDThh:mm:ss',
              'hh:mm:ss jYYYY/jMM/jDD',
            )
          : '-',
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
    type: 'input',
    name: 'unit_number',
    label: 'شماره واحد',
    placeholder: ' ',
    col: 'col-md-1 col-12',
  },
  {
    type: 'select',
    name: 'invoiceTargetGroup',
    responseKey: 'invoiceTargetGroup',
    label: 'پرداخت کننده',
    options: invoiceTargetGroupOptions,
    placeholder: ' ',
    col: 'col-md-2 col-12',
  },
  {
    type: 'select',
    name: 'distribution_method',
    responseKey: 'distribution_method',
    label: 'روش توزیع',
    options: invoiceDistributionMethodOptions,
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'status',
    label: 'وضعیت',
    options: invoiceDistributionStatusOptions,
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'invoiceCategory',
    label: 'دسته فاکتور',
    options: [],
    optionLabel: 'name',
    optionValue: 'id',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  }
]);
const entityIndexRef = ref();

function afterRemove () {
  entityIndexRef.value.reload()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

async function loadInvoiceCategories () {
  const result = await invoiceCategoryAPI.index()
  invoiceCategories.value = result.data
  FormBuilderAssist.setAttributeByName(inputs.value, 'invoiceCategory', 'options', invoiceCategories.value);
}

onMounted(async () => {
  await loadInvoiceCategories();
})
</script>
