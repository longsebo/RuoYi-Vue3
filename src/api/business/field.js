import request from '@/utils/request'

// 查询模型字段列表
export function listField(query) {
  return request({
    url: '/business/field/list',
    method: 'get',
    params: query
  })
}

// 查询模型字段详细
export function getField(ID) {
  return request({
    url: '/business/field/' + ID,
    method: 'get'
  })
}

// 新增模型字段
export function addField(data) {
  return request({
    url: '/business/field',
    method: 'post',
    data: data
  })
}

// 修改模型字段
export function updateField(data) {
  return request({
    url: '/business/field',
    method: 'put',
    data: data
  })
}

// 删除模型字段
export function delField(ID) {
  return request({
    url: '/business/field/' + ID,
    method: 'delete'
  })
}
