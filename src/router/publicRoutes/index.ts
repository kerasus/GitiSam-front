import authRoutes from './auth';
import type { RouteRecordRaw } from 'vue-router';

export const index: RouteRecordRaw[] = [
  {
    path: '',
    meta: {
      layoutConfig: {
        layoutHeader: true,
        layoutLeftDrawer: true,
        layoutRightDrawer: false,
        layoutFooter: false,
      },
    },
    name: 'HomePage',
    component: () => import('src/pages/IndexPage.vue'),
  },
  {
    path: 'public/unit/:unit_id',
    name: 'PublicUnitBoard',
    meta: {
      layoutConfig: {
        layoutHeaderType: 'paymentResult',
        layoutHeader: true,
        layoutLeftDrawer: false,
        layoutRightDrawer: false,
        layoutFooter: false,
      },
    },
    component: () => import('src/pages/public/unit.vue'),
  },
  {
    path: 'payment-result',
    name: 'PaymentResult',
    meta: {
      layoutConfig: {
        layoutHeaderType: 'paymentResult',
        layoutHeader: true,
        layoutLeftDrawer: false,
        layoutRightDrawer: false,
        layoutFooter: false,
      },
    },
    component: () => import('pages/PaymentResult.vue'),
  },
  {
    path: 'auth',
    meta: {
      layoutConfig: {
        layoutHeader: false,
        layoutLeftDrawer: false,
        layoutRightDrawer: false,
        layoutFooter: false,
      },
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [...authRoutes],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];
