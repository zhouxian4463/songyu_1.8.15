<template>
  <a-tree-select
    ref="treeSelect"
    v-model="result"
    class="biz-models-selector"
    allowClear
    showSearch
    :treeData="treeData"
    @treeExpand="onTreeExpand"
    :dropdownStyle="{ maxHeight: '350px',height: '350px', maxWidth: width+ 'px', overflow: 'auto' }"
    @change="onChange"
    @search="onSearch"
    @focus="onFocus"
    :disabled="disabled"
    :placeholder="placeholder"
    dropdownClassName="fixed biz-model-select"
    treeNodeFilterProp="title"
    :searchValue="searchValue"
  >
    <!-- treeSelect -->
    <span
      slot="title"
      slot-scope="{label, icon}"
      class="cus-title"
      style="font-size: 14px!important"
    >
      <i :class="'icon aufontAll ' + icon" />
      {{ label }}
    </span>
  </a-tree-select>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import { listApi } from "@cloudpivot/api";
declare namespace treeSelector {
  interface treeItem {
    title: string;
    value: string;
    key: string;
    children?: Array<treeItem>;
    isLeaf: boolean;
    selectable?: boolean;
    dataRef?: {
      type?: string;
    };
    _loaded?: boolean;
    // scopedSlots?: {
    //   title: string
    // }
  }
}
namespace AppItem {
  interface ItemTree {
    // 定义目录树结构请求参数
    appCode: string;
  }
  interface appManagerModel {
    // 定义获取子管理员管理的应用模型过滤参数
    filterType?: string;
  }
  interface AddFolders {
    // 定义新建目录请求参数
    appCode: string;
    name: string;
    parentId: string;
    name_i18n: string;
  }
  interface UpdateFolders {
    // 定义修改目录请求参数
    id: string;
    name: string;
    name_i18n: string;
  }
  interface DeleteFolders {
    // 定义删除目录请求参数
    folderId: string;
  }
  interface ValidFolder {
    // 校验目录节点下是否存在业务模型请求参数
    folderId: string;
    appCode: string;
  }
  interface AddBizModel {
    // 定义新增业务模型请求参数
    appCode: string;
    name: string;
    parentId: string;
    bizSchemaCode: string;
    icon: string;
    name_i18n: string;
    pcAble: boolean;
    mobileAble: boolean;
  }
  interface UpdateBizModel {
    // 定义修改业务模型请求参数
    id: string;
    name: string;
    bizSchemaCode: string;
    icon: string;
    parentId: string;
    name_i18n: string;
    pcAble: boolean;
    mobileAble: boolean;
  }
  interface DeleteBizModel {
    // 定义删除业务模型请求参数
    bizModelId: string;
  }
  interface AddReport {
    appCode: string;
    name: string;
    parentId: string;
    code: string;
    icon: string;
    name_i18n: string;
    pcAble: boolean;
    mobileAble: boolean;
  }
  interface UpdateReport extends AddReport {
    id: string;
  }

  interface DeleteReport {
    code: string;
  }

  interface ValidBizModel {
    // 校验业务模型节点下是否存在业务数据请求参数
    bizModelId: string;
    appCode: string;
  }
  interface AppItemSortParams {
    // 应用目录排序参数
    code: string;
    sortKey: number;
    parentId: string;
  }
  interface State {
    appMenu: Array<AppMenu>;
    appMenuLoaded: boolean;
    appInfo: ItemTree;
    floders: Array<AppMenu>;
    openKeys: Array<string>;
    menuId: string;
  }
  interface AppMenu {
    // 应用目录、业务模型
    code?: string;
    id: string;
    icon: string;
    name: string;
    parentId?: string;
    type: string;
    sortKey: number;
    children?: Array<AppMenu>;
  }

  interface ExportModelParams {
    // 业务模型导出参数
    schemaCode: string;
  }

  interface CheckModelParams {
    // 业务模型校验参数
    fileName: string;
    schemaCode: string;
    coverAble: boolean;
    map?: object;
  }

  interface ImportModelParams {
    // 导入模型参数
    schemaCode: string;
    fileName: string;
    coverAble: boolean;
    parentId: string;
  }

  interface ValidateRespone {
    count: number;
    errorType: number;
    name: string;
    repeated: boolean;
    result: boolean;
    schemaCode: string;
    resultInfo: string;
  }
}
@Component({
  name: "biz-models-selector"
})
export default class bizModelsSelector extends Vue {
  @Prop() value!: string;
  @Prop() appCode!: string;
  @Prop() folderId!: string;
  @Prop({
    default: false
  })
  disabled?: boolean;
  @Prop({
    default: ""
  })
  placeholder?: string;

  // @Prop({
  //   default : ''
  // })

  @Prop({
    default: false
  })
  appManagerFilter?: boolean;

  // 是否展示选择全部模型选项
  @Prop({
    default: false
  })
  canSelectAll?: boolean;

  // 选择项：全部模型的具体定义
  @Prop() allOption?: any;

  expandCode!: string;

  searchValue = "";

  treeData: Array<treeSelector.treeItem> = [];

  allTreeData: Array<treeSelector.treeItem> | null = null;

  result: string[] = [];

  searchTask: any;

  selectModel: string = "";

  // defaultExpandedKeys:string[] = [];

  // get treeExpandedKeys(){
  //   if(this.expandCode){
  //     return [this.expandCode];
  //   }
  //   return [];
  // }

  /**
   * 异步加载数据
   */
  onLoadData(treeNode: any) {
    const vm: any = this;
    return new Promise((resolve: any) => {
      if (treeNode.loaded || treeNode.isLeaf) {
        resolve();
        return;
      }
      const { type = null, code = "" } = treeNode.dataRef || {};
      if (type === "app" && code) {
        vm.getBizModels(code).then((res: Array<treeSelector.treeItem>) => {
          vm.treeData.some((app: treeSelector.treeItem) => {
            if (app.value === code) {
              app.children = res;
              return true;
            }
            return false;
          });
          vm.treeData = [...vm.treeData];
          resolve(vm.treeData);
        });
      } else {
        resolve();
      }
    });
  }

  onTreeExpand(expandedKeys: string[]) {
    const len = expandedKeys.length;
    if (len === 0) {
      return;
    }

    const key = expandedKeys[len - 1];

    const node = this.treeData.find((n: any) => n.key === key);

    if (!node || node._loaded || node.isLeaf || !node.dataRef) {
      return;
    }

    this.getNodeChildren((node.dataRef as any).code, node);
  }

  getNodeChildren(code: string, node: any) {
    return this.getBizModels(code).then((res: any) => {
      if (Array.isArray(res)) {
        const showTypes: string[] = ["Folder", "BizModel"];
        const children = res.filter(child => {
          if (child.children) {
            child.children = child.children.filter(c =>
              showTypes.includes(c.type)
            );
          }
          return showTypes.includes(child.type);
        });

        node.children = res.filter(child => showTypes.includes(child.type));

        node._loaded = true;
        this.treeData = [...this.treeData];
        this.allTreeData = this.treeData;
        // return res;
      }
    });
  }

  /**
   * 获取应用列表
   */
  getAppList(param?: any) {
    listApi.getAllApps(param).then((res: any) => {
      if (Array.isArray(res.data)) {
        const tree: Array<treeSelector.treeItem> = res.data.map(
          (item: any) => ({
            title: item.name,
            value: item.code,
            key: `${item.code}`,
            isLeaf: false,
            selectable: false,
            children: [],
            dataRef: {
              type: "app",
              code: item.code
            }
          })
        );

        if (this.expandCode) {
          const idx = tree.findIndex((n: any) => n.key === this.expandCode);
          if (idx > -1) {
            const node = tree[idx];
            tree.splice(idx, 1);
            tree.splice(0, 0, node);

            this.getNodeChildren(node.key, node);
            // .then(()=>{
            // setTimeout(()=>{
            //   this.defaultExpandedKeys = [this.expandCode];
            // },100);

            // });
          }
        }

        this.treeData = tree;
        this.allTreeData = tree;
        // 追加展示“全部”选项
        if (this.canSelectAll) {
          this.treeData.unshift({
            ...this.allOption,
            key: this.allOption.value,
            isLeaf: true,
            selectable: true,
            dataRef: {
              type: "external"
            }
          });
        }

        // 存在默认值
        if (this.value) {
          this.setDefault();
        }
      }
    });
  }
  /**
   * 获取应用下的目录和业务模型
   */
  getBizModels(appCode: string) {
    return listApi.getAppItem({ appCode }).then((res: any) => {
      if (res.errcode !== 0) {
        this.$message.error(res.errmsg);
        return;
      }
      const child: Array<treeSelector.treeItem> = res.data.map(
        (item: any, index: number) => {
          if (item.type === "Folder") {
            let children: Array<treeSelector.treeItem> = [];
            if (item.children) {
              children = item.children.map((biz: any) => ({
                title: biz.name,
                value: `${appCode}-${item.code}-${biz.code}`,
                key: `${appCode}-${item.code}-${biz.code}`,
                isLeaf: true,
                selectable: true,
                type: biz.type
              }));
            }
            return {
              title: item.name,
              // value: item.id,
              value: `${appCode}-${item.code}`,
              key: `${appCode}-${item.code}`,
              isLeaf: false,
              selectable: false,
              children,
              type: item.type
            };
          }
          return {
            title: item.name,
            // value: item.code,
            value: `${appCode}-${item.code}`,
            key: `${appCode}-${item.code}`,
            isLeaf: true,
            selectable: true,
            children: [],
            type: item.type
          };
        }
      );
      return child;
    });
  }

  onChange(val: string) {
    this.selectModel = val;
    let code = "";
    if (!val) {
      this.$emit("change", "");
      this.$emit("select", []);
    } else {
      const theModel = this.treeData.find(res => res.key === val);

      const appsArr = val.split("-");

      this.$emit("change", appsArr[appsArr.length - 1]);
      this.$emit("select", appsArr, theModel);

      code = appsArr[0];

      const $treeSelect = this.$refs.treeSelect as Vue;

      // if ($treeSelect) {
      //   const $vcTreeSelect = $treeSelect.$refs.vcTreeSelect as any;
      //   if ($vcTreeSelect) {
      //     $vcTreeSelect.sInputValue = "";
      //   }
      // }

      this.treeData = this.allTreeData || [];

      const node = this.treeData.find((n: any) => n.key === code);

      if (!node || node._loaded) {
        return;
      }

      if (
        this.canSelectAll &&
        node.dataRef &&
        node.dataRef.type === "external"
      ) {
        this.$emit("selectAll", node); // 目前未使用到此触发方法，备用
        return;
      }

      this.getNodeChildren(code, node).then(() => {
        this.$emit("change", appsArr[appsArr.length - 1]);
        this.$emit("select", appsArr);
      });
    }
  }

  onSearch(text: string) {
    this.searchValue = text;
    // console.log(text)
    if (!text) {
      return;
    }

    clearTimeout(this.searchTask);
    this.searchTask = setTimeout(() => {
      this.doSearch(text);
    }, 500);
  }

  onFocus() {
    // debugger
    //  this.searchValue = ''
    // this.onSearch(this.searchValue);
  }

  doSearch(text: string) {
    if (text) {
      listApi
        .appSearch({
          name: text
        })
        .then((res: any) => {
          if (res.errcode !== 0) {
            // this.treeData = [];
            return;
          }

          const treeData = res.data.map((x: any) => this.convert(x));

          treeData.forEach(item => {
            const key = item.key;
            const theItemKey = this.treeData.find(i => i.key === key);
            if (theItemKey) {
              theItemKey.children = item.children;
            }
          });
          this.treeData = [...this.treeData];

          // console.log('pppp',this.allTreeData)

          // this.treeData = treeData;
        });
    } else {
      this.treeData = this.allTreeData || [];
    }
  }

  convert(item: any, parentKey?: string) {
    const key = parentKey ? `${parentKey}-${item.code}` : item.code;

    const isLeaf = item.type === "BizModel";

    const node: any = {
      title: item.name,
      value: key,
      key: key,
      isLeaf,
      selectable: isLeaf,
      scopedSlots: {
        title: "title"
      }
    };

    if (!isLeaf && Array.isArray(item.children)) {
      node.children = item.children.map((c: any) => this.convert(c, key));
    }

    return node;
  }

  filter(inputValue: string, treeNode: any) {
    // console.log(inputValue,treeNode);
    return false;
  }

  // @Watch('value')
  // onValueChange(val: string) {
  //   debugger;
  //   this.result = [val];

  // }

  /**
   * 设置默认值
   */
  setDefault() {
    if (!this.appCode) {
      return;
    }
    const treeNode = {
      loaded: false,
      isLeaf: false,
      dataRef: {
        type: "app",
        code: this.appCode
      }
    };

    this.onLoadData(treeNode).then((res: any) => {
      if (res) {
        let theApp: any;
        if (this.selectModel !== "") {
          const treeData = this.treeData;
          const key = this.selectModel.split("-")[0];
          theApp = treeData.find((d: any) => d.key === key);
        } else {
          theApp = res.filter(app => app.value === this.appCode)[0];
        }

        if (theApp) {
          // debugger
          const theKey = this.getDefaultValue(this.value, theApp.children);
          if (theKey) {
            this.result = [theKey];
          }
        }
      }
    });
    if (this.folderId) {
      this.result = [`${this.appCode}-${this.folderId}-${this.value}`];
    } else {
      this.result = [`${this.appCode}-${this.value}`];
    }
  }

  getDefaultValue(code, item) {
    let result = "";
    item.forEach(res => {
      const codes = res.key.split("-");
      const theCode = codes[codes.length - 1];
      if (code === theCode) {
        result = res.key;
      }
      if (res.children && res.children.length > 0) {
        res.children.forEach(child => {
          const childCodes = child.key.split("-");
          const theChildCode = childCodes[childCodes.length - 1];
          if (code === theChildCode) {
            result = child.key;
          }
        });
      }
    });

    return result;

    // item.forEach(res => {
    //   const codes = res.key.split('-');
    //   const theCode = codes[codes.length - 1];
    //   if (code === theCode) {
    //     result = res.key;
    //     return result;
    //   } else if ( res.children && res.children.length > 0 ) {
    //     result = this.getDefaultValue(code, res.children);
    //   }
    // });
    // return result;
  }

  created() {
    if (this.appManagerFilter) {
      const param: any = {
        filterType: "admin"
      };
      this.getAppList(param);
    } else {
      this.getAppList();
    }
  }
  mounted() {
    this.width = (this.$refs.treeSelect as any).$el.offsetWidth;
    this.onValueChange();
  }
  clearVal() {
    this.result = [];
  }
  width = 0;
  /**
   * 关联表单改变时候 初始默认值
   */

  @Watch("value")
  onValueChange() {
    if (!this.value) {
      this.result = [];
      return;
    }
    // if ( !this.folderId || !this.appCode) {

    //   return;
    // }
    this.setDefault();
  }
}
</script>
<style lang="less" scoped>
.biz-models-selector {
  width: 100%;
  max-width: 500px;
}
</style>
<style lang="less">
.biz-model-select {
  .ant-select-tree {
    margin-top: 36px;
    // padding-top: 36px;
    height: calc(100% - 36px);
    overflow: auto;
  }
}
</style>