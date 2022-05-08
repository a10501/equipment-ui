<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="申请人id" prop="bookingPeo">
        <el-input
          v-model="queryParams.bookingPeo"
          placeholder="请输入申请人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="bookingStatus">
        <el-select v-model="queryParams.bookingStatus" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in dict.type.eq_handle_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预约日期">
        <el-date-picker
          v-model="daterangeBookingDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="教室id" prop="classroomId">
        <el-input
          v-model="queryParams.classroomId"
          placeholder="请输入教室id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请日期" prop="bookingApplyDate">
        <el-date-picker clearable
          v-model="queryParams.bookingApplyDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择申请日期">
        </el-date-picker>
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipmentMan:booking:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipmentMan:booking:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipmentMan:booking:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipmentMan:booking:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bookingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="预约id" align="center" prop="id" />
      <el-table-column label="预约编号" align="center" prop="bookingName" />
      <el-table-column label="申请人id" align="center" prop="bookingPeo" />
      <el-table-column label="审核状态" align="center" prop="bookingStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.eq_handle_status" :value="scope.row.bookingStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="预约日期" align="center" prop="bookingDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bookingDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教室id" align="center" prop="classroomId" />
      <el-table-column label="申请日期" align="center" prop="bookingApplyDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bookingApplyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipmentMan:booking:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipmentMan:booking:remove']"
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

    <!-- 添加或修改预约信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="预约编号" prop="bookingName">
          <el-input v-model="form.bookingName" placeholder="请输入预约编号" />
        </el-form-item>
        <el-form-item label="申请人id" prop="bookingPeo">
          <el-input v-model="form.bookingPeo" placeholder="请输入申请人id" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.bookingStatus">
            <el-radio
              v-for="dict in dict.type.eq_handle_status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预约日期" prop="bookingDate">
          <el-date-picker clearable
            v-model="form.bookingDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择预约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="教室id" prop="classroomId">
          <el-input v-model="form.classroomId" placeholder="请输入教室id" />
        </el-form-item>
        <el-form-item label="申请日期" prop="bookingApplyDate">
          <el-date-picker clearable
            v-model="form.bookingApplyDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择申请日期">
          </el-date-picker>
        </el-form-item>
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
import { listBooking, getBooking, delBooking, addBooking, updateBooking } from "@/api/equipmentMan/booking";

export default {
  name: "Booking",
  dicts: ['eq_handle_status'],
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
      // 预约信息表格数据
      bookingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 备注时间范围
      daterangeBookingDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bookingPeo: null,
        bookingStatus: null,
        bookingDate: null,
        classroomId: null,
        bookingApplyDate: null,
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
    /** 查询预约信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeBookingDate && '' != this.daterangeBookingDate) {
        this.queryParams.params["beginBookingDate"] = this.daterangeBookingDate[0];
        this.queryParams.params["endBookingDate"] = this.daterangeBookingDate[1];
      }
      listBooking(this.queryParams).then(response => {
        this.bookingList = response.rows;
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
        bookingName: null,
        bookingPeo: null,
        bookingStatus: "0",
        bookingDate: null,
        classroomId: null,
        bookingApplyDate: null,
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
      this.daterangeBookingDate = [];
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
      this.title = "添加预约信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBooking(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改预约信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBooking(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBooking(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除预约信息编号为"' + ids + '"的数据项？').then(function() {
        return delBooking(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipmentMan/booking/export', {
        ...this.queryParams
      }, `booking_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
