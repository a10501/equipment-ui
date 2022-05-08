import request from '@/utils/request'

// 查询预约信息列表
export function listBooking(query) {
  return request({
    url: '/equipmentMan/booking/list',
    method: 'get',
    params: query
  })
}

// 查询预约信息详细
export function getBooking(id) {
  return request({
    url: '/equipmentMan/booking/' + id,
    method: 'get'
  })
}

// 新增预约信息
export function addBooking(data) {
  return request({
    url: '/equipmentMan/booking',
    method: 'post',
    data: data
  })
}

// 修改预约信息
export function updateBooking(data) {
  return request({
    url: '/equipmentMan/booking',
    method: 'put',
    data: data
  })
}

// 删除预约信息
export function delBooking(id) {
  return request({
    url: '/equipmentMan/booking/' + id,
    method: 'delete'
  })
}
