<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import {labelText} from "@cloudpivot/form/src/schema/system-data-item-codes"
import HLabel from "@cloudpivot/form/src/common/components/label.vue"

@Component({
  name: 'SheetStatistic',
  components: {
    HLabel:HLabel
  }
})
export default class SheetStatistic extends Vue {
  @Prop()
  control!:any // 当前控件的控制器
  render(h:Function) {
    return h('h-label', {props:{ control: this.control
    }, style:{"justifyContent":"center"}})
  }
}
</script>