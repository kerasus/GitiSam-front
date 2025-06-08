import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'invoiceCategory',
    name: 'Panel.InvoiceCategory',
    meta: {
      pageCategory: 'دسته های فاکتور',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.InvoiceCategory.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceCategory/list.vue'),
      },
      {
        path: 'create',
        name: 'Panel.InvoiceCategory.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceCategory/create.vue'),
      },
      {
        path: ':id',
        name: 'Panel.InvoiceCategory.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceCategory/show.vue'),
      },
      {
        path: ':id/edit',
        name: 'Panel.InvoiceCategory.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceCategory/edit.vue'),
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
