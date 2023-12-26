import request from '@/utils/request'

// 查询流程字段引用关系列表
export function listRef(query) {
  return request({
    url: '/flowable/ref/list',
    method: 'get',
    params: query
  })
}

// 查询流程字段引用关系详细
export function getRef(id) {
  return request({
    url: '/flowable/ref/' + id,
    method: 'get'
  })
}

// 新增流程字段引用关系
export function addRef(data) {
  return request({
    url: '/flowable/ref',
    method: 'post',
    data: data
  })
}

// 修改流程字段引用关系
export function updateRef(data) {
  return request({
    url: '/flowable/ref',
    method: 'put',
    data: data
  })
}

// 删除流程字段引用关系
export function delRef(id) {
  return request({
    url: '/flowable/ref/' + id,
    method: 'delete'
  })
}
