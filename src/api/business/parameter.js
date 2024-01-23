import request from '@/utils/request'

// 查询接口参数列表
export function listParameter(query) {
  return request({
    url: '/business/parameter/list',
    method: 'get',
    params: query
  })
}

// 查询接口参数详细
export function getParameter(id) {
  return request({
    url: '/business/parameter/' + id,
    method: 'get'
  })
}

// 新增接口参数
export function addParameter(data) {
  return request({
    url: '/business/parameter',
    method: 'post',
    data: data
  })
}

// 修改接口参数
export function updateParameter(data) {
  return request({
    url: '/business/parameter',
    method: 'put',
    data: data
  })
}

// 删除接口参数
export function delParameter(id) {
  return request({
    url: '/business/parameter/' + id,
    method: 'delete'
  })
}
//查询参数树
export function parameterTreeSelect(query){
  return request({
    url: '/business/parameter/tree',
    method: 'post',
    data:query
  })
}
