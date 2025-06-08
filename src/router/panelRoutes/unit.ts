import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'unit',
    name: 'Panel.Unit',
    meta: {
      pageCategory: 'واحدها',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Unit.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/unit/list.vue'),
      },
      {
        path: 'mine',
        name: 'Panel.Unit.Mine',
        meta: {
          breadCrumbs: [
            {
              label: 'واحد من',
            },
          ],
        },
        component: () => import('src/pages/panel/unit/mine.vue'),
      },
      {
        path: 'create',
        name: 'Panel.Unit.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید',
            },
          ],
        },
        component: () => import('src/pages/panel/unit/create.vue'),
      },
      {
        path: ':id',
        name: 'Panel.Unit.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/unit/show.vue'),
      },
      {
        path: ':id/edit',
        name: 'Panel.Unit.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش',
            },
          ],
        },
        component: () => import('src/pages/panel/unit/edit.vue'),
      },
      {
        path: ':id/transaction/create',
        name: 'Panel.Unit.Transaction.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'ثبت تراکنش',
            },
          ],
        },
        component: () => import('src/pages/panel/unit/createTransactionForUnit.vue'),
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
