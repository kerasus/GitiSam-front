import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'transactions',
    name: 'Panel.Transaction',
    meta: {
      pageCategory: 'تراکنش‌ها',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'payments',
        name: 'Panel.Transaction.Payment',
        meta: {
          pageCategory: 'تراکنش های پرداخت',
        },
        component: () => import('src/layouts/BareLayout.vue'),
        children: [
          {
            path: '',
            name: 'Panel.Transaction.Payment.List',
            meta: {
              breadCrumbs: [
                {
                  label: 'لیست',
                },
              ],
            },
            component: () => import('pages/panel/transaction/payment/list.vue'),
          },
          {
            path: 'create',
            name: 'Panel.Transaction.Payment.Create',
            meta: {
              breadCrumbs: [
                {
                  label: 'جدید',
                },
              ],
            },
            component: () => import('pages/panel/transaction/payment/create.vue'),
          },
          {
            path: ':id',
            name: 'Panel.Transaction.Payment.Show',
            meta: {
              breadCrumbs: [
                {
                  label: 'مشاهده',
                },
              ],
            },
            component: () => import('pages/panel/transaction/payment/show.vue'),
          },
          {
            path: ':id/edit',
            name: 'Panel.Transaction.Payment.Edit',
            meta: {
              breadCrumbs: [
                {
                  label: 'ویرایش',
                },
              ],
            },
            component: () => import('pages/panel/transaction/payment/edit.vue'),
          },
        ],
      },
      {
        path: 'incomes',
        name: 'Panel.Transaction.Income',
        meta: {
          pageCategory: 'تراکنش های درآمد',
        },
        component: () => import('src/layouts/BareLayout.vue'),
        children: [
          {
            path: '',
            name: 'Panel.Transaction.Income.List',
            meta: {
              breadCrumbs: [
                {
                  label: 'لیست',
                },
              ],
            },
            component: () => import('pages/panel/transaction/income/list.vue'),
          },
          {
            path: 'create-income',
            name: 'Panel.Transaction.Income.Create',
            meta: {
              breadCrumbs: [
                {
                  label: 'جدید',
                },
              ],
            },
            component: () => import('pages/panel/transaction/income/create.vue'),
          },
          {
            path: ':id',
            name: 'Panel.Transaction.Income.Show',
            meta: {
              breadCrumbs: [
                {
                  label: 'مشاهده',
                },
              ],
            },
            component: () => import('pages/panel/transaction/income/show.vue'),
          },
          {
            path: ':id/edit',
            name: 'Panel.Transaction.Income.Edit',
            meta: {
              breadCrumbs: [
                {
                  label: 'ویرایش',
                },
              ],
            },
            component: () => import('pages/panel/transaction/income/edit.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
