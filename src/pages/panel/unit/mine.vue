<template>
  <div class="q-mb-md">
    <unit-profile-tab-header v-model:tab="tab" :unit="unitData" :balance-loading="unitLoading" @update-balance="updateBalance" />
  </div>
  <q-tab-panels v-model="tab" animated class="bg-transparent">
    <q-tab-panel name="actions">
      <q-card class="q-mb-md">
        <q-card-section>
          <q-banner>
            <div class="row q-col-gutter-md">
              <div class="col-md-3 col-12">
                <q-select v-model="transactionTargetGroup"
                          emit-value
                          map-options
                          :options="transactionTargetGroupOptions" />
              </div>
              <div class="col-md-9 col-12">
                <form-builder-currency-input v-model:value="paymentValue"
                                             label="پرداخت مبلغ دلخواه"
                                             has-submit
                                             :submit-loading="redirectToPaymentGatewayLoading"
                                             submit-title="پرداخت"
                                             class="q-mb-md full-width"
                                             @submit="redirectToPaymentGateway" />
              </div>
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-tab-panel>

    <q-tab-panel name="invoices">
      <entity-index v-if="userUnit"
                    :value="invoiceDistributionIndexInputs"
                    :title="invoiceDistributionIndexLabel"
                    :api="invoiceDistributionIndexApi"
                    :table="invoiceDistributionIndexTable"
                    :table-keys="invoiceDistributionIndexTableKeys"
                    :show-route-name="showRouteName"
                    :show-create="false"
                    :show-close-button="false"
                    :show-expand-button="false"
                    :show-reload-button="false"
                    :show-search-button="true"
                    :row-key="invoiceDistributionIndexItemIdentifyKey"
      >
        <template #entity-index-table-cell="{ inputData }">
          <template v-if="inputData.col.name === 'amount'">
            <currency-number :number="inputData.props.row.amount" />
          </template>
          <template v-else-if="inputData.col.name === 'invoiceAmount'">
            <currency-number :number="inputData.props.row.invoice?.amount" />
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
              <q-btn
                color="primary"
                flat
                icon="visibility"
                :to="{ name: invoiceDistributionIndexShowRouteName, params: { id: inputData.props.row.id } }"
              />
            </div>
          </template>
          <template v-else>
            {{ inputData.col.value }}
          </template>
        </template>
      </entity-index>
    </q-tab-panel>

    <q-tab-panel name="transactions">
      <entity-index v-if="userUnit"
                    :value="unitTransactionsIndexInputs"
                    :title="unitTransactionsIndexLabel"
                    :api="unitTransactionsIndexApi"
                    :table="unitTransactionsIndexTable"
                    :table-keys="unitTransactionsIndexTableKeys"
                    :show-route-name="showRouteName"
                    :show-create="false"
                    :show-close-button="false"
                    :show-expand-button="false"
                    :show-reload-button="false"
                    :show-search-button="true"
                    :row-key="unitTransactionsIndexItemIdentifyKey"
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
          <template v-else-if="inputData.col.name === 'actions'">
            <div class="action-column-entity-index">
              <q-btn
                color="primary"
                flat
                icon="visibility"
                :to="{ name: unitTransactionsIndexShowRouteName, params: { id: inputData.props.row.id } }"
              />
            </div>
          </template>
          <template v-else>
            {{ inputData.col.value }}
          </template>
        </template>
      </entity-index>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useUser } from 'src/stores/user';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import { useAppConfig } from 'src/stores/appConfig';
import { FormBuilderAssist } from 'quasar-form-builder';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import UnitAPI, { type UnitType } from 'src/repositories/unit';
import UnitProfileTabHeader from 'src/components/UnitProfileTabHeader.vue';
import InvoiceCategoryAPI, { type InvoiceCategoryType } from 'src/repositories/invoiceCategory';
import FormBuilderCurrencyInput from 'src/components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';
import TransactionAPI, {
  type TransactionType,
  transactionStatusOptions,
  transactionTargetGroupOptions,
  transactionPaymentMethodOptions
} from 'src/repositories/transaction';
import InvoiceDistributionAPI, {
  type InvoiceDistributionType,
  invoiceDistributionMethodOptions,
  invoiceDistributionStatusOptions
} from 'src/repositories/invoiceDistribution';
import { invoiceTargetGroupOptions } from 'src/repositories/invoice';

const $q = useQuasar();
const userManager = useUser();
const dateManager = useDate();
const appConfig = useAppConfig();
const unitAPI = new UnitAPI();
const transactionAPI = new TransactionAPI();
const invoiceCategoryAPI = new InvoiceCategoryAPI();
const invoiceDistributionAPI = new InvoiceDistributionAPI();

const transactionTargetGroup = ref<'resident' | 'owner'>('resident');
const tab = ref<'actions' | 'invoices' | 'transactions'>('actions');
const unitId = ref<number | null>(null);
const paymentValue = ref<number>(0);

const invoiceCategories = ref<InvoiceCategoryType[]>([]);
const showRouteName = ref('Panel.Unit.Show');
const userUnit = ref<UnitType | null>(null);

const unitData = ref<UnitType | null>(null);
const unitLoading = ref(false);
const redirectToPaymentGatewayLoading = ref(false);

const invoiceDistributionIndexApi = ref(invoiceDistributionAPI.endpoints.base);
const invoiceDistributionIndexLabel = ref('توزیع فاکتورها');
const invoiceDistributionIndexShowRouteName = ref('Panel.InvoiceDistribution.Show');
const invoiceDistributionIndexItemIdentifyKey = ref('id');
const invoiceDistributionIndexTableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});
const invoiceDistributionIndexTable = ref({
  columns: [
    {
      name: 'invoiceTitle',
      required: true,
      label: 'عنوان فاکتور',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.title,
    },
    {
      name: 'invoice_category',
      required: true,
      label: 'دسته فاکتور',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.invoice_category?.name,
    },
    {
      name: 'target_group',
      required: true,
      label: 'پرداخت کننده',
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.target_group_label,
    },
    {
      name: 'amount',
      required: true,
      label: `سهم واحد (${appConfig.currencyUnit})`,
      align: 'left',
      field: (row: InvoiceDistributionType) => row.amount,
    },
    {
      name: 'invoiceAmount',
      required: true,
      label: `مبلغ کل فاکتور (${appConfig.currencyUnit})`,
      align: 'left',
      field: (row: InvoiceDistributionType) => row.invoice?.amount,
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
      name: 'current_balance',
      required: true,
      label: `مقدار پرداخت نشده (${appConfig.currencyUnit})`,
      align: 'left',
      field: (row: InvoiceDistributionType) => (row.current_balance || 0) * -1,
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
const invoiceDistributionIndexInputs = ref([
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
    name: 'unit_id',
    value: unitId.value
  },
  {
    type: 'select',
    name: 'invoiceTargetGroup',
    responseKey: 'invoiceTargetGroup',
    label: 'پرداخت کننده',
    options: invoiceTargetGroupOptions,
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
    name: 'distribution_method',
    responseKey: 'distribution_method',
    label: 'روش توزیع',
    options: invoiceDistributionMethodOptions,
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

const unitTransactionsIndexApi = ref(transactionAPI.endpoints.base);
const unitTransactionsIndexLabel = ref('تراکنش ها');
const unitTransactionsIndexItemIdentifyKey = ref('id');
const unitTransactionsIndexTableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});
const unitTransactionsIndexTable = ref({
  columns: [
    {
      name: 'amount',
      required: true,
      label: `مبلغ (${appConfig.currencyUnit})`,
      align: 'left',
      field: (row: TransactionType) => row.amount?.toString().toLocaleString(),
    },
    {
      name: 'target_group',
      required: true,
      label: 'پرداخت کننده',
      align: 'left',
      field: (row: TransactionType) => row.target_group_label,
    },
    {
      name: 'payment_method',
      required: true,
      label: 'روش پرداخت',
      align: 'left',
      field: (row: TransactionType) => row.payment_method_label,
    },
    {
      name: 'transaction_status',
      required: true,
      label: 'وضعیت تراکنش',
      align: 'left',
      field: (row: TransactionType) => row.transaction_status_label,
    },
    {
      name: 'paid_at',
      required: true,
      label: 'زمان پرداخت',
      align: 'left',
      field: (row: TransactionType) =>
        row.paid_at
          ? dateManager.miladiToShamsi(
            row.paid_at,
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
const unitTransactionsIndexInputs = ref([
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
    name: 'unit_id',
    value: unitId.value
  },
  {
    type: 'select',
    name: 'target_group',
    label: 'پرداخت کننده',
    options: transactionTargetGroupOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'payment_method',
    label: 'روش پرداخت',
    options: transactionPaymentMethodOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  }
]);
const unitTransactionsIndexShowRouteName = ref('Panel.Transaction.Payment.Show');

async function updateBalance() {
  try {
    if (!unitId.value) {
      return
    }
    unitLoading.value = true;
    unitData.value= await unitAPI.updateBalance(unitId.value);
    $q.notify({
      message: 'تراز مالی واحد با موفقیت بروز رسانی شد.',
      type: 'positive'
    })
  } finally {
    unitLoading.value = false;
  }
}

async function redirectToPaymentGateway() {

  try {
    if (!paymentValue.value || !userManager.me || !unitId.value) {
      $q.notify({
        message: 'اطلاعات مورد نیاز برای پرداخت کامل نیست.',
        type: 'warning'
      });
      return;
    }
    redirectToPaymentGatewayLoading.value = true;
    const redirectResponse = await transactionAPI.redirectToGateway({
      user_id: userManager.me?.id,
      unit_id: unitId.value,
      target_group: transactionTargetGroup.value,
      amount: paymentValue.value,
      description: 'پرداخت بدهی واحد'
    });
    $q.notify({
      message: 'در حال انتقال به درگاه پرداخت ...',
      type: 'positive'
    });

    // window.location.href = redirectUrl; // for zarinpal

    // Create a temporary div to hold the HTML form
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = redirectResponse;

    // Append the temporary div to the body
    document.body.appendChild(tempDiv);

    // Automatically submit the form
    const form = tempDiv.querySelector('form');
    if (form) {
      form.submit();
    } else {
      throw new Error('فرم پرداخت در پاسخ دریافتی وجود ندارد.');
    }
  }  catch (error) {
    // Handle errors and notify the user
    console.error('Error redirecting to payment gateway:', error);

    $q.notify({
      classes: 'snack--negative snack--inline-action',
      icon: 'info',
      message: 'خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.',
      html: true,
      multiLine: true,
      timeout: 20000,
      actions: [
        {
          icon: 'close',
          class: 'icon-button',
        },
      ],
    });
  } finally {
    redirectToPaymentGatewayLoading.value = false;
  }
}

async function getMyUnits () {
  if (!userManager.me) {
    return null
  }
  const unitsList = await unitAPI.index({
    user_id: userManager.me.id,
    length: 10
  })

  if (unitsList.data[0]) {
    userUnit.value = unitsList.data[0]
    if (userUnit.value?.id) {
      setUnitId(userUnit.value.id)
    }
  }
}

function setUnitId (newUnitId: number) {
  unitId.value = newUnitId
  FormBuilderAssist.setAttributeByName(invoiceDistributionIndexInputs.value, 'unit_id', 'value', newUnitId)
  FormBuilderAssist.setAttributeByName(unitTransactionsIndexInputs.value, 'unit_id', 'value', newUnitId)
}

async function loadInvoiceCategories () {
  const result = await invoiceCategoryAPI.index()
  invoiceCategories.value = result.data
  FormBuilderAssist.setAttributeByName(invoiceDistributionIndexInputs.value, 'invoiceCategory', 'options', invoiceCategories.value);
}

async function loadUnitData () {
  if (!unitId.value) {
    return
  }
  unitData.value = await unitAPI.get(unitId.value)
}

onMounted(async ()=>{
  await getMyUnits()
  await loadUnitData()
  await loadInvoiceCategories()
})
</script>
