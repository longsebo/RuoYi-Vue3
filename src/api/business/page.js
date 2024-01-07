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
export function getPage(ID) {
  return request({
    url: '/business/page/' + ID,
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
export function delPage(ID) {
  return request({
    url: '/business/page/' + ID,
    method: 'delete'
  })
}
