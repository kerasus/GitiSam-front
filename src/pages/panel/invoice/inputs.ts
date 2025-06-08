import { shallowRef } from 'vue';
import { invoiceStatusOptions, invoiceTypeOptions, invoiceTargetGroupOptions } from 'src/repositories/invoice';
import FormBuilderCurrencyInput from 'src/components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';

const FormBuilderCurrencyInputComponent = shallowRef(FormBuilderCurrencyInput);

export default () => [

  {
    type: 'input',
    name: 'title',
    responseKey: 'title',
    label: 'عنوان فاکتور',
    placeholder: ' ',
    col: 'col-md-12 col-12',
  },
  {
    type: FormBuilderCurrencyInputComponent,
    name: 'amount',
    responseKey: 'amount',
    label: 'مبلغ',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'date',
    name: 'due_date',
    responseKey: 'due_date',
    outsideLabel: 'تاریخ سررسید',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'status',
    responseKey: 'status',
    label: 'وضعیت',
    options: invoiceStatusOptions,
    value: 'paid',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'invoice_category_id',
    responseKey: 'invoice_category_id',
    label: 'دسته فاکتور',
    options: [],
    optionValue: 'id',
    optionLabel: 'name',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'type',
    responseKey: 'type',
    label: 'نوع',
    options: invoiceTypeOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'target_group',
    responseKey: 'target_group',
    label: 'پرداخت کنندگان',
    options: invoiceTargetGroupOptions,
    placeholder: ' ',
    value: 'resident',
    col: 'col-md-4 col-12',
  },
  {
    type: 'checkbox',
    name: 'is_covered_by_monthly_charge',
    responseKey: 'is_covered_by_monthly_charge',
    label: 'زیرمجموعه شارژ ماهیانه',
    value: true,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'inputEditor',
    name: 'description',
    responseKey: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-md-12 col-12',
  },
]
