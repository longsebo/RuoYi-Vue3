import request from '@/utils/request'

// 查询流程部署列表
export function listDeploy(query) {
  return request({
    url: '/flowable/deploy/list',
    method: 'get',
    params: query
  })
}

// 查询流程部署详细
export function getDeploy(definitionId) {
  return request({
    url: '/flowable/deploy/' + definitionId,
    method: 'get'
  })
}

// 查询流程部署版本列表
export function publishList(query) {
  return request({
    url: '/flowable/deploy/publishList',
    method: 'get',
    params: query
  })
}

// 修改状态
export function changeState(params) {
  return request({
    url: '/flowable/deploy/changeState',
    method: 'put',
    params: params
  })
}

// 删除流程部署
export function delDeploy(definitionId) {
  return request({
    url: '/flowable/deploy/' + definitionId,
    method: 'delete'
  })
}
// 获取流程模型流程图
export function getBpmnXml(definitionId) {
  return request({
    url: '/flowable/deploy/bpmnXml/' + definitionId,
    method: 'get'
  })
}
