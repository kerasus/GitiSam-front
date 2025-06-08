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
  />

  <q-separator v-if="invoiceImages.length > 0" class="q-my-md" />

  <imageable-list v-if="invoiceImages.length > 0"
                  :images="invoiceImages"
                  :can-manage="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { computed, onMounted, ref } from 'vue';
import { EntityShow } from 'quasar-crud';
import { useUser } from 'src/stores/user';
import { useRoute, useRouter } from 'vue-router';
import { FormBuilderAssist } from 'quasar-form-builder';
import ImageableList from 'src/components/ImageableList.vue';
import InvoiceCategoryApi from 'src/repositories/invoiceCategory';
import InvoiceDistributionAPI, { type InvoiceDistributionType } from 'src/repositories/invoiceDistribution';

const route = useRoute();
const router = useRouter();
const userManager = useUser();
const invoiceCategoryApi = new InvoiceCategoryApi();
const invoiceDistributionAPI = new InvoiceDistributionAPI();

const invoiceDistributionId = computed(() =>
  route.params.id ? parseInt(route.params.id?.toString()) : 0,
);

const invoiceImages = computed(() =>
  invoiceDistributionData.value && invoiceDistributionData.value.invoice?.images ? invoiceDistributionData.value.invoice?.images : [],
);

const invoiceDistributionData = ref<InvoiceDistributionType | null>(null);
const api = ref(invoiceDistributionAPI.endpoints.byId(invoiceDistributionId.value));
const label = ref('مشاهده توزیع فاکتور');
const indexRouteName = ref('Panel.InvoiceDistribution.List');
const showRouteName = ref('Panel.InvoiceDistribution.Show');
const editRouteName = ref('Panel.InvoiceDistribution.Edit');
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

function goBack () {
  router.back()
}

function afterLoadInputData(data: InvoiceDistributionType) {
  invoiceDistributionData.value = data;
}

async function loadInputOptions() {
  const invoiceCategoryResult = await invoiceCategoryApi.index({ length: 9999 });
  FormBuilderAssist.setAttributeByName(inputs.value, 'invoice_category_id', 'options', invoiceCategoryResult.data);
}

onMounted(() => {
  loadInputOptions();
});
</script>
