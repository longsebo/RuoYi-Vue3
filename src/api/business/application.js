import request from '@/utils/request'

// 查询应用定义列表
export function listApplication(query) {
  return request({
    url: '/business/application/list',
    method: 'get',
    params: query
  })
}

// 查询应用定义详细
export function getApplication(ID) {
  return request({
    url: '/business/application/' + ID,
    method: 'get'
  })
}

// 新增应用定义
export function addApplication(data) {
  return request({
    url: '/business/application',
    method: 'post',
    data: data
  })
}

// 修改应用定义
export function updateApplication(data) {
  return request({
    url: '/business/application',
    method: 'put',
    data: data
  })
}

// 删除应用定义
export function delApplication(ID) {
  return request({
    url: '/business/application/' + ID,
    method: 'delete'
  })
}
