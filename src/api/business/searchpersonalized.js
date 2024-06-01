import request from '@/utils/request'

// 查询查询个性化列表
export function listSearchPersonalized(query) {
  return request({
    url: '/business/personalized/list',
    method: 'get',
    params: query
  })
}

// 查询查询个性化详细
export function getSearchPersonalized(id) {
  return request({
    url: '/business/personalized/' + id,
    method: 'get'
  })
}

// 新增查询个性化
export function addSearchPersonalized(data) {
  return request({
    url: '/business/personalized',
    method: 'post',
    data: data
  })
}

// 修改查询个性化
export function updateSearchPersonalized(data) {
  return request({
    url: '/business/personalized',
    method: 'put',
    data: data
  })
}

// 删除查询个性化
export function delSearchPersonalized(id) {
  return request({
    url: '/business/personalized/' + id,
    method: 'delete'
  })
}
