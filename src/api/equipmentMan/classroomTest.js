import request from '@/utils/request'

// 查询教室信息测试列表
export function listClassroomTest(query) {
  return request({
    url: '/equipmentMan/classroomTest/list',
    method: 'get',
    params: query
  })
}

// 查询教室信息测试详细
export function getClassroomTest(id) {
  return request({
    url: '/equipmentMan/classroomTest/' + id,
    method: 'get'
  })
}

// 新增教室信息测试
export function addClassroomTest(data) {
  return request({
    url: '/equipmentMan/classroomTest',
    method: 'post',
    data: data
  })
}

// 修改教室信息测试
export function updateClassroomTest(data) {
  return request({
    url: '/equipmentMan/classroomTest',
    method: 'put',
    data: data
  })
}

// 删除教室信息测试
export function delClassroomTest(id) {
  return request({
    url: '/equipmentMan/classroomTest/' + id,
    method: 'delete'
  })
}
