import request from '@/utils/request'

// 查询建模页面绑定列表
export function listPage(query) {
  return request({
    url: '/flowable/page/list',
    method: 'get',
    params: query
  })
}

// 查询建模页面绑定详细
export function getPage(id) {
  return request({
    url: '/flowable/page/' + id,
    method: 'get'
  })
}

//建模页面绑定
export function bindPage(data) {
  return request({
    url: '/flowable/page/bind',
    method: 'put',
    data: data
  })
}


// 删除建模页面绑定
export function delPage(id) {
  return request({
    url: '/flowable/page/' + id,
    method: 'delete'
  })
}
// 查询绑定表单(单页面)
export function findPage(params) {
  return request({
    url: `/flowable/page/findPage`,
    method: 'post',
    data:params
  })
}

// 查询绑定表单(模块，流程标识下一组页面)
export function findModulePages(params) {
  return request({
    url: `/flowable/page/findModulePage`,
    method: 'post',
    data:params
  })
}
