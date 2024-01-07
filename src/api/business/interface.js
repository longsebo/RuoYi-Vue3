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
export function getInterface(ID) {
  return request({
    url: '/business/interface/' + ID,
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
export function delInterface(ID) {
  return request({
    url: '/business/interface/' + ID,
    method: 'delete'
  })
}
