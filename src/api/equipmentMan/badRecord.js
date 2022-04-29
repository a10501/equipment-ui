import request from '@/utils/request'

// 查询维修信息列表
export function listBadRecord(query) {
  return request({
    url: '/equipmentMan/badRecord/list',
    method: 'get',
    params: query
  })
}

// 查询维修信息详细
export function getBadRecord(id) {
  return request({
    url: '/equipmentMan/badRecord/' + id,
    method: 'get'
  })
}

// 新增维修信息
export function addBadRecord(data) {
  return request({
    url: '/equipmentMan/badRecord',
    method: 'post',
    data: data
  })
}

// 修改维修信息
export function updateBadRecord(data) {
  return request({
    url: '/equipmentMan/badRecord',
    method: 'put',
    data: data
  })
}

// 删除维修信息
export function delBadRecord(id) {
  return request({
    url: '/equipmentMan/badRecord/' + id,
    method: 'delete'
  })
}
