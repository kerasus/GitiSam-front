<template>
  <q-card>
    <q-card-section>
      <div class="row">
        <div class="col-8">
          <div class="title">
            {{ title }}
          </div>
          <div class="value">
            <currency-number :number="number"
                             :show-status-color="showStatusColor"/>
            {{ appConfigManager.currencyUnit }}
          </div>
        </div>
        <div class="col-4 flex justify-end">
          <div class="icon-shape">
            <q-icon :name="icon" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAppConfig } from 'src/stores/appConfig';
import CurrencyNumber from 'components/CurrencyNumber.vue';

defineProps<{
  icon: string,
  title: string,
  number: number,
  showStatusColor?: boolean
}>()

const appConfigManager = useAppConfig();
</script>


<style scoped lang="scss">

</style>
