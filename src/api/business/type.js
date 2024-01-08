import request from '@/utils/request'

// 查询选项类型列表
export function listType(query) {
  return request({
    url: '/business/type/list',
    method: 'get',
    params: query
  })
}

// 查询选项类型详细
export function getType(id) {
  return request({
    url: '/business/type/' + id,
    method: 'get'
  })
}

// 新增选项类型
export function addType(data) {
  return request({
    url: '/business/type',
    method: 'post',
    data: data
  })
}

// 修改选项类型
export function updateType(data) {
  return request({
    url: '/business/type',
    method: 'put',
    data: data
  })
}

// 删除选项类型
export function delType(id) {
  return request({
    url: '/business/type/' + id,
    method: 'delete'
  })
}
