/*
 * @Author: Fan
 * @Date: 2020-04-19 19:31:21
 * @description:
 * @LastEditors: Fan
 */
import {
  ControllerConduct,
  ControlAttributeType,
} from "@cloudpivot/form/typings";
import {
  formatterValueToSetStatus,
  formatterRequiredFormula,
} from "@cloudpivot/form/utils";
import baseAttribute from "@cloudpivot/form/src/common/component-base-attribute";
import { utils } from "@cloudpivot/common";

const DateHandle = utils.DateHandle;
export default {
  groups: {
    base: {
      label: "基础信息",
      keys: ["name", "visible", "style", "tips", "dataItemName", "widgetType"],
    },
    controller: {
      label: "控制属性",
      keys: [
        "defaultValue",
        "displayFormula",
        "requiredFormula",
        "readonlyFormula",
        "placeholder",
        "computeFormula",
        "format",
        "verifyFormula",
      ],
    },
  },
  properties: {
    name: {
      ...baseAttribute.name,
    },
    dataItemName: {
      ...baseAttribute.dataItemName,
    },
    style: {
      ...baseAttribute.style,
    },
    widgetType: {
      ...baseAttribute.widgetType,
      value: "数值",
    },
    defaultValue: {
      options: {
        regexps: {
          regexps: [
            {
              regexp: /^-?(\.|(0|(\d){0,19}))?(\.\d{0,3})?$/,
              message: "只能输入数值类型，最大长度19位数，精度3位数",
            },
          ],
        },
      },
    },
    placeholder: {
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节",
          },
        },
      },
    },
    displayFormula: {
      inputMethod: ControlAttributeType.Modal,
      modalType: "showRule",
      inputComponent: () =>
        import("@cloudpivot/form/src/common/components/required-condition.vue"),
      options: {
        formatter: formatterValueToSetStatus,
      },
    },
    requiredFormula: {
      inputMethod: ControlAttributeType.Modal,
      inputComponent: () =>
        import("@cloudpivot/form/src/common/components/required-condition.vue"),
      options: {
        formatter: formatterRequiredFormula,
      },
    },
    computeFormula: {
      inputMethod: ControlAttributeType.Modal,
      inputComponent: () =>
        import("@cloudpivot/form/src/common/components/calculate-rule.vue"),
      options: {
        formatter: formatterValueToSetStatus,
      },
    },
    format: {
      inputMethod: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "none",
            label: "空",
          },
          {
            value: "integer",
            label: "2000",
          },
          {
            value: "tenths",
            label: "2,000.0",
          },
          {
            value: "percentile",
            label: "2,000.00",
          },
          {
            value: "Millimeter",
            label: "2,000.000",
          },
          {
            value: "tenThousand",
            label: "2,000.0000",
          },
          {
            value: "ratio",
            label: "20%",
          },
          {
            value: "ratio.tenths",
            label: "20.0%",
          },
          {
            value: "ratio.percentile",
            label: "20.00%",
          },
          {
            value: "ratio.Millimeter",
            label: "20.000%",
          },
          {
            value: "ratio.tenThousand",
            label: "20.0000%",
          },
          {
            value: "RMB.percentile",
            label: "￥2,000.00",
          },
          {
            value: "RMB.Millimeter",
            label: "￥2,000.000",
          },
          {
            value: "RMB.tenThousand",
            label: "￥2,000.0000",
          },
          {
            value: "dollar.percentile",
            label: "$2,000.00",
          },
          {
            value: "dollar.Millimeter",
            label: "$2,000.000",
          },
          {
            value: "dollar.tenThousand",
            label: "$2,000.0000",
          },
          {
            value: "euro.percentile",
            label: "€2,000.00",
          },
          {
            value: "euro.Millimeter",
            label: "€2,000.000",
          },
          {
            value: "euro.tenThousand",
            label: "€2,000.0000",
          },
          {
            value: "HK.percentile",
            label: "HK$2,000.00",
          },
          {
            value: "HK.Millimeter",
            label: "HK$2,000.000",
          },
          {
            value: "HK.tenThousand",
            label: "HK$2,000.0000",
          },
        ],
      },
    },
    verifyFormula: {
      inputMethod: ControlAttributeType.Modal,
      inputComponent: () =>
        import(
          "@cloudpivot/form/src/common/components/verify-formula-number.vue"
        ),
      options: {
        formatter: formatterValueToSetStatus,
      },
    },
  },
} as ControllerConduct;
