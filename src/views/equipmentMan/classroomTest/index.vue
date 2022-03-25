<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="教室状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择教室状态" clearable>
          <el-option
            v-for="dict in dict.type.eq_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教室名称" prop="className">
        <el-input
          v-model="queryParams.className"
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipmentMan:classroomTest:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="classroomTestList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
<!--      <el-table-column label="上级id" prop="parentId" />-->
<!--      <el-table-column label="显示顺序" align="center" prop="orderNum" />-->
<!--      <el-table-column label="祖级列表" align="center" prop="ancestors" />-->
      <el-table-column label="教室名称" align="center" prop="className" />
      <el-table-column label="教室状态" align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.classroom_status" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipmentMan:classroomTest:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['equipmentMan:classroomTest:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipmentMan:classroomTest:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改教室信息测试对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级id" prop="parentId">
          <treeselect v-model="form.parentId" :options="classroomTestOptions" :normalizer="normalizer" placeholder="请选择教室" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
        <el-form-item label="教室名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入教室名称" />
        </el-form-item>
        <el-form-item label="教室状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.classroom_status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listClassroomTest, getClassroomTest, delClassroomTest, addClassroomTest, updateClassroomTest } from "@/api/equipmentMan/classroomTest";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ClassroomTest",
  dicts: ['eq_status','classroom_status'],
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 教室信息测试表格数据
      classroomTestList: [],
      // 教室信息测试树选项
      classroomTestOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        status: null,
        className: null,
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
    /** 查询教室信息测试列表 */
    getList() {
      this.loading = true;
      listClassroomTest(this.queryParams).then(response => {
        this.classroomTestList = this.handleTree(response.data, "id", "parentId");
        this.classroomTestList[0].status =""
        this.classroomTestList[0].children[0].status = ""
        console.log(this.classroomTestList[0].id+"======"+this.classroomTestList[0].className )
        console.log(this.classroomTestList[0].children[0].id +"======"+this.classroomTestList[0].children[0].className)
        console.log(this.classroomTestList[0].children[0].children[0].id+"======"+this.classroomTestList[0].children[0].children[0].className )
        console.log(this.classroomTestList )
        console.log(response.data)
        this.loading = false;
      });
    },
    /** 转换教室信息测试数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.className,
        children: node.children
      };
    },
	/** 查询教室信息测试下拉树结构 */
    getTreeselect() {
      listClassroomTest().then(response => {
        this.classroomTestOptions = [];
        const data = { id: 0, className: '教学楼选择或新建', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");

        console.log(data)

        this.classroomTestOptions.push(data);
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
        parentId: null,
        orderNum: null,
        ancestors: null,
        status: "0",

        className: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加教室信息测试";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getClassroomTest(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教室信息测试";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateClassroomTest(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClassroomTest(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除教室信息测试编号为"' + row.id + '"的数据项？').then(function() {
        return delClassroomTest(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
