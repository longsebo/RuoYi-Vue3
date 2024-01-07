import request from '@/utils/request'

// 查询模型定义列表
export function listDef(query) {
  return request({
    url: '/business/def/list',
    method: 'get',
    params: query
  })
}

// 查询模型定义详细
export function getDef(ID) {
  return request({
    url: '/business/def/' + ID,
    method: 'get'
  })
}

// 新增模型定义
export function addDef(data) {
  return request({
    url: '/business/def',
    method: 'post',
    data: data
  })
}

// 修改模型定义
export function updateDef(data) {
  return request({
    url: '/business/def',
    method: 'put',
    data: data
  })
}

// 删除模型定义
export function delDef(ID) {
  return request({
    url: '/business/def/' + ID,
    method: 'delete'
  })
}
