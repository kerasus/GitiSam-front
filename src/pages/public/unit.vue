<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <q-banner>
        تراز مالی واحد:
        <currency-number :number="unitBalance"
                         show-status-color/>
        {{ appConfig.currencyUnit }}
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UnitAPI from 'src/repositories/unit';
import { useAppConfig } from 'src/stores/appConfig';
import CurrencyNumber from 'src/components/CurrencyNumber.vue';
import { computed, onMounted, ref, type ComputedRef } from 'vue';

const route = useRoute();
const appConfig = useAppConfig();
const unitAPI = new UnitAPI();

const unitBalance = ref<number>(0);
const getUnitBalanceLoading = ref<boolean>(false);
const unitId: ComputedRef<number> = computed(() => {
  const id = route.params.unit_id;
  if (typeof id === 'string') {
    return parseInt(id, 10); // Convert string to number
  }
  throw new Error('Invalid unit_id');
});

async function getUnitBalance () {
  try {
    getUnitBalanceLoading.value = true;
    const unitBalanceResult = await unitAPI.getBalance(unitId.value)
    unitBalance.value = unitBalanceResult.current_balance || 0
  } finally {
    getUnitBalanceLoading.value = false;
  }
}

onMounted(async ()=>{
  await getUnitBalance()
})
</script>
