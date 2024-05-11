import request from '@/utils/request'

// 查询接口列表
export function listInterface(query) {
  return request({
    url: '/business/interface/list',
    method: 'get',
    params: query
  })
}

// 查询接口详细
export function getInterface(id) {
  return request({
    url: '/business/interface/' + id,
    method: 'get'
  })
}

// 新增接口
export function addInterface(data) {
  return request({
    url: '/business/interface',
    method: 'post',
    data: data
  })
}

// 修改接口
export function updateInterface(data) {
  return request({
    url: '/business/interface',
    method: 'put',
    data: data
  })
}

// 删除接口
export function delInterface(id) {
  return request({
    url: '/business/interface/' + id,
    method: 'delete'
  })
}
// 非查询接口列表
export function listInterfaceAll(query) {
  return request({
    url: '/business/interface/listAll',
    method: 'get',
    params: query
  })
}
// 查询所有接口树列表
export function tree(query) {
  return request({
    url: '/business/interface/tree',
    method: 'get',
    params: query
  })
}
// 产生sql
export function generatesql(data) {
  return request({
    url: '/business/generatesql',
    method: 'post',
    data: data
  })
}
