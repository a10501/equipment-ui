<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="badinfoName">
        <el-input
          v-model="queryParams.badinfoName"
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
      <el-form-item label="申请人" prop="badinfoPeo">
        <el-input
          v-model="queryParams.badinfoPeo"
          placeholder="请输入申请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="badinfoStatus">
        <el-select v-model="queryParams.badinfoStatus" placeholder="请选择审核状态" >
          <el-option
            v-for="dict in dict.type.eq_handle_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申报日期">
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
<!--          v-hasPermi="['equipmentMan:badinfo:add']"-->
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
<!--          v-hasPermi="['equipmentMan:badinfo:edit']"-->
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
          v-hasPermi="['equipmentMan:badinfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipmentMan:badinfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="badinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="设备报修id" align="center" prop="id" v-if="id" />-->
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum-1)*queryParams.pageSize+scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center" prop="badinfoName" />
      <el-table-column label="故障说明" align="center" prop="badinfoStat" />
      <el-table-column label="申请人" align="center" prop="badinfoPeo" />
      <el-table-column label="审核状态" align="center" prop="badinfoStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.eq_handle_status" :value="scope.row.badinfoStatus"/>
        </template>
      </el-table-column>
<!--      <el-table-column label="教室" align="center" prop="classroomId" >-->
<!--      <template slot-scope="scope">-->
<!--        <dict-tag :options="dict.type.test_classroom" :value="scope.row.classroomId"/>-->
<!--      </template>-->
<!--      </el-table-column>-->
      <el-table-column label="教室" align="center" prop="className" >
      </el-table-column>
      <el-table-column label="申报日期" align="center" prop="badinfoDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.badinfoDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.badinfoStatus !== '2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipmentMan:badinfo:edit']"
          >审批</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipmentMan:badinfo:remove']"
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

    <!-- 添加或修改设备报修信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
<!--        <el-form-item label="设备名称" prop="badinfoName">-->
<!--          <el-input v-model="form.badinfoName" placeholder="请输入设备名称" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="故障说明" prop="badinfoStat">-->
<!--          <el-input v-model="form.badinfoStat" placeholder="请输入故障说明" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="教室" prop="className">-->
<!--          <el-autocomplete ref='autocomplete'-->
<!--                           class="inline-input"-->
<!--                           v-model="form.className"-->
<!--                           :fetch-suggestions="querySearchAsync"-->
<!--                           placeholder="请输入教室名称"-->
<!--                           @select="handleSelect"-->

<!--          ></el-autocomplete>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="申请人" prop="badinfoPeo">-->
<!--          <el-input v-model="form.badinfoPeo" placeholder="请输入申请人" />-->
<!--        </el-form-item>-->
        <el-form-item  label="审核状态" prop="badinfoStatus" v-hasPermi="['equipmentMan:badinfo:edit']">
          <el-select v-model="form.badinfoStatus" placeholder="请选择审核状态">
            <el-option
              v-for="dict in dict.type.eq_handle_status"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="申报日期" prop="badinfoDate">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.badinfoDate"-->
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
import { listBadinfo, getBadinfo, delBadinfo, addBadinfo, updateBadinfo } from "@/api/equipmentMan/badinfo";
import {listClassroom} from "@/api/equipmentMan/classroom";

export default {
  name: "Badinfo",
  dicts: ['eq_handle_status','test_classroom'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      // 日期范围
      dateRange: [],
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备报修信息表格数据
      badinfoList: [],
      restaurants: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        badinfoName: null,
        badinfoPeo: null,
        badinfoStatus: null,
        className: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        badinfoName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        badinfoStat: [
          { required: true, message: "故障说明不能为空", trigger: "blur" }
        ],
        classroomId: [
          { required: true, message: "教室id不能为空", trigger: "change" }
        ],
        badinfoDate: [
          { required: true, message: "申报日期不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.loadAll();
  },
  methods: {
    /** 查询设备报修信息列表 */
    getList() {
      this.loading = true;
      listBadinfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.badinfoList = response.rows;
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
        badinfoName: null,
        badinfoStat: null,
        badinfoPeo: null,
        badinfoStatus: '0',
        classroomId: null,
        eqmentId: null,
        badinfoDate: null,
        remark: null
      };
      this.resetForm("form");
    },
    //获取教室信息
    loadAll() {
      listClassroom().then(response =>{
        if(response.code === 200 && response.total > 0 ){
          this.restaurants = response.rows
          return this.restaurants;
        }
      })
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
  //input输入框建议数据处理
  querySearchAsync(queryString, cb) {
    var restaurants = this.restaurants;
    // 解决element建议搜索框无法显示内容 的数据处理
    for (var i = 0; i < restaurants.length; i++) {
      restaurants[i].value = restaurants[i].className;
    }
    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

    cb(results);
  },
  createStateFilter(queryString) {
    return (state) => {
      return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  },
  handleSelect(item) {

    this.form.className = item.className;
    this.form.classroomId = item.id;
  },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备报修信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBadinfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "审批报修申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBadinfo(this.form).then(response => {
              this.$modal.msgSuccess("审批成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBadinfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除设备报修信息编号为"' + ids + '"的数据项？').then(function() {
        return delBadinfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipmentMan/badinfo/export', {
        ...this.queryParams
      }, `badinfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
