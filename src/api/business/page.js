import request from '@/utils/request'

// 查询页面定义列表
export function listPage(query) {
  return request({
    url: '/business/page/list',
    method: 'get',
    params: query
  })
}

// 查询页面定义详细
export function getPage(id) {
  return request({
    url: '/business/page/' + id,
    method: 'get'
  })
}

// 新增页面定义
export function addPage(data) {
  return request({
    url: '/business/page',
    method: 'post',
    data: data
  })
}

// 修改页面定义
export function updatePage(data) {
  return request({
    url: '/business/page',
    method: 'put',
    data: data
  })
}

// 删除页面定义
export function delPage(id,businessCode) {
  return request({
    url: '/business/page/' + id+'/'+businessCode,
    method: 'delete'
  })
}

// 更新页面设计
export function updateDesign(data) {
  return request({
    url: '/business/page/updatedesign',
    method: 'post',
    data: data
  })
}
// 查询所有页面树列表
export function tree(query) {
  return request({
    url: '/business/page/tree',
    method: 'get',
    params: query
  })
}
