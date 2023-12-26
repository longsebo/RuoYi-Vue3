import request from '@/utils/request'

// 查询流程字段定义列表
export function listDef(query) {
  return request({
    url: '/flowable/def/list',
    method: 'get',
    params: query
  })
}

// 查询流程字段定义详细
export function getDef(id) {
  return request({
    url: '/flowable/def/' + id,
    method: 'get'
  })
}

// 新增流程字段定义
export function addDef(data) {
  return request({
    url: '/flowable/def',
    method: 'post',
    data: data
  })
}

// 修改流程字段定义
export function updateDef(data) {
  return request({
    url: '/flowable/def',
    method: 'put',
    data: data
  })
}

// 删除流程字段定义
export function delDef(id) {
  return request({
    url: '/flowable/def/' + id,
    method: 'delete'
  })
}
