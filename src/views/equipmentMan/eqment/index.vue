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
      <el-form-item label="状态" prop="eqmentStatus">
        <el-select v-model="queryParams.eqmentStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.eq_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型" prop="eqmentType">
        <el-select v-model="queryParams.eqmentType" placeholder="请选择设备类型" clearable>
          <el-option
            v-for="dict in dict.type.eq_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['equipmentMan:eqment:add']"
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
          v-hasPermi="['equipmentMan:eqment:edit']"
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
          v-hasPermi="['equipmentMan:eqment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipmentMan:eqment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="eqmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="设备id" align="center" prop="id" />-->
      <el-table-column label="设备名称" align="center" prop="eqmentName" />
      <el-table-column label="设备编号" align="center" prop="eqmentNumber" />
      <el-table-column label="状态" align="center" prop="eqmentStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.eq_status" :value="scope.row.eqmentStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" prop="eqmentType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.eq_type" :value="scope.row.eqmentType"/>
        </template>
      </el-table-column>
<!--      <el-table-column label="教室id" align="center" prop="classroomId" />-->
      <el-table-column label="教室" align="center" prop="classroom.className" >
      </el-table-column>
      <el-table-column label="出厂日期" align="center" prop="proDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.proDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买日期" align="center" prop="buyDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyDate, '{y}-{m}-{d}') }}</span>
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
            v-hasPermi="['equipmentMan:eqment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipmentMan:eqment:remove']"
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

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="eqmentName">
          <el-input v-model="form.eqmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备编号" prop="eqmentNumber">
          <el-input v-model="form.eqmentNumber" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.eqmentStatus">
            <el-radio
              v-for="dict in dict.type.eq_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备类型" prop="eqmentType">
          <el-select v-model="form.eqmentType" placeholder="请选择设备类型">
            <el-option
              v-for="dict in dict.type.eq_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室" prop="className">
          <el-autocomplete
            class="inline-input"
            v-model="form.className"
           :fetch-suggestions="querySearchAsync"
            placeholder="请输入教室名称"
            @select="handleSelect"
            @keyup.enter.native="handleSubmit"
            @input="changeStyle('block', '.el-autocomplete-suggestion')"
            @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="出厂日期" prop="proDate">
          <el-date-picker clearable
            v-model="form.proDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择出厂日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="购买日期" prop="buyDate">
          <el-date-picker clearable
            v-model="form.buyDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择购买日期">
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
import { listEqment, getEqment, delEqment, addEqment, updateEqment } from "@/api/equipmentMan/eqment";
import { listClassroom, getClassroom, delClassroom, addClassroom, updateClassroom } from "@/api/equipmentMan/classroom";


export default {
  name: "Eqment",
  dicts: ['eq_status', 'eq_type'],
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
      restaurants:[],
      // 设备信息表格数据
      eqmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqmentName: null,
        eqmentStatus: null,
        eqmentType: null,
        classroomId: null,
        id:null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        eqmentName:[
          {required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        eqmentNumber: [
          {required:true,message:"设备编号不能为空",trigger:"blur"}
        ],
        className:[
          {required:true,message:"请选择教室"},
          {
            validator: (rule, value, callback) => {
              let p = {
                pageNum: 1,
                pageSize: 10,
                className: value
              };
              console.log(value+"===============")
              listClassroom(p).then(response => {
                console.log(response.rows.length)
                if(response.rows.length <= 0){
                  console.log("=====---------------------------")
                  callback(new Error('教室不存在，请联系管理员!'));
                }
              });
              callback();
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.loadAll();
  },
  methods: {
    /** 查询设备信息列表 */
    getList() {
      this.loading = true;
      listEqment(this.queryParams).then(response => {
        this.eqmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, name) {
      let dom = document.querySelectorAll(name);
      dom[0].style.display = status;
    },
    handleSubmit() {
      this.changeStyle("none", ".el-autocomplete-suggestion");
    },
    //input输入框建议数据处理
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      // 解决element建议搜索框无法显示内容 的数据处理
      for (var i = 0; i < restaurants.length; i++) {
        restaurants[i].value = restaurants[i].className;
      }
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      //     cb(results);
      // }, 1000 * Math.random());
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log("=================="+item.id)
      this.form.className = item.className;
      this.form.classroomId = item.id;
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
        eqmentNumber: null,
        eqmentStatus: "0",
        eqmentType: null,
        classroomId: null,
        className:null,
        proDate: null,
        buyDate: null,
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
      this.title = "添加设备信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEqment(id).then(response => {
        this.form = response.data;
        this.form.className = response.data['classroom'].className;
        console.log(response.data['classroom'].className);
        this.open = true;
        this.title = "修改设备信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEqment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEqment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除设备信息编号为"' + ids + '"的数据项？').then(function() {
        return delEqment(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipmentMan/eqment/export', {
        ...this.queryParams
      }, `eqment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
