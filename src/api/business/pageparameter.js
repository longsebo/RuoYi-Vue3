import request from '@/utils/request'

// 查询页面参数列表
export function listParameter(query) {
  return request({
    url: '/business/pageparameter/list',
    method: 'get',
    params: query
  })
}

// 查询页面参数详细
export function getParameter(id) {
  return request({
    url: '/business/pageparameter/' + id,
    method: 'get'
  })
}

// 新增页面参数
export function addParameter(data) {
  return request({
    url: '/business/pageparameter',
    method: 'post',
    data: data
  })
}

// 修改页面参数
export function updateParameter(data) {
  return request({
    url: '/business/pageparameter',
    method: 'put',
    data: data
  })
}

// 删除页面参数
export function delParameter(id) {
  return request({
    url: '/business/pageparameter/' + id,
    method: 'delete'
  })
}
// 查询所有页面参数列表
export function listParameterAll(query) {
  return request({
    url: '/business/pageparameter/listAll',
    method: 'get',
    params: query
  })
}
