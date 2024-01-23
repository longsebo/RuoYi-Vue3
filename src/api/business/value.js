import request from '@/utils/request'

// 查询接口返回值列表
export function listValue(query) {
  return request({
    url: '/business/value/list',
    method: 'get',
    params: query
  })
}

// 查询接口返回值详细
export function getValue(id) {
  return request({
    url: '/business/value/' + id,
    method: 'get'
  })
}

// 新增接口返回值
export function addValue(data) {
  return request({
    url: '/business/value',
    method: 'post',
    data: data
  })
}

// 修改接口返回值
export function updateValue(data) {
  return request({
    url: '/business/value',
    method: 'put',
    data: data
  })
}

// 删除接口返回值
export function delValue(id) {
  return request({
    url: '/business/value/' + id,
    method: 'delete'
  })
}
//查询返回值树
export function returnValTreeSelect(query){
  return request({
    url: '/business/value/tree',
    method: 'post',
    data:query
  })
}
