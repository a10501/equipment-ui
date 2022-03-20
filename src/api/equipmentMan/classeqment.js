import request from '@/utils/request'

// 查询设备和教室关联列表
export function listClasseqment(query) {
  return request({
    url: '/equipmentMan/classeqment/list',
    method: 'get',
    params: query
  })
}

// 查询设备和教室关联详细
export function getClasseqment(eqmentId) {
  return request({
    url: '/equipmentMan/classeqment/' + eqmentId,
    method: 'get'
  })
}

// 新增设备和教室关联
export function addClasseqment(data) {
  return request({
    url: '/equipmentMan/classeqment',
    method: 'post',
    data: data
  })
}

// 修改设备和教室关联
export function updateClasseqment(data) {
  return request({
    url: '/equipmentMan/classeqment',
    method: 'put',
    data: data
  })
}

// 删除设备和教室关联
export function delClasseqment(eqmentId) {
  return request({
    url: '/equipmentMan/classeqment/' + eqmentId,
    method: 'delete'
  })
}
