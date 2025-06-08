<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useUser } from 'src/stores/user';
import { computed, ref, type Ref, watch } from 'vue';
import { useAppLayout } from 'stores/appLayout';
import ListItem from './components/listItem.vue';
// import { useAppConfig } from 'stores/appConfig'

const $q = useQuasar();
const route = useRoute();
const i18nManager = useI18n();
const userManager = useUser();
const appLayoutStore = useAppLayout();
// const appConfig = useAppConfig()

const searchValue = ref('');


const allowedLinks = computed(() => topLinks.value
  .filter((link) => {
    return !link.forRoles ? true : link.forRoles.some((role) => userManager.hasRole(userManager.me, role))
  }));
const filterLinks = computed(() => {
  if (searchValue.value === null) {
    return allowedLinks.value;
  }
  return allowedLinks.value
    .map((link) => {
      if (link.child) {
        const filteredChildren = link.child.filter((child) =>
          i18nManager.t(child.title).includes(searchValue.value),
        );
        if (filteredChildren.length > 0) {
          return { ...link, child: filteredChildren };
        }
      }
      if (i18nManager.t(link.title).includes(searchValue.value)) {
        return link;
      }
      return null;
    })
    .filter((link) => link !== null);
});
const currentRouteName = computed(() => route.name)

type ListItemType = {
  icon: string;
  iconColor?: string;
  title: string;
  mainRouteName?: string;
  route?: { name: string };
  forRoles?: string[];
  child?: ListItemType[];
};

const topLinks: Ref<Array<ListItemType>> = ref([
  {
    icon: 'dashboard',
    title: 'داشبورد',
    route: { name: 'Panel.Dashboard' },
  },
  {
    icon: 'group',
    title: 'کاربران',
    forRoles: [ 'Manager' ],
    route: { name: 'Panel.User.List' },
  },
  // {
  //   icon: 'location_city',
  //   title: 'ساختمان ها',
  //   route: { name: 'Panel.Building.List' },
  // },
  {
    icon: 'maps_home_work',
    title: 'واحد ها',
    forRoles: [ 'Manager', 'Accountant' ],
    route: { name: 'Panel.Unit.List' },
  },
  {
    icon: 'receipt_long',
    title: 'فاکتور ها',
    forRoles: [ 'Manager', 'Accountant' ],
    route: { name: 'Panel.Invoice.List' },
  },
  {
    icon: 'receipt',
    title: 'دسته های فاکتور',
    forRoles: [ 'Manager' ],
    route: { name: 'Panel.InvoiceCategory.List' },
  },
  {
    icon: 'assignment',
    title: 'توزیع فاکتورها',
    forRoles: [ 'Manager', 'Accountant' ],
    route: { name: 'Panel.InvoiceDistribution.List' },
  },
  {
    icon: 'currency_exchange',
    title: 'تراکنش ها',
    forRoles: [ 'Manager', 'Accountant' ],
    route: { name: 'Panel.Transaction.Payment.List' },
  },
  {
    icon: 'currency_exchange',
    title: 'درآمد ها',
    forRoles: [ 'Manager', 'Accountant' ],
    route: { name: 'Panel.Transaction.Income.List' },
  },
  {
    icon: 'currency_exchange',
    title: 'واحد من',
    forRoles: [ 'Resident', 'Owner', 'Manager', 'Accountant' ],
    route: { name: 'Panel.Unit.Mine' },
  },
]);

const bottomLinks: Ref<Array<ListItemType>> = ref([
  // { icon: 'ph:chats-circle', title: 'menu.leftDrawer.forum', route: { name: 'Panel.Forum' } }
]);

// function toggleLeftDrawer() {
//   appLayoutStore.layoutLeftDrawerMiniToOverlay = $q.screen.lt.md;
//   appLayoutStore.layoutLeftDrawerMini = !appLayoutStore.layoutLeftDrawerMini;
//   // appLayoutStore.layoutLeftDrawerVisible = !appLayoutStore.layoutLeftDrawerVisible
// }

watch(currentRouteName, () => {
  if ($q.screen.lt.md) {
    appLayoutStore.layoutLeftDrawerVisible = false;
  }
}, {
  immediate: true
})
</script>

<template>
  <div class="left-drawer__toggle-mini">
    <!-- <q-btn
      class="icon-button drawer-btn"
      color="primary"
      flat
      :icon="
        appLayoutStore.layoutLeftDrawerMini
          ? 'keyboard_double_arrow_left'
          : 'keyboard_double_arrow_right'
      "
      @click="toggleLeftDrawer"
    /> -->
  </div>
  <div class="left-drawer" :class="{ 'left-drawer--mini': appLayoutStore.layoutLeftDrawerMini }">
    <div class="left-drawer__inner">
      <div class="left-drawer__logo-section">
        <div class="left-drawer__logo-section-img">
          <q-img
            :src="appLayoutStore.layoutLeftDrawerMini ? '/images/logo.png' : '/images/logo.png'"
          />
        </div>
        <div v-if="false" class="left-drawer__logo-section-title" />
      </div>
      <q-separator />
      <q-scroll-area class="scroll-area">
        <q-list padding>
          <list-item :items="filterLinks" :mini="appLayoutStore.layoutLeftDrawerMini" />
        </q-list>
        <q-list padding>
          <q-item
            v-for="link in bottomLinks"
            :key="link.title"
            v-ripple
            exact
            :to="link.route"
            clickable
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" :color="link.iconColor" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t(link.title) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="left-drawer__copyright-section">
        <div>
          <a referrerpolicy='origin' target='_blank'
             href='https://trustseal.enamad.ir/?id=599953&Code=4NZIzaPzRAmgSYw8liJCGesmSoyjiJc6'>
            <img referrerpolicy='origin'
                 src='https://trustseal.enamad.ir/logo.aspx?id=599953&Code=4NZIzaPzRAmgSYw8liJCGesmSoyjiJc6' alt=''
                 style='cursor:pointer; max-width: 100%;' code='4NZIzaPzRAmgSYw8liJCGesmSoyjiJc6'>
          </a>
        </div>
        <!-- <span class="app-version">
          {{ $t('app.version') }}: {{ appConfig.version }}
        </span> -->
        <span> Copyright GitiSam co. </span>
        <span class="copy-right"> &copy; {{ new Date().getFullYear() }} </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-drawer__toggle-mini {
  position: absolute;
  right: 0;
  transform: translateX(calc(50% - 2px));
  top: $space-14;
  z-index: 2;
}
.left-drawer {
  background: $gray-100;
  width: 100%;
  height: 100%;
  position: relative;
  .q-separator {
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0)
    );
    background-color: transparent;
  }
  .left-drawer__inner {
    background: $gray-100;
    padding: $space-4 $space-2;
    border-radius: 0 $radius-6 $radius-6 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    .left-drawer__logo-section {
      display: flex;
      flex-flow: row;
      justify-content: flex-start;
      gap: $space-2;
      margin-bottom: $space-9;
      min-height: $space-7;
      padding-left: $space-4;
      .left-drawer__logo-section-img {
        width: 100%;
      }
      .left-drawer__logo-section-title {
        //color: $neutral-100;
        display: flex;
        align-items: center;
      }
    }
    :deep(.scroll-area) {
      flex: 1;
      .q-scrollarea__container {
        .q-scrollarea__content {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
    .left-drawer__copyright-section {
      padding-left: $space-4;
      color: #67748e;
      font-size: 12px;
      direction: rtl;
      text-align: left;
      .app-version {
      }
      .copy-right {
      }
    }
  }
  &.left-drawer--mini {
    .left-drawer__inner {
      .left-drawer__logo-section {
        justify-content: center;
        padding: unset;
        .left-drawer__logo-section-img {
          width: $space-10;
        }
        .left-drawer__logo-section-title {
          display: none;
        }
      }
      :deep(.scroll-area) {
        flex: 1;
        .q-scrollarea__container {
          .q-scrollarea__content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
      }
      .left-drawer__copyright-section {
        display: flex;
        flex-direction: column;
        span {
          text-align: justify;
        }
      }
    }
  }
}
:deep(.q-expansion-item--expanded) {
  color: $primary;
  .q-expansion-item__container {
    .q-icon {
      color: $primary;
    }
  }
}
</style>
