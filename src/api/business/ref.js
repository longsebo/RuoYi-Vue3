import request from '@/utils/request'

// 查询模型字段引用列表
export function listRef(query) {
  return request({
    url: '/business/ref/list',
    method: 'get',
    params: query
  })
}

// 查询模型字段引用详细
export function getRef(ID) {
  return request({
    url: '/business/ref/' + ID,
    method: 'get'
  })
}

// 新增模型字段引用
export function addRef(data) {
  return request({
    url: '/business/ref',
    method: 'post',
    data: data
  })
}

// 修改模型字段引用
export function updateRef(data) {
  return request({
    url: '/business/ref',
    method: 'put',
    data: data
  })
}

// 删除模型字段引用
export function delRef(ID) {
  return request({
    url: '/business/ref/' + ID,
    method: 'delete'
  })
}
