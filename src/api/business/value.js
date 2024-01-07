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
export function getValue(ID) {
  return request({
    url: '/business/value/' + ID,
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
export function delValue(ID) {
  return request({
    url: '/business/value/' + ID,
    method: 'delete'
  })
}
