import request from '@/utils/request'

// 查询流程模型列表
export function listModel(query) {
  return request({
    url: '/flowable/model/list',
    method: 'get',
    params: query
  })
}

// 查询流程模型详细
export function getModel(modelId) {
  return request({
    url: '/flowable/model/' + modelId,
    method: 'get'
  })
}

// 新增流程模型
export function addModel(data) {
  return request({
    url: '/flowable/model',
    method: 'post',
    data: data
  })
}

// 修改流程模型
export function updateModel(data) {
  return request({
    url: '/flowable/model',
    method: 'put',
    data: data
  })
}

// 删除流程模型
export function delModel(modelId) {
  return request({
    url: '/flowable/model/' + modelId,
    method: 'delete'
  })
}
// 部署流程模型
export function depolyModel(params) {
  return request({
    url: '/flowable/model/deploy' ,
    method: 'post',
    params: params
  })
}
// 获取流程模型xml
export function getModelXml(modelId) {
  return request({
    url: '/flowable/model/getBpmnXml/' + modelId,
    method: 'get'
  })
}
// 保存(更新或插入新版本)流程模型
export function saveModel(data) {
  return request({
    url: '/flowable/model/save',
    method: 'post',
    data: data
  })
}
// 查询流程模型历史列表
export function historyList(query) {
  return request({
    url: '/flowable/model/historyList',
    method: 'get',
    params: query
  })
}
// 设置最新版
export function latestModel(params) {
  return request({
    url: '/flowable/model/latest',
    method: 'post',
    params: params
  })
}
