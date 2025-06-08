<template>
  <div class="auth-page row">
    <div class="col-md-6 col-sm-12 col-12">
      <div class="auth-page__login">
        <div class="row justify-center items-center full-width">
          <div class="col-md-8">
            <div class="auth-page__login__head">
              <q-img src="/images/logo.png"
                     @click="goToHomePage"
              />
            </div>
            <div class="auth-page__login__title">گیتی سام</div>
            <auth-component class="auth-component" />
            <div class="flex justify-center items-center full-width q-mt-md">
              <a referrerpolicy='origin' target='_blank'
                 href='https://trustseal.enamad.ir/?id=599953&Code=4NZIzaPzRAmgSYw8liJCGesmSoyjiJc6'>
                <img referrerpolicy='origin'
                     src='https://trustseal.enamad.ir/logo.aspx?id=599953&Code=4NZIzaPzRAmgSYw8liJCGesmSoyjiJc6' alt=''
                     style='cursor:pointer; max-width: 100%;' code='4NZIzaPzRAmgSYw8liJCGesmSoyjiJc6'>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AuthComponent from 'src/components/AuthComponent.vue';

const router = useRouter();

defineOptions({
  name: 'AuthPage',
});

function goToHomePage() {
  router.push({ name: 'HomePage' });
}
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  max-height: 100vh;
  align-content: stretch;
  justify-content: center;
  padding: $space-10 $space-7;
  background-color: $color-surface;
  .auth-page__login {
    height: 100%;
    padding-top: $space-21;
    .auth-page__login__head {
      width: 188px;
      margin: auto;
      margin-bottom: $space-4;
    }
    .auth-page__login__title {
      text-align: center;
      margin-bottom: $space-16;
      color: $color-text1;
      @include typo-title-1;
    }
    .auth-component {
      margin: auto;
    }
  }
  .auth-page__slider {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    @include radius-10;
    background-color: $neutral-20;
    @include media-max-width('sm') {
      display: none;
    }
  }
}
</style>
