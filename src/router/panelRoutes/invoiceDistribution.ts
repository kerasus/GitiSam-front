import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'invoice-distribution',
    name: 'Panel.InvoiceDistribution',
    meta: {
      pageCategory: 'توزیع فاکتورها',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.InvoiceDistribution.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceDistribution/list.vue'),
      },
      {
        path: 'create',
        name: 'Panel.InvoiceDistribution.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceDistribution/create.vue'),
      },
      {
        path: ':id',
        name: 'Panel.InvoiceDistribution.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceDistribution/show.vue'),
      },
      {
        path: ':id/edit',
        name: 'Panel.InvoiceDistribution.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceDistribution/edit.vue'),
      },
      {
        path: ':invoice_distribution_id/unit/:unit_id/pay',
        name: 'Panel.InvoiceDistribution.Pay',
        meta: {
          breadCrumbs: [
            {
              label: 'پرداخت',
            },
          ],
        },
        component: () => import('src/pages/panel/invoiceDistribution/pay.vue'),
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
