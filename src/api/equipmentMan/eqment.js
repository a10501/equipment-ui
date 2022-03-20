import request from '@/utils/request'

// 查询设备信息列表
export function listEqment(query) {
  return request({
    url: '/equipmentMan/eqment/list',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getEqment(id) {
  return request({
    url: '/equipmentMan/eqment/' + id,
    method: 'get'
  })
}

// 新增设备信息
export function addEqment(data) {
  return request({
    url: '/equipmentMan/eqment',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateEqment(data) {
  return request({
    url: '/equipmentMan/eqment',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delEqment(id) {
  return request({
    url: '/equipmentMan/eqment/' + id,
    method: 'delete'
  })
}
