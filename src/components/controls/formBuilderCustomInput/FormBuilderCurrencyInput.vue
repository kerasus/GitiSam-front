<template>
  <div class="form-builder-input" :class="customClass">
    <div class="outsideLabel">{{ placeholder ? label : null }}</div>
    <q-input
      ref="input"
      v-model="formattedValue"
      :name="name"
      :filled="filled"
      :lazy-rules="lazyRules"
      :label="placeholder ? undefined : label"
      :stack-label="!!placeholder"
      :error="error"
      :error-message="errorMessage"
      :disable="disable"
      :mask="mask"
      :hint="valueInWords"
      :fill-mask="fillMask"
      :reverse-fill-mask="reverseFillMask"
      :clearable="clearable"
      :loading="loading"
      :readonly="readonly"
      :rounded="rounded"
      :outlined="outlined"
      :placeholder="placeholder"
      :class="customClass"
      :input-class="customClass"
      :autogrow="autogrow"
      @click="onClick"
      @keydown="onKeydown"
      @keypress="onKeyPress"
      @input="handleInput"
    >
      <template #prepend>
        <q-icon v-if="props.inputType === 'iban'" name="payments" />
        <q-btn v-if="hasSubmit" color="primary" class="prepend-submit-btn" :loading="submitLoading" :label="submitTitle" @click="submitInput" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from 'src/stores/appConfig'
import NumberToPersianWord from 'number_to_persian_word'
import { computed, defineProps, defineEmits, ref, watch } from 'vue';

defineOptions({
  name: 'FormBuilderCurrencyInput',
});

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  filled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  lazyRules: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  disable: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: String,
    default: undefined,
  },
  fillMask: {
    type: String,
    default: undefined,
  },
  reverseFillMask: {
    type: Boolean,
    default: undefined,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  autogrow: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
  inputType: {
    type: String,
    default: 'text',
  },
  hasSubmit: {
    type: Boolean,
    default: false
  },
  submitTitle: {
    type: String,
    default: 'پرداخت'
  },
  submitLoading: {
    type: Boolean,
    default: false
  },
});

const emits = defineEmits(['update:value', 'input', 'click', 'keydown', 'keypress', 'submit']);

const appConfig = useAppConfig()
const rawValue = ref<string | number>(props.value);

const formattedValue = computed({
  get() {
    if (!rawValue.value) return '';
    const normalizedValue = toEnDigit(rawValue.value.toString()).replace(/٬/g, '');
    if (normalizedValue === '-') return normalizedValue;
    return parseInt(normalizedValue).toLocaleString('fa') || '';
  },
  set(newValue: string) {
    const sanitizedValue = sanitizeInput(newValue);
    rawValue.value = sanitizedValue;
    emits('update:value', sanitizedValue);
  },
});
// Convert numbers to Persian words
const valueInWords = computed(() => {
  const rawValueInNumber =
    typeof rawValue.value === 'number'
      ? rawValue.value
      : parseInt(toEnDigit(rawValue.value.toString()));
  const isNegative = rawValueInNumber < 0;
  const absoluteValue = Math.abs(rawValueInNumber);
  const words = NumberToPersianWord.convert(absoluteValue);

  return `${isNegative ? 'منفی ' : ''}${words} ${appConfig.currencyUnit}`;
});

/**
 * تبدیل اعداد فارسی به انگلیسی
 */
function toEnDigit(value: string): string {
  if (!value) return '';
  const digits = [
    { from: '۰', to: '0' },
    { from: '۱', to: '1' },
    { from: '۲', to: '2' },
    { from: '۳', to: '3' },
    { from: '۴', to: '4' },
    { from: '۵', to: '5' },
    { from: '۶', to: '6' },
    { from: '۷', to: '7' },
    { from: '۸', to: '8' },
    { from: '۹', to: '9' },
  ];
  let result = normalizeMinus(value).toString();
  digits.forEach((item) => {
    result = result.replace(new RegExp(item.from, 'g'), item.to);
  });
  return result;
}

function normalizeMinus (input: string): string {
  return input.replace(/‎-/g, '-').replace(/−/g, '-');
}

/**
 * تمیز کردن ورودی (حذف کاماها و تبدیل اعداد فارسی)
 */
function sanitizeInput(value: string): string {
  return toEnDigit(normalizeMinus(value).replace(/٬/g, ''));
}

/**
 * مدیریت رویداد ورودی
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const newValue = target.value;
  formattedValue.value = newValue; // به‌روزرسانی مقدار فرمت‌بندی شده
}

/**
 * مدیریت کلیک
 */
function onClick(event: Event) {
  emits('click', event);
}

/**
 * مدیریت کلیدهای فشار داده شده
 */
function onKeydown(event: KeyboardEvent) {
  emits('keydown', event);
}

/**
 * مدیریت کلیدهای فشار داده شده در زمان تایپ
 */
function onKeyPress(event: KeyboardEvent) {
  emits('keypress', event);
}

function submitInput () {
  emits('submit')
}

watch(() => props.value, (value) => {
  formattedValue.value = (value || 0).toString();
})
</script>

<style scoped lang="scss">
.form-builder-currency-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.outsideLabel {
  font-size: 14px;
  color: #555;
}

.q-input {
  direction: rtl;
  text-align: right;
}

.prepend-submit-btn {
  margin-right: calc( -1 * #{$space-2});
}
</style>
