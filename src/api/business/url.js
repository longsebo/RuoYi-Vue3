import request from '@/utils/request'

// 查询通用URL列表
export function listUrl(query) {
  return request({
    url: '/business/url/list',
    method: 'get',
    params: query
  })
}

// 查询通用URL详细
export function getUrl(ID) {
  return request({
    url: '/business/url/' + ID,
    method: 'get'
  })
}

// 新增通用URL
export function addUrl(data) {
  return request({
    url: '/business/url',
    method: 'post',
    data: data
  })
}

// 修改通用URL
export function updateUrl(data) {
  return request({
    url: '/business/url',
    method: 'put',
    data: data
  })
}

// 删除通用URL
export function delUrl(ID) {
  return request({
    url: '/business/url/' + ID,
    method: 'delete'
  })
}
