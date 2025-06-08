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
    :redirect-after-login="false"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { EntityCreate } from 'quasar-crud';
import { computed, ref, shallowRef } from 'vue';
import FormBuilderCurrencyInput from 'components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';
import TransactionAPI,
{
  transactionStatusOptions,
  transactionTargetGroupOptions,
  transactionPaymentMethodOptions
} from 'src/repositories/transaction';

const transactionAPI = new TransactionAPI();

const route = useRoute();

const FormBuilderCurrencyInputComponent = shallowRef(FormBuilderCurrencyInput);
const api = ref(transactionAPI.endpoints.base);
const label = ref('ثبت تراکنش جدید برای واحد');
const indexRouteName = ref('Panel.Transaction.Payment.List');
const showRouteName = ref('Panel.Transaction.Payment.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const unitId = computed(() =>
  route.params.id ? parseInt(route.params.id?.toString()) : 0,
);

const inputs = ref([
  {
    type: 'hidden',
    name: 'unit_id',
    responseKey: 'unit_id',
    value: unitId.value,
  },
  {
    type: FormBuilderCurrencyInputComponent,
    name: 'amount',
    responseKey: 'amount',
    label: 'مقدار',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'dateTime',
    name: 'paid_at',
    responseKey: 'paid_at',
    outsideLabel: 'زمان پرداخت',
    placeholder: ' ',
    iso8601: false,
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'payment_method',
    responseKey: 'payment_method',
    label: 'روش پرداخت',
    options: transactionPaymentMethodOptions,
    placeholder: ' ',
    value: 'mobile_banking',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    responseKey: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'target_group',
    responseKey: 'target_group',
    label: 'پرداخت کننده',
    options: transactionTargetGroupOptions,
    placeholder: ' ',
    value: 'resident',
    col: 'col-md-3 col-12',
  },
  {
    type: 'inputEditor',
    name: 'description',
    responseKey: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-md-12 col-12',
  }
]);

</script>
