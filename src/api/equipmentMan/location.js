import request from '@/utils/request'

// 查询多媒体分布信息列表
export function listLocation(query) {
  return request({
    url: '/equipmentMan/location/list',
    method: 'get',
    params: query
  })
}

// 查询多媒体分布信息详细
export function getLocation(id) {
  return request({
    url: '/equipmentMan/location/' + id,
    method: 'get'
  })
}

// 新增多媒体分布信息
export function addLocation(data) {
  return request({
    url: '/equipmentMan/location',
    method: 'post',
    data: data,
    contentType: false
  })
}

// 修改多媒体分布信息
export function updateLocation(data) {
  return request({
    url: '/equipmentMan/location',
    method: 'put',
    data: data
  })
}

// 删除多媒体分布信息
export function delLocation(id) {
  return request({
    url: '/equipmentMan/location/' + id,
    method: 'delete'
  })
}

// 下载文件
export function downloadFile(id) {
  return request({
    url: '/equipmentMan/location/downloadFile/' + id ,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    responseType: 'blob'
  })
}
