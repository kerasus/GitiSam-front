<script setup lang="ts">
import { ref } from 'vue'
import { type ImageType } from 'src/repositories/invoice'
import Confirmation from 'src/components/cards/confirmation.vue';

defineProps<{
  images: ImageType[],
  canManage: boolean
}>()

const emits = defineEmits(['delete'])

const deleteDialog = ref(false);
const imageDialog = ref<boolean>(false)
const selectedImage = ref<ImageType | null>(null)
const selectedImageToDelete = ref<ImageType | null>(null)

function selectImage(image: ImageType) {
  selectedImage.value = image
  imageDialog.value = true
}

function deleteImage(image: ImageType) {
  emits('delete', image)
}

function showDeleteImageDialog (image: ImageType): void {
  selectedImageToDelete.value = image
  deleteDialog.value = true
}

function onsubmitDeleteImage () {
  if (selectedImageToDelete.value) {
    deleteImage(selectedImageToDelete.value)
  }
}

function hideDeleteImageDialog () {
  deleteDialog.value = false
}
</script>

<template>
  <q-card>
    <q-card-section>
      تصاویر
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div v-for="(image, imageKey) in images"
             :key="imageKey"
             class="col-md-2 col-12">
          <div class="image-item">
            <q-btn v-if="canManage" icon="delete" color="red" @click="showDeleteImageDialog(image)" />
            <q-img :src="image.url" @click="selectImage(image)"/>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="imageDialog" full-width>
    <q-card style="width: 100%;">
      <q-card-section>
        <q-btn v-close-popup icon="close" color="red"/>
        <q-img v-if="selectedImage" :src="selectedImage.url" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="deleteDialog">
    <confirmation
      title="توجه"
      message="از حذف این تصویر اطمینان دارید؟"
      submit-label="بله"
      cancel-label="انصراف"
      icon="feedback"
      title-color="warning"
      @submit="onsubmitDeleteImage"
      @cancel="hideDeleteImageDialog"
    />
  </q-dialog>
</template>

<style scoped lang="scss">
.image-item {
  box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  &:hover {
    transform: perspective(999px) rotateX(7deg) translate3d(0px, -4px, 5px);
  }
  .q-btn {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
}
</style>
