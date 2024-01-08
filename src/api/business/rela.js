import request from '@/utils/request'

// 查询业务功能接口关系列表
export function listRela(query) {
  return request({
    url: '/business/rela/list',
    method: 'get',
    params: query
  })
}

// 查询业务功能接口关系详细
export function getRela(id) {
  return request({
    url: '/business/rela/' + id,
    method: 'get'
  })
}

// 新增业务功能接口关系
export function addRela(data) {
  return request({
    url: '/business/rela',
    method: 'post',
    data: data
  })
}

// 修改业务功能接口关系
export function updateRela(data) {
  return request({
    url: '/business/rela',
    method: 'put',
    data: data
  })
}

// 删除业务功能接口关系
export function delRela(id) {
  return request({
    url: '/business/rela/' + id,
    method: 'delete'
  })
}
