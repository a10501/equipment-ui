import request from '@/utils/request'

// 查询设备报修信息列表
export function listBadinfo(query) {
  return request({
    url: '/equipmentMan/badinfo/list',
    method: 'get',
    params: query
  })
}

// 查询设备报修信息详细
export function getBadinfo(id) {
  return request({
    url: '/equipmentMan/badinfo/' + id,
    method: 'get'
  })
}

// 新增设备报修信息
export function addBadinfo(data) {
  return request({
    url: '/equipmentMan/badinfo',
    method: 'post',
    data: data
  })
}

// 修改设备报修信息
export function updateBadinfo(data) {
  return request({
    url: '/equipmentMan/badinfo',
    method: 'put',
    data: data
  })
}

// 删除设备报修信息
export function delBadinfo(id) {
  return request({
    url: '/equipmentMan/badinfo/' + id,
    method: 'delete'
  })
}
