import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'building',
    name: 'Panel.Building',
    meta: {
      pageCategory: 'ساختمان‌ها',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Building.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/building/list.vue'),
      },
      {
        path: 'create',
        name: 'Panel.Building.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید',
            },
          ],
        },
        component: () => import('src/pages/panel/building/create.vue'),
      },
      {
        path: ':id',
        name: 'Panel.Building.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/building/show.vue'),
      },
      {
        path: ':id/edit',
        name: 'Panel.Building.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش',
            },
          ],
        },
        component: () => import('src/pages/panel/building/edit.vue'),
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
