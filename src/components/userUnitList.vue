<script setup lang="ts">
import type { UnitType } from 'src/repositories/unit';
import { getUserRoleLabel } from 'src/repositories/user';

defineProps<{
  units: UnitType[]
}>()
</script>

<template>
  <q-list bordered separator class="role-list">
    <q-item>
      <q-item-section>
        <q-item-label>
          واحد ها
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="(unit, unitIndex) in units"
            :key="unitIndex"
            v-ripple
            clickable
            class="role-item"
    >
      <q-item-section>
        <q-item-label>
          <q-badge v-if="unit.pivot?.role">
            {{ getUserRoleLabel(unit.pivot.role) }}
          </q-badge>
          واحد:
          {{ unit.unit_number }}
          طبقه:
          {{ unit.floor }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.role-list {
  .role-item {
    .btn-call-role {
      padding: $space-1 $space-2;
    }
  }
}
</style>
