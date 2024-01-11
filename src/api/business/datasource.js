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
export function getDatasource(id) {
  return request({
    url: '/business/datasource/' + id,
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
export function delDatasource(id) {
  return request({
    url: '/business/datasource/' + id,
    method: 'delete'
  })
}
// 测试连接
export function checkConnect(id) {
  return request({
    url: '/business/datasource/checkconnect/' + id,
    method: 'get'
  })
}
