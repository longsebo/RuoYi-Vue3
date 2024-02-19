import request from '@/utils/request'

// 查询页面接口关系列表
export function listInterface(query) {
  return request({
    url: '/business/pageInterface/list',
    method: 'get',
    params: query
  })
}

// 查询页面接口关系详细
export function getInterface(id) {
  return request({
    url: '/business/pageInterface/' + id,
    method: 'get'
  })
}

// 新增页面接口关系
export function addInterface(data) {
  return request({
    url: '/business/pageInterface',
    method: 'post',
    data: data
  })
}

// 修改页面接口关系
export function updateInterface(data) {
  return request({
    url: '/business/pageInterface',
    method: 'put',
    data: data
  })
}

// 删除页面接口关系
export function delInterface(id) {
  return request({
    url: '/business/pageInterface/' + id,
    method: 'delete'
  })
}
