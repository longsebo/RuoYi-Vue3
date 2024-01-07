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
export function getFunction(ID) {
  return request({
    url: '/business/function/' + ID,
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
export function delFunction(ID) {
  return request({
    url: '/business/function/' + ID,
    method: 'delete'
  })
}
