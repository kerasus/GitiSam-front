<template>
  <div class="flex justify-end q-mb-md">
    <q-btn v-if="userManager.isResident || userManager.isOwner"
           color="primary"
           @click="goBack">
      بازگشت
    </q-btn>
  </div>
  <entity-show
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false"
    :show-index-button="userManager.isManager || userManager.isAccountant"
    :show-edit-button="userManager.isManager || userManager.isAccountant"
    :after-load-input-data="afterLoadInputData"
  >
    <template #before-form-builder>
      <div v-if="transactionData && transactionData.unit">
        <q-badge class="q-mr-md cursor-pointer"
        @click="showUnit">
          شماره واحد:
          {{ transactionData.unit.unit_number }}
        </q-badge>
        <q-badge v-if="transactionData.unit.residents.length > 0"
                 class="q-mr-md cursor-pointer"
                 @click="showUnit">
          ساکن:
          {{ getUnitUserFullname(transactionData.unit.residents) }}
        </q-badge>
        <q-badge v-if="transactionData.unit.owners.length > 0"
                 class="q-mr-md cursor-pointer"
                 @click="showUnit">
          مالک:
          {{ getUnitUserFullname(transactionData.unit.owners) }}
        </q-badge>
      </div>
    </template>
    <template #after-form-builder>
      <div class="flex justify-center items-center q-mt-xl">
        <q-btn color="red"
        @click="showDeleteConfirmationDialog">
          <q-icon name="delete" color="white" />
          حذف این تراکنش
        </q-btn>
      </div>
    </template>
  </entity-show>

  <q-dialog v-model="showDialog" :persistent="deleteTransactionLoading">
    <confirmation
      title="توجه"
      message="از حذف این تراکنش اطمینان دارید؟"
      submit-label="بله"
      cancel-label="انصراف"
      icon="info"
      title-color="red"
      :loading="deleteTransactionLoading"
      @submit="onsubmitDeleteTransaction"
      @cancel="hideDialog"
    />
  </q-dialog>

  <q-separator v-if="transactionData && transactionData?.images.length > 0" class="q-my-md" />

  <imageable-list v-if="transactionData && transactionData?.images.length > 0"
                  :images="transactionData?.images"
                  :can-manage="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { EntityShow } from 'quasar-crud';
import { useUser } from 'src/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { getUnitUserFullname } from 'src/repositories/unit';
import ImageableList from 'src/components/ImageableList.vue';
import Confirmation from 'src/components/cards/confirmation.vue';
import TransactionAPI, { type TransactionType } from 'src/repositories/transaction';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const userManager = useUser();
const transactionAPI = new TransactionAPI();

const transactionId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const transactionData = ref<TransactionType | null>(null);

const showDialog = ref(false);
const deleteTransactionLoading = ref(false);
const api = ref(transactionAPI.endpoints.byId(transactionId.value));
const label = ref('مشاهده تراکنش');
const indexRouteName = ref('Panel.Transaction.Payment.List');
const showRouteName = ref('Panel.Transaction.Payment.Show');
const editRouteName = ref('Panel.Transaction.Payment.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs()
]);

function afterLoadInputData(data: TransactionType) {
  transactionData.value = data;
}

function showUnit() {
  const unitId = transactionData.value?.unit?.id
   if (!unitId) {
     return
   }

   if (userManager.isManager || userManager.isAccountant) {
     router.push({ name: 'Panel.Unit.Show', params: { id: unitId } });
   } else {
     router.push({ name: 'Panel.Unit.Mine' })
   }
}

function showDeleteConfirmationDialog() {
  showDialog.value = true;
}

function hideDialog() {
  showDialog.value = false;
}

function onsubmitDeleteTransaction() {
  showDialog.value = false;
  deleteTransactionLoading.value = true;
  transactionAPI.delete(transactionId.value)
    .then(() => {
      $q.notify({
        message: 'تراکنش با موفقیت حذف شد.',
        type: 'positive'
      })
      goBack()
    })
    .finally(()=>{
      deleteTransactionLoading.value = false
    })
}

function goBack () {
  router.back()
}
</script>
