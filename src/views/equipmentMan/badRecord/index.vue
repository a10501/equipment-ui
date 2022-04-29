<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="eqmentName">
        <el-input
          v-model="queryParams.eqmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教室名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入教室名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="负责人" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修状态" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in dict.type.eq_mainte_record"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修日期">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
<!--      <el-form-item label="维修日期" prop="recordDate">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.recordDate"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          placeholder="请选择维修日期">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="申报日期" prop="recordApplyDate">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.recordApplyDate"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          placeholder="请选择申报日期">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['equipmentMan:badRecord:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['equipmentMan:badRecord:edit']"-->
<!--        >审批</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipmentMan:badRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipmentMan:badRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="badRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="维修id" align="center" prop="id" />-->
      <el-table-column label="序号" align="center" width="55">
        <template slot-scope="scope">
          {{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center" prop="eqmentName" />
      <el-table-column label="教室名称" align="center" prop="className" />
      <el-table-column label="故障说明" align="center" prop="recordStat" width="200" />
      <el-table-column label="申报日期" align="center" prop="recordApplyDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recordApplyDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="nickName"/>
      <el-table-column label="联系电话" align="center" prop="phonenumber"/>

<!--      <el-table-column label="审核状态" align="center" prop="recordExamineStatus">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.eq_handle_status" :value="scope.row.recordExamineStatus"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="维修状态" align="center" prop="recordStatus"  >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.eq_mainte_record" :value="scope.row.recordStatus"/>
        </template>
      </el-table-column>

      <el-table-column label="维修日期" align="center" prop="recordDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.recordDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="教室id" align="center" prop="classroomId" />-->


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
             v-if="scope.row.recordStatus !== '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipmentMan:badRecord:edit']"
          >审批</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipmentMan:badRecord:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改维修信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
<!--        <el-form-item label="设备名称" prop="recordName">-->
<!--          <el-input v-model="form.recordName" placeholder="请输入设备名称" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="故障说明" prop="recordStat">-->
<!--          <el-input v-model="form.recordStat" placeholder="请输入故障说明" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="负责人" prop="recordPeo">-->
<!--          <el-input v-model="form.recordPeo" placeholder="请输入申请人" />-->
<!--        </el-form-item>-->
        <el-form-item label="审核状态">
          <el-select v-model="form.recordStatus" placeholder="请选择审核状态">
            <el-option
              v-for="dict in dict.type.eq_mainte_record"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修日期" prop="recordDate" v-if="form.recordStatus == '3'">
          <el-date-picker clearable
            v-model="form.recordDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择维修日期">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="教室id" prop="classroomId">-->
<!--          <el-input v-model="form.classroomId" placeholder="请输入教室id" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="申报日期" prop="recordApplyDate">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.recordApplyDate"-->
<!--            type="date"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            placeholder="请选择申报日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBadRecord, getBadRecord, delBadRecord, addBadRecord, updateBadRecord } from "@/api/equipmentMan/badRecord";

export default {
  name: "BadRecord",
  dicts: ['eq_handle_status','eq_mainte_record'],
  data() {
    return {
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
      // 维修信息表格数据
      badRecordList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqmentName: null,
        nickName: null,
        recordStatus: null,
        className: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询维修信息列表 */
    getList() {
      this.loading = true;
      listBadRecord(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.badRecordList = response.rows;
        this.badRecordList.eqmentName = "中控台"
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        eqmentName: null,
        recordName: null,
        recordStat: null,
        recordPeo: null,
        recordStatus: '0',
        recordDate: null,
        classroomId: null,
        recordApplyDate: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加维修信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBadRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "维修审批";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBadRecord(this.form).then(response => {
              this.$modal.msgSuccess("操作成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBadRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除维修信息编号为"' + ids + '"的数据项？').then(function() {
        return delBadRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipmentMan/badRecord/export', {
        ...this.queryParams
      }, `badRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
