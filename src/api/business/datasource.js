import request from '@/utils/request'

// 查询数据源定义列表
export function listDatasource(query) {
  return request({
    url: '/business/datasource/list',
    method: 'get',
    params: query
  })
}

// 查询数据源定义详细
export function getDatasource(ID) {
  return request({
    url: '/business/datasource/' + ID,
    method: 'get'
  })
}

// 新增数据源定义
export function addDatasource(data) {
  return request({
    url: '/business/datasource',
    method: 'post',
    data: data
  })
}

// 修改数据源定义
export function updateDatasource(data) {
  return request({
    url: '/business/datasource',
    method: 'put',
    data: data
  })
}

// 删除数据源定义
export function delDatasource(ID) {
  return request({
    url: '/business/datasource/' + ID,
    method: 'delete'
  })
}
