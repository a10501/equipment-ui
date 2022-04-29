<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名称" prop="dataUseName"  v-if="columnShow.dataUseName">
        <el-input
          v-model="queryParams.dataUseName"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="教室名称" prop="dataName" v-if="columnShow.dataName">
          <el-input
            v-model="queryParams.dataName"
            placeholder="请输入教室名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      <el-form-item label="楼栋名称" prop="dataName" v-if="columnShow.dataLocName">
        <el-input
          v-model="queryParams.dataLocName"
          placeholder="请输入教室名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="handleGetList"
                >用户使用时长统计</el-button>
              </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleGetDataNameTime"
        >教室使用时长统计</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleGetDataLocation"
        >楼栋使用时长统计</el-button>
      </el-col>
      <el-col :span="1.5">
                <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExport"
                  v-hasPermi="['equipmentMan:usetime:export']"
                >导出</el-button>
              </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="usetimeList">
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="时长分析id" align="center" prop="id" />-->
      <el-table-column label="序号" align="center" width="100">
        <template slot-scope="scope">
          {{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index +1}}
        </template>
      </el-table-column>
      <el-table-column label="教室名称" align="center" prop="dataName" width="220" v-if="columnShow.dataName"/>
      <el-table-column label="用户" align="center" prop="dataUseName" width="220" v-if="columnShow.dataUseName" />
      <el-table-column label="楼栋名称" align="center" prop="dataLocName" width="220" v-if="columnShow.dataLocName"/>
      <el-table-column label="时长" align="center" prop="dataUseTime" width="220"/> >

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


  </div>
</template>

<script>
import {
  listUsetime
} from "@/api/equipmentMan/usetime";

export default {
  name: "Usetime",
  data() {
    return {
      columnShow: {
        dataName: false,
        dataUseName: true,
        dataLocName: false
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 时长分析表格数据
      usetimeList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dataUseName: null,
        dataName:null,
        dataLocName: null,
        flag:1
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询时长分析列表 */
    getList() {
      this.loading = true;
      listUsetime(this.queryParams).then(response => {
        this.usetimeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleGetList(){
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.queryParams.flag = 1;
      this.columnShow.dataUseName = true;
      this.columnShow.dataName = false;
      this.columnShow.dataLocName = false;
      this.resetForm("queryForm");
      this.getList();
    },
    handleGetDataNameTime(){
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.queryParams.flag = 2;
      this.columnShow.dataName = true;
      this.columnShow.dataUseName = false;
      this.columnShow.dataLocName = false;
      this.resetForm("queryForm");
      this.getList();
    },
    handleGetDataLocation(){
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.queryParams.flag = 3;
      this.columnShow.dataName = false;
      this.columnShow.dataLocName = true;
      this.columnShow.dataUseName = false;
      this.resetForm("queryForm");
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipmentMan/usetime/export', {
        ...this.queryParams
      }, `usetime_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
