<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="message-wrapper">
        <template v-if="!unitData">
          کمی صبر کنید ...
        </template>
        <div v-else
             class="row">
          <template v-if="targetAmount > 0">
            <div class="col-12">
              پرداخت مبلغ
            </div>
            <div class="col-12">
              <form-builder-currency-input v-model:value="targetAmount"
                                           :show-value-in-words="false" />
            </div>
            <div class="targetAmountInWordWrapper text-bold text-info col-12">
              <span class="targetAmountInWord_rial">
                {{ rialInWords }}
                ریال
              </span>
              <span class="targetAmountInWord_toman">
                {{ tomanInWords }}
                تومان
              </span>
            </div>
            <div class="col-12 q-mt-md">
              <span class="inline-block">
                به حساب
              </span>
              <span class="inline-block text-bold text-info">
                <template v-if="targetGroup">
                  ({{ targetGroupLabel }})
                </template>
              </span>
              <span class="inline-block">
                واحد
              </span>
              <span class="inline-block text-bold text-info">
                ({{ unitData.unit_number }})
              </span>
            </div>
          </template>
          <div v-else
               class="col-12">
            بدهی ای برای
            <span class="inline-block text-bold text-info">
                <template v-if="targetGroup">
                  ({{ targetGroupLabel }})
                </template>
              </span>
            <span class="inline-block">
                واحد
              </span>
            <span class="inline-block text-bold text-info">
                ({{ unitData.unit_number }})
              </span>
            وجود ندارد
          </div>
        </div>
      </div>
      <div v-if="unitData && targetAmount > 0">
        <q-btn color="primary"
               size="lg"
               class="q-mt-md full-width"
                @click="redirectToGatewayDirect">
          پرداخت
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UnitAPI from 'src/repositories/unit';
import type { UnitType } from 'src/repositories/unit';
import { useNumberToPersianWord } from 'src/composables/useNumberToPersianWord';
import { computed, onMounted, ref, type ComputedRef, watch } from 'vue';
import FormBuilderCurrencyInput from 'src/components/controls/formBuilderCustomInput/FormBuilderCurrencyInput.vue';

type TargetGroupType = 'resident' | 'owner' | null

const {
  getNumberToPersianWord
} = useNumberToPersianWord()

const route = useRoute();
const unitAPI = new UnitAPI();

const targetAmount = ref<number>(0);
const rialInWords = ref<string>('');
const tomanInWords = ref<string>('');
const unitData = ref<null | UnitType>(null)
const loadUnitBalanceLoading = ref<boolean>(false);

const unitId: ComputedRef<number> = computed(() => {
  const id = route.params.unit_id;
  if (typeof id === 'string') {
    return parseInt(id, 10); // Convert string to number
  }
  throw new Error('Invalid unit_id');
});
const targetGroup: ComputedRef<TargetGroupType> = computed(() => {
  const targetGroup = route.params.target_group;
  if (targetGroup !== 'resident' && targetGroup !== 'owner') {
    return null
  }

  return targetGroup
});
const targetGroupLabel: ComputedRef<string> = computed(() => {
  switch (targetGroup.value) {
    case 'resident':
      return 'ساکن'
    case 'owner':
      return 'مالک'
    default:
      return ''
  }
});

async function loadUnitBalance () {
  try {
    loadUnitBalanceLoading.value = true;
    unitData.value = await unitAPI.getBalance(unitId.value)
    targetAmount.value = 0
    if (targetGroup.value === 'resident') {
      targetAmount.value = unitData.value.current_resident_balance ? unitData.value.current_resident_balance * -1 : 0
    } else if (targetGroup.value === 'owner') {
      targetAmount.value = unitData.value.current_owner_balance ? unitData.value.current_owner_balance * -1 : 0
    }
  } finally {
    loadUnitBalanceLoading.value = false;
  }
}

function redirectToGatewayDirect () {
  const apiServer = process.env.FRONTEND_API_BASE || '/api';
  window.location.href = apiServer + unitAPI.endpoints.redirectToGatewayDirect(
    unitId.value,
    targetGroup.value,
    targetAmount.value
  );
}

watch(targetAmount,() => {
  rialInWords.value = getNumberToPersianWord(targetAmount.value)
  tomanInWords.value = getNumberToPersianWord(Math.floor(targetAmount.value / 10))
})

onMounted(async ()=>{
  await loadUnitBalance()
})
</script>

<style scoped lang="scss">
.message-wrapper {
  display: flex;
  align-items: center;
  .input-wrapper {
    min-width: 200px;
    .form-builder-currency-input {
      margin: 0 $space-1 $space-2 $space-1;
    }
  }
  .targetAmountInWordWrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-right: $space-2;
    .targetAmountInWord_rial {}
    .targetAmountInWord_toman {}
  }
}
</style>
