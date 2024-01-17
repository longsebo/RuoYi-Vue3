import request from '@/utils/request'

// 查询业务功能列表
export function listFunction(query) {
  return request({
    url: '/business/function/list',
    method: 'get',
    params: query
  })
}

// 查询业务功能详细
export function getFunction(id) {
  return request({
    url: '/business/function/' + id,
    method: 'get'
  })
}

// 新增业务功能
export function addFunction(data) {
  return request({
    url: '/business/function',
    method: 'post',
    data: data
  })
}

// 修改业务功能
export function updateFunction(data) {
  return request({
    url: '/business/function',
    method: 'put',
    data: data
  })
}

// 删除业务功能
export function delFunction(id) {
  return request({
    url: '/business/function/' + id,
    method: 'delete'
  })
}
//查询业务树
export function functionTreeSelect(query){
  return request({
    url: '/business/function/tree',
    method: 'post',
    data:query
  })
}
//判断功能节点是否为末级
export function isLastLevel(query){
  return request({
    url: '/business/function/isLastLevel',
    method: 'post',
    data:query
  })
}
