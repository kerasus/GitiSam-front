<template>
  <div class="form-builder-date-time" :class="customClass">
    <div class="outsideLabel">
      {{ placeholder ? label : null }}
    </div>
    <q-input
      ref="input"
      v-model="displayDateTime"
      :name="name"
      :loading="loading"
      :filled="filled"
      :mask="mask"
      :dense="dense"
      :fill-mask="fillMask"
      :disable="disable"
      :readonly="readonly"
      :rounded="rounded"
      :reverse-fill-mask="reverseFillMask"
      dir="ltr"
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
        <q-icon :name="calendarIcon" class="cursor-pointer" @click="toggleDate" />
      </template>
    </q-input>
    <q-menu
      v-model="popupDate"
      :persistent="persistentMenu"
      no-parent-event
      anchor="bottom left"
      self="top left"
      transition-show="jump-down"
      transition-hide="jump-up"
    >
      <q-date
        v-model="displayDate"
        :calendar="calendar"
        minimal
        mask="YYYY/MM/DD"
        :range="range"
        :multiple="multiple"
        :title="title ? title : label"
        :today-btn="todayBtn"
        @update:model-value="onChangeDate"
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
      </q-date>
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
  computed,
  nextTick,
  type ModelRef,
  type ComponentPublicInstance,
} from 'vue';

defineOptions({
  name: 'FormBuilderDateTime',
});

const i18n = useI18n();
const dateManager = useDate();

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

const mask = ref('####/##/## ##:##:##');
const displayDateTime: Ref<string> = ref('');
const displayDate: Ref<string | undefined> = ref('');
const popupDate = ref(false);
// const popupTime = ref(false)
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
const showClearAble = computed(() => displayDateTime.value !== '____/__/__ __:__:__');

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
        if (displayDateTime.value === '____/__/__ __:__:__') {
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

function onChangeInputDateTime() {
  const [date, time] = displayDateTime.value.split(' ');
  if (date) {
    dateTime.date = date;
  }
  if (time) {
    dateTime.time = time;
  }

  const analysedShamsiDate = dateManager.validationShamsiDate(date);
  const analysedTime = dateManager.validationTime(time);

  if (analysedShamsiDate.isValid && analysedTime.isValid) {
    localErrorMessage.value = null;
    if (analysedShamsiDate.shamsiDate) {
      onChangeDate(analysedShamsiDate.shamsiDate);
    }

    if (analysedTime.validTime) {
      onChangeTime(analysedTime.validTime);
    }
  } else {
    localErrorMessage.value = analysedShamsiDate.message || analysedTime.message;
  }
}

// newValue can be miladi or shamsi
function onChangeDate(newValue: string) {
  if (!newValue) {
    onClear();
    return;
  }
  let gregorianDate = newValue;
  if (props.calendar === 'persian') {
    gregorianDate = dateManager.shamsiToMiladi(newValue.toString());
  }
  updateDateTime(gregorianDate, 'date');
}

function onChangeTime(newTime: string) {
  dateTime.time = newTime;
  updateDateTime(newTime, 'time');
}

// newValue should be miladi
function updateDateTime(newValue: string, type: 'date' | 'time') {
  const systemDate = dateManager.now('YYYY-MM-DD');
  const systemTime = dateManager.now('HH:mm:ss');

  const displayTime = `${dateTime.hours}:${dateTime.minutes}:${dateTime.seconds}`;
  const analysedShamsiDate = dateManager.validationShamsiDate(displayDate.value);
  const analysedTime = dateManager.validationTime(displayTime);
  // TODO: should fix this for calender != persian
  const defaultDate = analysedShamsiDate.isValid
    ? dateManager.shamsiToMiladi(displayDate.value)
    : systemDate;
  const defaultTime = analysedTime.isValid ? displayTime : systemTime;

  const finalDate = newValue && type === 'date' ? newValue : defaultDate;
  const finalTime = newValue && type === 'time' ? newValue : defaultTime;
  const inputData = value.value ? value.value.replace('T', ' ') : `${finalDate} ${finalTime}`;
  const arrValue = inputData.trim().split(' ');
  const timeValue = arrValue[1];
  displayDate.value =
    props.calendar === 'persian' ? dateManager.miladiToShamsi(arrValue[0]) : arrValue[0];

  if (type === 'date') {
    arrValue[0] = newValue.toString();
  } else if (type === 'time') {
    const parsedTime = dateManager.parseTime(timeValue);
    if (parsedTime) {
      dateTime.hours = parsedTime.formattedHour;
      dateTime.minutes = parsedTime.formattedMinute;
      dateTime.seconds = parsedTime.formattedSecond;
    }
    arrValue[1] = newValue;
  }

  const delimiter = props.iso8601 ? 'T' : ' ';
  displayDateTime.value = [displayDate.value, timeValue].join(' ');
  value.value = arrValue.join(delimiter).replace(',', ' ');
}

function onClear() {
  displayDateTime.value = '____/__/__ __:__:__';
  value.value = null;
}

function toggleDate() {
  popupDate.value = !popupDate.value;
}

function openMenu() {
  persistentMenu.value = true;
  popupDate.value = true;
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
  // ____/__/__ __:__:__
  const defaultDate = dateManager.now('jYYYY/jMM/jDD');

  if (!value.value) {
    displayDateTime.value = defaultDate + displayDateTime.value.slice(10, 19);
  }
  displayDateTime.value =
    displayDateTime.value.slice(0, 11) +
    dateTime.hours +
    displayDateTime.value.slice(13, 14) +
    dateTime.minutes +
    displayDateTime.value.slice(16, 17) +
    dateTime.seconds +
    displayDateTime.value.slice(19);
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

watch(
  () => value.value,
  (newValue) => {
    if (!newValue) {
      displayDateTime.value = '____/__/__ __:__:__';
      return;
    }
    const normalizedDateTime = dateManager.getDateTimeFromIso8601DateString(newValue);
    const newDate = normalizedDateTime.date.toString();

    const newTime = normalizedDateTime.time.toString();
    updateDateTime(newDate, 'date');
    updateDateTime(newTime, 'time');
  },
  { immediate: true },
);

watch(
  () => props.errorMessage,
  () => {
    localErrorMessage.value = props.errorMessage;
  },
  { immediate: true },
);

watch(displayDateTime, onChangeInputDateTime);
</script>
