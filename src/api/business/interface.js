import request from '@/utils/request'

// 查询接口列表
export function listInterface(query) {
  return request({
    url: '/business/interface/list',
    method: 'get',
    params: query
  })
}

// 查询接口详细
export function getInterface(id) {
  return request({
    url: '/business/interface/' + id,
    method: 'get'
  })
}

// 新增接口
export function addInterface(data) {
  return request({
    url: '/business/interface',
    method: 'post',
    data: data
  })
}

// 修改接口
export function updateInterface(data) {
  return request({
    url: '/business/interface',
    method: 'put',
    data: data
  })
}

// 删除接口
export function delInterface(id) {
  return request({
    url: '/business/interface/' + id,
    method: 'delete'
  })
}
// 非查询接口列表
export function listInterfaceAll(query) {
  return request({
    url: '/business/interface/listAll',
    method: 'get',
    params: query
  })
}
// 查询所有接口树列表
export function tree(query) {
  return request({
    url: '/business/interface/tree',
    method: 'get',
    params: query
  })
}
// 产生sql
export function generatesql(data) {
  return request({
    url: '/business/interface/generatesql',
    method: 'post',
    data: data
  })
}
/**
 * 将后台传过来的参数转换为API需要的参数
 * @param jsonParameters
 * @param parentName 父级名称
 */
export function convert2ApiJson(jsonParameters) {
  let apiJsonObj ={};
  console.log('convert2ApiJson jsonParameters:'+JSON.stringify(jsonParameters));
  for(let i=0;i<jsonParameters.length;i++){
    if(!hasSubLevels(jsonParameters[i].children)) {
      apiJsonObj[jsonParameters[i].parameterName] = jsonParameters[i].parameterValue || '';
    }else{
      apiJsonObj[jsonParameters[i].parameterName] = convert2ApiJson(jsonParameters[i].children)
    }
  }
  return apiJsonObj;
}

/**
 * 判断json是否还有下级
 * @param node
 */
export function hasSubLevels(node) {
  return typeof node === 'object' && node !== null && Object.keys(node).length > 0;
}

/**
 * 执行请求
 * @param interfaceInfo
 * @param parameters
 * @returns {*}
 */
export function doRequest(interfaceInfo,parameters) {
  if(interfaceInfo.interfaceMethod.toLowerCase === 'get') {
    return request({
      url: interfaceInfo.interfaceUrl,
      method: 'get',
      params: parameters
    })
  }else{
    return request({
      url: interfaceInfo.interfaceUrl,
      method: interfaceInfo.interfaceMethod,
      data: parameters
    })
  }
}
