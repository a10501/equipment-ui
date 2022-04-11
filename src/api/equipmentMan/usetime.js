import request from '@/utils/request'

// 查询用户时长分析列表
export function listUsetime(query) {
  return request({
    url: '/equipmentMan/usetime/list',
    method: 'get',
    params: query
  })
}

// 查询时长分析详细
export function getUsetime(id) {
  return request({
    url: '/equipmentMan/usetime/' + id,
    method: 'get'
  })
}

