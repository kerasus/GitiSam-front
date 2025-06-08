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
  />

  <q-separator class="q-my-md" />

  <imageable-list v-if="invoiceData"
                  :images="invoiceData?.images"
                  :can-manage="true"
                  @delete="deleteImage"
  />

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
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import { computed, ref, onMounted } from 'vue';
import { FormBuilder } from 'quasar-form-builder'
import { FormBuilderAssist } from 'quasar-form-builder';
import type { ImageType} from 'src/repositories/invoice';
import ImageableList from 'src/components/ImageableList.vue';
import InvoiceCategoryApi from 'src/repositories/invoiceCategory';
import InvoiceAPI, { type InvoiceType } from 'src/repositories/invoice';

const route = useRoute();
const invoiceAPI = new InvoiceAPI();
const invoiceCategoryApi = new InvoiceCategoryApi();

const invoiceId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const attachLoading = ref(false);
const entityEditKey = ref(Date.now());
const invoiceData = ref<InvoiceType | null>(null);
const api = ref(invoiceAPI.endpoints.byId(invoiceId.value));
const label = ref('ویرایش فاکتور');
const indexRouteName = ref('Panel.Invoice.List');
const showRouteName = ref('Panel.Invoice.Show');
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

function afterLoadInputData(data: InvoiceType) {
  invoiceData.value = data;
}

async function loadInputOptions() {
  const result = await invoiceCategoryApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(inputs.value, 'invoice_category_id', 'options', result.data);
}

async function deleteImage(image: ImageType) {
  try {
    attachLoading.value = true;
    await invoiceAPI.detachImageFromInvoice(invoiceId.value, image.id)
  } finally {
    attachLoading.value = false;
    entityEditKey.value = Date.now();
  }
}

async function addImage () {
  try {
    attachLoading.value = true;
    const image = FormBuilderAssist.getInputsByName(imageInputs.value, 'image').value;
    const formData = new FormData();
    formData.append('image', image);
    await invoiceAPI.attachImageToInvoice(invoiceId.value, formData)
  } finally {
    attachLoading.value = false;
    entityEditKey.value = Date.now();
  }
}

onMounted(() => {
  loadInputOptions();
});
</script>
