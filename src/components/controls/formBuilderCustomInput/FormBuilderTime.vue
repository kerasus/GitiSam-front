<template>
  <div class="form-builder-time" :class="customClass">
    <q-input
      v-model="displayDateTime"
      :name="name"
      :loading="loading"
      :filled="filled"
      :mask="mask"
      :fill-mask="fillMask"
      :reverse-fill-mask="reverseFillMask"
      dir="ltr"
      :disable="disable"
      :label="placeholder ? undefined : label"
      :stack-label="!!placeholder"
      :placeholder="placeholder"
      :rules="localRules"
      :lazy-rules="lazyRules"
      :outlined="outlined"
      :class="customClass"
      :input-class="customClass"
      :error="!!localErrorMessage"
      :error-message="
        localErrorData ? $t(localErrorData.message, localErrorData.namedValue) : undefined
      "
      @clear="onClear"
      @update:model-value="onChangeInputTime"
      @keydown="onKeydown"
    >
      <template #append>
        <q-icon
          v-if="clearable"
          v-show="showClearAble"
          name="oms:close-circle"
          class="cursor-pointer"
          @click="onClear"
        />
        <q-icon name="oms:clock" class="cursor-pointer" @click="toggleMenu" />
      </template>
    </q-input>
    <q-menu
      v-model="popupTime"
      :persistent="persistentMenu"
      no-parent-event
      anchor="bottom left"
      self="top left"
      class="form-builder-time"
      transition-show="jump-down"
      transition-hide="jump-up"
    >
      <q-form class="time-picker">
        <q-input
          ref="inputSecond"
          v-model="dateTime.seconds"
          mask="##"
          :label="$t('fieldName.second')"
          :fill-mask="fillMask"
          :reverse-fill-mask="reverseFillMask"
          dir="ltr"
          @keydown="onKeydownSecond"
          @update:model-value="onMenuSecondInputUpdate"
        />
        <div class="time-separator">:</div>
        <q-input
          ref="inputMinute"
          v-model="dateTime.minutes"
          mask="##"
          :label="$t('fieldName.minute')"
          :fill-mask="fillMask"
          :reverse-fill-mask="reverseFillMask"
          dir="ltr"
          @keydown="onKeydownMinute"
          @update:model-value="onMenuMinuteInputUpdate"
        />
        <div class="time-separator">:</div>
        <q-input
          ref="inputHour"
          v-model="dateTime.hours"
          mask="##"
          :label="$t('fieldName.hour')"
          :fill-mask="fillMask"
          :reverse-fill-mask="reverseFillMask"
          dir="ltr"
          @keydown="onKeydownHour"
          @update:model-value="onMenuHourInputUpdate"
        />
      </q-form>
      <div class="row items-center justify-end">
        <q-btn
          ref="closeBtnRef"
          v-close-popup
          :label="$t('general.close')"
          :color="closeColorBtn"
          flat
        />
      </div>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ValidationRule } from 'quasar';
import { useDate } from 'src/composables/Date';
import type { LocalErrorDataType } from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue';
import type { PropType, ComputedRef } from 'vue';
import {
  ref,
  watch,
  type Ref,
  reactive,
  nextTick,
  computed,
  type ModelRef,
  type ComponentPublicInstance,
} from 'vue';

defineOptions({
  name: 'FormBuilderTime',
});

const dateManager = useDate();
const i18n = useI18n();

interface DateTimeObject {
  date: string;
  time: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const props = defineProps({
  name: {
    default: '',
    type: String,
  },
  calendar: {
    type: String as PropType<'gregorian' | 'persian' | undefined>,
    default: 'persian',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  calendarIcon: {
    type: String,
    default: 'oms:calendar',
  },
  clockIcon: {
    type: String,
    default: 'oms:clock',
  },
  title: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  range: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  iso8601: {
    type: Boolean,
    default: true,
  },
  todayBtn: {
    type: Boolean,
    default: false,
  },
  fillMask: {
    type: String,
    default: undefined,
  },
  reverseFillMask: {
    type: Boolean,
    default: undefined,
  },
  mask: {
    type: String,
    default: undefined,
  },
  label: {
    default: '',
    type: String || null,
  },
  class: {
    default: '',
    type: String,
  },
  error: {
    default: false,
    type: Boolean,
  },
  errorMessage: {
    default: '',
    type: String,
  },
  disable: {
    default: false,
    type: Boolean,
  },
  readonly: {
    default: false,
    type: Boolean,
  },
  filled: {
    default: false,
    type: Boolean,
  },
  closeColorBtn: {
    default: 'primary',
    type: String,
  },
  dense: {
    default: true,
    type: Boolean,
  },
  rounded: {
    default: false,
    type: Boolean,
  },
  outlined: {
    default: false,
    type: [Boolean],
  },
  rules: {
    default: () => [] as ValidationRule[],
    type: Array as PropType<ValidationRule[]>,
  },
  lazyRules: {
    default: false,
    type: [Boolean],
  },
  loading: {
    default: false,
    type: Boolean,
  },
});

const mask = ref('##:##:##');
const displayDateTime: Ref<string> = ref('');
const popupTime = ref(false);
const persistentMenu = ref(false);
const input = ref<HTMLInputElement | null>(null);
const inputHour = ref<any>(null);
const inputMinute = ref<HTMLInputElement | null>(null);
const inputSecond = ref<HTMLInputElement | null>(null);
const closeBtnRef = ref<ComponentPublicInstance | null>(null);
const localErrorMessage: Ref<string | null> = ref(null);

const dateTime = reactive<DateTimeObject>({
  date: '',
  time: '',
  hours: '__',
  minutes: '__',
  seconds: '__',
});

const value: ModelRef<string | null> = defineModel('value', {
  type: String,
  default: null,
});

const customClass = computed(() => props.class);
const showClearAble = computed(() => displayDateTime.value !== '__:__:__');

const localErrorData: ComputedRef<LocalErrorDataType | undefined> = computed(() => {
  if (!localErrorMessage.value) {
    return undefined;
  }
  const errorData: LocalErrorDataType = { message: localErrorMessage.value, namedValue: {} };
  if (errorData.message === 'error.validation.required') {
    errorData.namedValue = { field: props.label };
  }

  return errorData;
});

const localRules = computed(() =>
  props.rules.map((rule: any) => {
    if (rule.ruleName === 'required') {
      const ruleName = rule.ruleName;
      const ruleParams = rule.ruleParams;
      rule = (): boolean | string => {
        if (displayDateTime.value === '__:__:__') {
          return i18n.t('error.validation.required', { field: props.label });
        } else if (localErrorMessage.value) {
          return false;
        } else {
          return true;
        }
      };

      rule.ruleName = ruleName;
      rule.ruleParams = ruleParams;
    }

    return rule;
  }),
);

watch(
  () => value.value,
  (newValue) => {
    if (!newValue) {
      displayDateTime.value = '__:__:__';
      return;
    }
    updateDateTime(newValue);
  },
  { immediate: true },
);

function onChangeInputTime(newValue: string | number | null) {
  if (typeof newValue !== 'string') {
    return;
  }
  dateTime.time = newValue;
  const analysedShamsiTime = dateManager.validationTime(displayDateTime.value);

  if (analysedShamsiTime.isValid && analysedShamsiTime.validTime) {
    localErrorMessage.value = null;
    onChangeTime(analysedShamsiTime.validTime);
  } else {
    localErrorMessage.value = analysedShamsiTime.message;
  }
}

function onChangeTime(newValue: string) {
  dateTime.time = newValue;
  const parseTime = dateManager.parseTime(newValue);
  if (parseTime) {
    dateTime.hours = parseTime.formattedHour;
    dateTime.minutes = parseTime.formattedMinute;
    dateTime.seconds = parseTime.formattedSecond;
  }
  updateDateTime(newValue);
}

function updateDateTime(newValue: string) {
  displayDateTime.value = newValue || '';
  value.value = newValue ? newValue.toString() : newValue;
}
function onClear() {
  displayDateTime.value = '__:__:__';
  value.value = null;
}

function openMenu() {
  persistentMenu.value = true;
  popupTime.value = true;
  input.value?.focus();
}

function onKeydown(e: KeyboardEvent) {
  const allowedKeys = [
    'Backspace',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'Tab',
    'Shift',
    'Control',
    'Alt',
    'Escape',
    'End',
    'Home',
    'Delete',
  ];
  if (e.key === 'ArrowDown') {
    openMenu();
    input.value?.focus();
    return;
  }
  if (e.key === ' ') {
    e.preventDefault();
  }

  const isModifierCombination =
    (e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'z', 'y'].includes(e.key.toLowerCase());

  if (
    Number.isNaN(Number(e.key)) &&
    !e.ctrlKey &&
    !e.altKey &&
    !isModifierCombination &&
    !allowedKeys.includes(e.key)
  ) {
    e.preventDefault();
  }
}

function onKeydownHour(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault();
    inputMinute.value?.focus();
  }
  nextTick(() => {
    if (!dateTime.hours.includes('_') && e.key !== 'Backspace' && e.key !== 'Delete') {
      inputMinute.value?.focus();
    }
  });
}

function onKeydownMinute(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault();
    inputSecond.value?.focus();
  }
  nextTick(() => {
    if (!dateTime.minutes.includes('_') && e.key !== 'Backspace' && e.key !== 'Delete') {
      inputSecond.value?.focus();
    }
    if (dateTime.minutes === '__' && e.key === 'Backspace') {
      inputHour.value?.focus();
    }
  });
}

function onKeydownSecond(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault();
    closeBtnRef.value?.$el.focus();
  }
  nextTick(() => {
    if (dateTime.seconds === '__' && e.key === 'Backspace') {
      inputMinute.value?.focus();
    }
  });
}

function onMenuTimeInputUpdate() {
  displayDateTime.value = dateTime.hours + ':' + dateTime.minutes + ':' + dateTime.seconds;
}

function onMenuHourInputUpdate() {
  onMenuTimeInputUpdate();
}

function onMenuMinuteInputUpdate() {
  dateTime.hours = dateTime.hours.replaceAll('_', '0');
  onMenuTimeInputUpdate();
}

function onMenuSecondInputUpdate() {
  dateTime.hours = dateTime.hours.replaceAll('_', '0');
  dateTime.minutes = dateTime.minutes.replaceAll('_', '0');

  onMenuTimeInputUpdate();
}

function toggleMenu() {
  popupTime.value = !popupTime.value;
}

watch(displayDateTime, onChangeInputTime);

watch(
  () => props.errorMessage,
  () => {
    localErrorMessage.value = props.errorMessage;
  },
  { immediate: true },
);
</script>
