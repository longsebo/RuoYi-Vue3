import request from '@/utils/request'

// 查询功能侦听列表
export function listListening(query) {
  return request({
    url: '/business/listening/list',
    method: 'get',
    params: query
  })
}

// 查询功能侦听详细
export function getListening(id) {
  return request({
    url: '/business/listening/' + id,
    method: 'get'
  })
}

// 新增功能侦听
export function addListening(data) {
  return request({
    url: '/business/listening',
    method: 'post',
    data: data
  })
}

// 修改功能侦听
export function updateListening(data) {
  return request({
    url: '/business/listening',
    method: 'put',
    data: data
  })
}

// 删除功能侦听
export function delListening(id) {
  return request({
    url: '/business/listening/' + id,
    method: 'delete'
  })
}
