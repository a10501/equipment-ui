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

    <el-table v-loading="loading" :data="eqmentList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="50"  align="center" />
<!--      <el-table-column label="设备id" align="center" prop="id" />-->
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum-1)*queryParams.pageSize+scope.$index + 1}}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="教室" align="center" prop="className" >
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="nickName">
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.eq_type" :value="scope.row.responsiblePeo"/>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="负责人电话" align="center" prop="sysUser.phonenumber">
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope" >
          <el-button
            v-if="scope.row.eqmentStatus !== '2'"
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
          <el-button
            size="mini"
            type="warning"
            plain
            icon="el-icon-s-cooperation"
            @click="handleApplyBad(scope.row)"
            v-hasPermi="['equipmentMan:badinfo:add']"
            v-if="scope.row.eqmentStatus == '0'"
          >报修</el-button>
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
        <el-form-item label="负责人"  prop="nickName">
          <el-autocomplete ref='autocomplete'
                           class="inline-input"
                           v-model="form.nickName"
                           :fetch-suggestions="querySearchAsyncUser"
                           placeholder="请输入负责人姓名"
                           @select="handleSelectUser"
                           @keyup.enter.native="handleSubmitUser"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="教室" prop="className">
          <el-autocomplete ref='autocomplete'
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

    <!-- 添加或修改设备报修信息对话框 -->
    <el-dialog :title="applyTitle" :visible.sync="openApply" width="500px" append-to-body>
      <el-form ref="applyForm" :model="applyForm" :rules="applyRules" label-width="80px">
        <el-form-item label="设备名称" prop="badinfoName">
          <el-input v-model="applyForm.badinfoName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="教室" prop="className">
          <el-autocomplete ref='autocomplete'
                           class="inline-input"
                           v-model="applyForm.className"
                           :fetch-suggestions="querySearchAsync"
                           placeholder="请输入教室名称"
                           @select="handleSelect"
                           @keyup.enter.native="handleSubmit"
                           @input="changeStyle('block', '.el-autocomplete-suggestion')"
                           @keyup="changeStyle('block', '.el-autocomplete-suggestion')"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="故障说明" prop="badinfoStat">
          <el-input v-model="applyForm.badinfoStat" placeholder="请输入故障说明" />
        </el-form-item>
        <el-form-item label="申请人" prop="badinfoPeo">
          <el-input v-model="applyForm.badinfoPeo" placeholder="请输入申请人" />
        </el-form-item>
<!--        <el-form-item  label="审核状态" prop="badinfoStatus">-->
<!--          <el-select v-model="applyForm.badinfoStatus" placeholder="请选择审核状态">-->
<!--            <el-option-->
<!--              v-for="dict in dict.type.eq_handle_status"-->
<!--              :key="dict.value"-->
<!--              :label="dict.label"-->
<!--              :value="dict.value"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <!--        <el-form-item label="申报日期" prop="badinfoDate">-->
        <!--          <el-date-picker clearable-->
        <!--            v-model="form.badinfoDate"-->
        <!--            type="date"-->
        <!--            value-format="yyyy-MM-dd"-->
        <!--            placeholder="请选择申报日期">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="applyForm.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitApplyForm">确 定</el-button>
        <el-button @click="cancelApply">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listEqment, getEqment, delEqment, addEqment, updateEqment } from "@/api/equipmentMan/eqment";
import { listClassroom, getClassroom, delClassroom, addClassroom, updateClassroom } from "@/api/equipmentMan/classroom";
import { listRecordUser,listUser } from "@/api/system/user";
import { getUserProfile } from "@/api/system/user";
import {addBadinfo} from "@/api/equipmentMan/badinfo";


export default {
  name: "Eqment",
  dicts: ['eq_status', 'eq_type'],
  data() {
    return {
      user:{},
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
      // 报修弹出层标题
      applyTitle: "",
      // 是否显示弹出层
      openApply: false,
      restaurants:[],
      restaurantsUser:[],
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
        className: null,
        id:null
      },
      // 设备表单参数
      form: {},
      //报修申请表单
      applyForm: {},
      // 表单校验
      rules: {
        eqmentName:[
          {required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        responsiblePeo:[
          {required:true,message:"负责人不能为空",trigger:"blur"}
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
              listClassroom(p).then(response => {
                if(response.rows.length === 0){
                  callback(new Error('教室不存在，请查询教室信息表!'));
                }else{
                  callback();
                }
              });

            },
            trigger: 'blur'
          }
        ],
        nickName:[
          {required:true,message:"负责人不能为空"},
          {
            validator: (rule, value, callback) => {
              let p = {
                pageNum: 1,
                pageSize: 10,
                nickName: value
              };
              listUser(p).then(response => {
                if(response.rows.length === 0){
                  callback(new Error('负责人不存在，请联系管理员!'));
                }else{
                  callback();
                }
              });

            },
            trigger: 'blur'
          }
        ],
      },
      applyRules: {
        badinfoName:[
          {required:true,message:"设备名称不能为空"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getUser();
    this.loadAll();
    this.loadAllUser();
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
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    },
    //获取用户信息
    loadAllUser() {
      listRecordUser().then(response =>{
        if(response.code === 200 && response.total > 0 ){
          this.restaurantsUser = response.rows
          return this.restaurantsUser;
        }
      })
    },
  //input输入框建议数据处理
  querySearchAsyncUser(queryString, cb) {
    var restaurantsUser = this.restaurantsUser;
    // 解决element建议搜索框无法显示内容 的数据处理
    for (var i = 0; i < restaurantsUser.length; i++) {
      restaurantsUser[i].value = restaurantsUser[i].nickName;
    }
    var results = queryString ? restaurantsUser.filter(this.createStateFilterUser(queryString)) : restaurantsUser;

    cb(results);
  },
  createStateFilterUser(queryString) {
    return (state) => {
      return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  },
  handleSelectUser(item) {
     this.form.nickName = item.nickName;
    this.form.peopleId = item.userId;
  },


    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyle(status, name) {
      let dom = document.querySelectorAll(name);
      dom[0].style.display = status;
    },
    handleSubmit() {
      this.changeStyle("none", ".el-autocomplete-suggestion");
    },
    //根据传进来的状态改变建议输入框的状态（展开|隐藏）
    changeStyleUser(status, name) {
      let dom = document.querySelectorAll(name);
      dom[0].style.display = status;
    },
    handleSubmitUser() {
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
    handleSelectApply(item) {
      this.applyForm.className = item.className;
      this.applyForm.classroomId = item.id;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消申请按钮
    cancelApply() {
      this.openApply = false;
      this.resetApply();
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
        nickName: null,
        proDate: null,
        buyDate: null,
        remark: null
      };
      this.resetForm("form");
    },

    // 报修申请表单重置
    resetApply() {
      this.applyForm = {
        id: null,
        badinfoName: null,
        eqmentId: null,
        badinfoStat: null,
        badinfoPeo: null,
        badinfoStatus: '0',
        classroomId: null,
        badinfoDate: null,
        remark: null
      };
      this.resetForm("applyForm");
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
      this.form.responsiblePeo = this.user.nickName;
      this.open = true;
      this.title = "添加设备信息";
    },
    /** 报修申请按钮操作 */
    handleApplyBad(row) {
      this.resetApply();
      const id = row.id || this.ids
      getEqment(id).then(response => {
        this.applyForm.eqmentId = response.data.id;
        console.log(response.data.id)
        this.applyForm.badinfoName = response.data.eqmentName;
        this.applyForm.classroomId = response.data.classroomId;
        this.applyForm.className = response.data.className;
        this.openApply = true;
      });
      this.applyTile = "报修申请信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEqment(id).then(response => {

        this.form = response.data;
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
              this.$modal.msgSuccess("操作成功");
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
    /** 报修提交按钮 */
    submitApplyForm() {
      this.$refs["applyForm"].validate(valid => {
        if (valid) {
            addBadinfo(this.applyForm).then(response => {
              this.$modal.msgSuccess("报修成功");
              this.openApply = false;

            });

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
