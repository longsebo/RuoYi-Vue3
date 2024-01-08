import request from '@/utils/request'

// 查询MQ配置定义列表
export function listConf(query) {
  return request({
    url: '/business/conf/list',
    method: 'get',
    params: query
  })
}

// 查询MQ配置定义详细
export function getConf(id) {
  return request({
    url: '/business/conf/' + id,
    method: 'get'
  })
}

// 新增MQ配置定义
export function addConf(data) {
  return request({
    url: '/business/conf',
    method: 'post',
    data: data
  })
}

// 修改MQ配置定义
export function updateConf(data) {
  return request({
    url: '/business/conf',
    method: 'put',
    data: data
  })
}

// 删除MQ配置定义
export function delConf(id) {
  return request({
    url: '/business/conf/' + id,
    method: 'delete'
  })
}
