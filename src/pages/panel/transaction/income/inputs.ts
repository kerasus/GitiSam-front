import { shallowRef } from 'vue';
import { transactionPaymentMethodOptions, transactionStatusOptions } from 'src/repositories/transaction';
import FormBuilderCurrencyInput from 'components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';

const FormBuilderCurrencyInputComponent = shallowRef(FormBuilderCurrencyInput);
export default (buildingId: number) => [
  {
    type: 'hidden',
    name: 'building_id',
    value: buildingId
  },
  {
    type: FormBuilderCurrencyInputComponent,
    name: 'amount',
    responseKey: 'amount',
    label: 'مقدار',
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
    name: 'receipt_image',
    responseKey: 'receipt_image',
    label: 'تصویر رسید',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'authority',
    responseKey: 'authority',
    label: 'کد مرجع',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'transactionID',
    responseKey: 'transactionID',
    label: 'شناسه تراکنش',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'transaction_status',
    responseKey: 'transaction_status',
    label: 'وضعیت تراکنش',
    options: transactionStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
]
