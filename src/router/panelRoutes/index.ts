import userRoutes from './user';
import unitRoutes from './unit';
import invoiceRoutes from './invoice';
import buildingRoutes from './building';
import transactionRoutes from './transaction';
import invoiceCategoryRoutes from './invoiceCategory';
import invoiceDistributionRoutes from './invoiceDistribution';
import type { RouteRecordRaw } from 'vue-router';
import Authenticated from 'src/router/middleware/Authenticated';

export const index: RouteRecordRaw[] = [
  {
    path: 'panel',
    meta: {
      middleware: [Authenticated],
      layoutConfig: {
        // layoutHeader: false,
        // layoutLeftDrawer: false,
        // layoutRightDrawer: false,
        // layoutFooter: false
      },
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Panel.Dashboard',
        meta: {
          pageCategory: 'داشبورد',
        },
        component: () => import('src/pages/panel/dashboard.vue'),
      },

      ...userRoutes,
      ...unitRoutes,
      ...invoiceRoutes,
      ...buildingRoutes,
      ...invoiceCategoryRoutes,
      ...transactionRoutes,
      ...invoiceDistributionRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];
