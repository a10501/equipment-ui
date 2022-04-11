import request from '@/utils/request'

// 查询多媒体教室数据分析列表
export function listDatamanage(query) {
  return request({
    url: '/equipmentMan/datamanage/list',
    method: 'get',
    params: query
  })
}

// 查询多媒体教室数据分析详细
export function getDatamanage(id) {
  return request({
    url: '/equipmentMan/datamanage/' + id,
    method: 'get'
  })
}

// 新增多媒体教室数据分析
export function addDatamanage(data) {
  return request({
    url: '/equipmentMan/datamanage',
    method: 'post',
    data: data
  })
}

// 修改多媒体教室数据分析
export function updateDatamanage(data) {
  return request({
    url: '/equipmentMan/datamanage',
    method: 'put',
    data: data
  })
}

// 删除多媒体教室数据分析
export function delDatamanage(id) {
  return request({
    url: '/equipmentMan/datamanage/' + id,
    method: 'delete'
  })
}
