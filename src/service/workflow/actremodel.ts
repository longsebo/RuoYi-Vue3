import * as actReModelApi from "@/api/flowable/model";
import { ElMessage } from "element-plus";
import { ref, Ref } from "vue";


export function useActReModelApi(loading: Ref<boolean>) {
  const actReModel = ref<ActReModel>()

  async function findModel(id: string) {
    try {
      loading && (loading.value = true)
      let temp = await actReModelApi.getModel(id);
      actReModel.value = temp.data
      console.log('actReModel.value111:'+JSON.stringify(actReModel))
    } catch (e) {
      console.error(e);
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      loading && (loading.value = false)
    }
  }


  return {
    actReModel, findModel
  }
}
