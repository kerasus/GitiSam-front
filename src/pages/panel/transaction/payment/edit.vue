<template>
  <entity-edit
    :key="entityEditKey"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :after-load-input-data="afterLoadInputData"
  >
    <template #before-form-builder>
      <div v-if="transactionData && transactionData.unit">
        <q-badge class="q-mr-md">
          شماره واحد:
          {{ transactionData.unit.unit_number }}
        </q-badge>
        <q-badge v-if="transactionData.unit.residents.length > 0"
                 class="q-mr-md">
          ساکن:
          {{ getUnitUserFullname(transactionData.unit.residents) }}
        </q-badge>
        <q-badge v-if="transactionData.unit.owners.length > 0"
                 class="q-mr-md">
          مالک:
          {{ getUnitUserFullname(transactionData.unit.owners) }}
        </q-badge>
      </div>
    </template>
  </entity-edit>

  <q-separator v-if="transactionData && transactionData?.images.length > 0" class="q-my-md" />

  <imageable-list v-if="transactionData && transactionData?.images.length > 0"
                  :images="transactionData?.images"
                  :can-manage="true"
                  @delete="deleteImage" />
  <q-separator class="q-my-md" />

  <q-card>
    <q-card-section>
      <div class="row">
        <div class="col-md-6 col-12">
          <form-builder v-model:value="imageInputs" />
        </div>
        <div class="col-md-6 col-12">
          <q-btn color="primary" label="افزودن عکس" :loading="attachLoading" @click="addImage" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import ImageableList from 'components/ImageableList.vue';
import type { ImageType } from 'src/repositories/invoice';
import { getUnitUserFullname } from 'src/repositories/unit';
import { FormBuilder, FormBuilderAssist } from 'quasar-form-builder';
import TransactionAPI, { type TransactionType } from 'src/repositories/transaction';

const transactionAPI = new TransactionAPI();
const route = useRoute();

const transactionId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const transactionData = ref<TransactionType | null>(null);

const attachLoading = ref(false);
const entityEditKey = ref(Date.now());

const api = ref(transactionAPI.endpoints.byId(transactionId.value));
const label = ref('ویرایش تراکنش');
const indexRouteName = ref('Panel.Transaction.Payment.List');
const showRouteName = ref('Panel.Transaction.Payment.Show');
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
const imageInputs = ref([
  {
    type: 'file',
    name: 'image',
    responseKey: 'image',
    label: 'تصویر',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
]);

function afterLoadInputData(data: TransactionType) {
  transactionData.value = data;
}

async function addImage () {
  try {
    attachLoading.value = true;
    const image = FormBuilderAssist.getInputsByName(imageInputs.value, 'image').value;
    const formData = new FormData();
    formData.append('image', image);
    await transactionAPI.attachImage(transactionId.value, formData)
  } finally {
    attachLoading.value = false;
    entityEditKey.value = Date.now();
  }
}

async function deleteImage(image: ImageType) {
  try {
    attachLoading.value = true;
    await transactionAPI.detachImage(transactionId.value, image.id)
  } finally {
    attachLoading.value = false;
    entityEditKey.value = Date.now();
  }
}
</script>
