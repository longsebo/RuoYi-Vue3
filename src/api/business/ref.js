import request from '@/utils/request'

// 查询模型字段引用列表
export function listRef(query) {
  return request({
    url: '/business/modelFieldRef/list',
    method: 'get',
    params: query
  })
}

// 查询模型字段引用详细
export function getRef(id) {
  return request({
    url: '/business/modelFieldRef/' + id,
    method: 'get'
  })
}

// 新增模型字段引用
export function addRef(data) {
  return request({
    url: '/business/modelFieldRef',
    method: 'post',
    data: data
  })
}

// 修改模型字段引用
export function updateRef(data) {
  return request({
    url: '/business/modelFieldRef',
    method: 'put',
    data: data
  })
}

// 删除模型字段引用
export function delRef(id) {
  return request({
    url: '/business/modelFieldRef/' + id,
    method: 'delete'
  })
}
// 查询模型引用字段列表非翻页
export function listFieldNoPage(query) {
  return request({
    url: '/business/modelFieldRef/listnopage',
    method: 'get',
    params: query
  })
}
