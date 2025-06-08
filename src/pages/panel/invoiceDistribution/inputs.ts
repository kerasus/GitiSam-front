import { shallowRef } from 'vue';
import {
  invoiceDistributionMethodOptions,
  invoiceDistributionStatusOptions
} from 'src/repositories/invoiceDistribution';
import { invoiceTypeOptions, invoiceTargetGroupOptions } from 'src/repositories/invoice';
import FormBuilderCurrencyInput from 'src/components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';

const FormBuilderCurrencyInputComponent = shallowRef(FormBuilderCurrencyInput);

export default () => [
  {
    type: 'input',
    name: 'invoiceTitle',
    responseKey: 'invoice.title',
    label: 'عنوان فاکتور',
    placeholder: ' ',
    col: 'col-md-9 col-12',
  },
  {
    type: 'checkbox',
    name: 'is_covered_by_monthly_charge',
    responseKey: 'invoice.is_covered_by_monthly_charge',
    label: 'زیرمجموعه شارژ ماهیانه',
    value: true,
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'invoice_category_id',
    responseKey: 'invoice.invoice_category_id',
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
    responseKey: 'invoice.type',
    label: 'نوع',
    options: invoiceTypeOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'target_group',
    responseKey: 'invoice.target_group',
    label: 'پرداخت کنندگان',
    options: invoiceTargetGroupOptions,
    placeholder: ' ',
    value: 'resident',
    col: 'col-md-4 col-12',
  },
  {
    type: FormBuilderCurrencyInputComponent,
    name: 'invoiceAmount',
    responseKey: 'invoice.amount',
    label: 'مبلغ فاکتور',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'unit.unit_number',
    responseKey: 'unit.unit_number',
    label: 'شماره واحد',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'select',
    name: 'distribution_method',
    responseKey: 'distribution_method',
    label: 'روش توزیع',
    options: invoiceDistributionMethodOptions,
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: FormBuilderCurrencyInputComponent,
    name: 'amount',
    responseKey: 'amount',
    label: 'مقدار',
    placeholder: ' ',
    col: 'col-md-4 col-12',
  },
  {
    type: 'select',
    name: 'status',
    responseKey: 'status',
    label: 'وضعیت',
    options: invoiceDistributionStatusOptions,
    readonly: true,
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
  {
    type: 'inputEditor',
    name: 'invoiceDescription',
    responseKey: 'invoice.description',
    label: 'توضیحات فاکتور',
    placeholder: ' ',
    col: 'col-md-12 col-12',
  },
]
