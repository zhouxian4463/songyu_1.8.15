/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

import { formDesignRouter } from "@/components/apps/form-design/form-design.router";
import { formPreviewRouter } from "@/components/apps/form-preview/form-preview.router";
import { listDesignRouter } from "@/components/apps/list-design/list-design.router";
import { listPreviewRouter } from "@/components/apps/list-preview/list-preview.router";

import reports from "@/components/apps/report-design/report-design.router";

// import settings from '@/router/settings';
import system from "@/router/system";
import print from "@/router/print";
import intergration from "@/router/integration";

import demo from "@/router/demo";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/apps",
    },
    {
      path: "/error",
      name: "error",
      meta: { title: "云枢-出错了" },
      component: () => import("@/views/error/error.vue"),
    },
    {
      path: "/success",
      name: "shared-success",
      component: () => import("@/views/error/success.vue"),
    },
    {
      path: "/empty",
      name: "shared-empty",
      component: () => import("@/views/error/empty.vue"),
    },
    {
      path: '/form-unpublished',
      name: 'formUnpublished',
      component: () => import("@/views/error/form-unpublished.vue"),
    },
    {
      path: "/permission",
      name: "permission",
      meta: { title: "云枢-没有权限" },
      component: () => import("@/views/error/permission.vue"),
    },
    {
      path: "/organization",
      component: () => import("../views/organization/index.vue"),
      children: [
        {
          path: "/",
          redirect: { name: "orguser" },
        },
        {
          path: "orguser",
          name: "orguser",
          meta: { title: "云枢-组织机构" },
          component: () => import("../views/organization/orguser.vue"),
        },
        {
          path: "orgrole",
          name: "orgrole",
          meta: { title: "云枢-组织角色" },
          component: () => import("../views/organization/orgrole.vue"),
        },
        {
          path: "orgsync",
          name: "orgsync",
          meta: { title: "云枢-组织同步" },
          component: () => import("../views/organization/orgsync.vue"),
        },
      ],
    },
    {
      path: "/apps",
      name: "apps",
      component: () => import("../views/routerview.vue"),
      children: [
        {
          path: "/",
          name: "appcenter",
          meta: { title: "云枢-应用中心" },
          component: () => import("../views/app/center/index.vue"),
        },
        {
          path: "appitem/:appCode",
          name: "appitem",
          meta: { title: "云枢-应用管理" },
          props: true,
          component: () => import("../views/app/center/appitem.vue"),
        },
        // NOTE: 暂时隐藏应用设置独立路由
        // settings,

        ...reports,

        {
          path: "model/:appCode/:bizSchemaCode",
          name: "bizmodel",
          props: true,
          component: () => import("../views/routerview.vue"),
          children: [
            {
              path: "/",
              redirect: { name: "datamodel" },
            },
            {
              path: "dispatcher",
              name: "dispatcher",
              props: true,
              component: () => import("../components/apps/dispatcher.vue"),
            },
            {
              path: "data",
              name: "datamodel",
              // meta: { title: '云枢-数据模型设计' },
              props: true,
              component: () => import("../views/app/model/datamodel.vue"),
            },
            formDesignRouter,
            formPreviewRouter,
            listDesignRouter,
            listPreviewRouter,
            print[0],
            print[1],
            {
              path: "workflowDesign/:workflowCode",
              name: "workflowDesign",
              // meta: { title: '云枢-流程设计' },
              props: true,
              component: () => import("../views/app/model/workflow.vue"),
            },
            {
              path: "mockDetail/:workflowCode",
              name: "mockDetail",
              meta: { title: "云枢-流程模拟" },
              props: true,
              component: () => import("../views/app/workflow-mock/mock-detail.vue"),
            },
            {
              path: "mockForm/:workflowCode",
              name: "mockForm",
              meta: { title: "云枢-流程模拟" },
              props: true,
              component: () => import("../views/app/workflow-mock/mock-form.vue"),
            },
            {
              path: "mockHistory/:workflowCode",
              name: "mockHistory",
              meta: { title: "云枢-流程模拟" },
              props: true,
              component: () => import("../views/app/workflow-mock/mock-history.vue"),
            },
            {
              path: "workflowEmpty",
              name: "workflowEmpty",
              // meta: { title: '云枢-流程设计' },
              props: true,
              component: () => import("../views/app/model/workflowEmpty.vue"),
            },
            {
              path: "workflowSetting/:workflowCode",
              name: "workflowSetting",
              meta: { title: "云枢-流程设置" },
              props: true,
              component: () => import("../views/app/model/workflowSetting.vue"),
            },
            {
              path: "biz-rule/:bizRuleCode",
              name: "biz-rule",
              meta: { title: "云枢-业务规则" },
              props: true,
              component: () =>
                import("../views/app/biz-rule/biz-rule-design.vue"),
            },
          ],
        },
      ],
    },
    system,
    intergration,
    demo,
    {
      path: "*",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { isOnlyAppAdmin, isAdmin } = (store.state as any).System.User;

  if (isAdmin) {
    if (isOnlyAppAdmin && !['/apps', '/organization', '/manager-setting', '/system', '/integration'].includes(to.matched[0].path)) {
      router.push({
        path: "/apps",
      });
    }
  } else if (to.matched[0].name !== "permission") {
    router.push({
      name: "permission",
      query: {
        T: `${new Date().getTime()}`,
      },
    });
  }

  if (
    to.name &&
    [
      "appitem",
      "datamodel",
      "form-design",
      "list-design",
      "workflowDesign",
      "report-design",
      "dispatcher",
    ].includes(to.name)
  ) {
    document.title = document.title || "加载中...";
  } else {
    document.title = to.meta.title || "云枢-admin";
  }

  next();
});

export default router;
