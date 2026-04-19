<template>
  <entity-show v-if="transactionData"
    v-model:value="inputs"
    :title="label"
    :loaded-data="transactionData"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :edit-route-name="editRouteName"
    :show-reload-button="false"
    :show-expand-button="false"
    :show-index-button="false"
    :show-edit-button="false"
  >
    <template #before-form-builder>
      <div class="banner"
      :class="{'success': transactionStatus === true, 'error': transactionStatus === false}">
        وضعیت تراکنش:
        <span class="text-bold">
          ({{ transactionStatusLabel }})
        </span>
      </div>
    </template>
  </entity-show>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { EntityShow } from 'quasar-crud';
import { computed, ref, shallowRef, onMounted } from 'vue';
import FormBuilderCurrencyInput from 'components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';
import TransactionAPI, {
  type TransactionType,
  transactionStatusOptions,
  transactionPaymentMethodOptions,
} from 'src/repositories/transaction';

const route = useRoute();
const transactionAPI = new TransactionAPI();
const FormBuilderCurrencyInputComponent = shallowRef(FormBuilderCurrencyInput);

// Extract transaction_id from the route parameters
const transactionId = computed(() => {
  const id = route.query.transaction_id;
  return id ? parseInt(id.toString()) : 0;
});

const transactionStatus = computed(() => {
  if (transactionData.value) {
    return transactionData.value.transaction_status === 'paid'
  }
  return route.query.status === 'success'
});

const transactionStatusLabel = computed(() => {
  if (transactionData.value) {
    const target = transactionStatusOptions.find(item => item.value === transactionData.value?.transaction_status)
    if (target) {
      return target.label
    }
  }
  const status = route.query.status;
  if (status === 'success') {
    return 'موفق'
  } else if (status === 'failed') {
    return 'نا موفق'
  }

  return 'نا موفق'
});

// Define labels and routes
const transactionData = ref<TransactionType | null>(null);
const label = ref('مشاهده تراکنش');
const indexRouteName = ref('Panel.Transaction.Payment.List');
const showRouteName = ref('Panel.Transaction.Payment.Show');
const editRouteName = ref('Panel.Transaction.Payment.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  {
    type: FormBuilderCurrencyInputComponent,
    name: 'amount',
    responseKey: 'amount',
    label: 'مبلغ',
    disable: true,
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'payment_method',
    responseKey: 'payment_method',
    label: 'روش پرداخت',
    options: transactionPaymentMethodOptions,
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'authority',
    responseKey: 'authority',
    label: 'کد مرجع',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'input',
    name: 'transactionID',
    responseKey: 'transactionID',
    label: 'شناسه تراکنش',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    responseKey: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  }
]);

async function loadTransactionData (): Promise<void> {
  transactionData.value = await transactionAPI.getPublicData(transactionId.value);
}

onMounted(async () => {
  await loadTransactionData();
})
</script>

<style scoped lang="scss">
.banner {
  border-radius: 1rem;
  color: white;
  padding: 1rem 2rem;
  background-color: $info;
  &.success {
    background-color: $success;
  }
  &.error {
    background-color: $error;
  }
}
</style>
