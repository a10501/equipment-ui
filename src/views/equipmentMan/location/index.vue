<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所在楼栋" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入所在楼栋"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="教室分布" prop="locationClass">-->
<!--        <el-input-->
<!--          v-model="queryParams.locationClass"-->
<!--          placeholder="请输入教室分布"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="责任人" prop="personCharg">
        <el-input
          v-model="queryParams.personCharg"
          placeholder="请输入责任人"
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
          v-hasPermi="['equipmentMan:location:add']"
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
          v-hasPermi="['equipmentMan:location:edit']"
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
          v-hasPermi="['equipmentMan:location:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['equipmentMan:location:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipmentMan:location:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="locationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="分布id" align="center" prop="id" />-->
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum-1)*queryParams.pageSize+scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在楼栋" align="center" prop="location" />
      <el-table-column label="教室分布" align="center" prop="locationClass" />
      <el-table-column label="数量" align="center" prop="eqNumber" />
      <el-table-column label="责任人" align="center" prop="personCharg" />
      <el-table-column label="值班电话" align="center" prop="personPhone" />
<!--      <el-table-column label="下载地址" align="center" prop="useDownload" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipmentMan:location:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipmentMan:location:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handledownload(scope.row)"
            v-hasPermi="['ywgl:document:downloadFile']"
          >下载文件</el-button>
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

    <!-- 添加或修改多媒体分布信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所在楼栋" prop="location">
          <el-input v-model="form.location" placeholder="请输入所在楼栋" />
        </el-form-item>
        <el-form-item label="教室分布" prop="locationClass">
          <el-input v-model="form.locationClass" placeholder="请输入教室分布" />
        </el-form-item>
        <el-form-item label="数量" prop="eqNumber">
          <el-input v-model="form.eqNumber" placeholder="请输入数量" />
        </el-form-item>
<!--        <el-form-item label="使用教程" prop="useDownload">-->
<!--          <el-input v-model="form.useDownload" placeholder="请输入使用教程下载地址" />-->
<!--        </el-form-item>-->
        <el-form-item label="" prop="field101">
          <el-upload ref="field101" :file-list="field101fileList" action="cdy"
                     :before-upload="field101BeforeUpload"
                     :before-remove="beforeRemove"
                     :on-remove="handleRemove"
                     :http-request="httpRequest"
                     :auto-upload="false"
                     :on-exceed="exceedFile"
                     :on-change="handleChange"
                     :on-progress="handleProgress"
                     :on-success="handleSuccess"
                     :on-error="handleError"
                     accept=".doc,.pdf,.txt,.docx"
                     :limit="1"
          >
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传的文件不能超过2Mb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="责任人" prop="personCharg">
          <el-input v-model="form.personCharg" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="值班电话" prop="personPhone">
          <el-input v-model="form.personPhone" placeholder="请输入值班电话" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLocation, getLocation, delLocation, addLocation, updateLocation,downloadFile } from "@/api/equipmentMan/location";
import {getToken} from "@/utils/auth";

export default {
  name: "Location",
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
      flag: false,
      // 多媒体分布信息表格数据
      locationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        location: null,
        locationClass: null,
        personCharg: null,
      },
      field101: null,
      field101fileList: [],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/equipmentMan/location/importData"
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
    /** 查询多媒体分布信息列表 */
    getList() {
      this.loading = true;
      listLocation(this.queryParams).then(response => {
        this.locationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    exceedFile(files,field101fileList) {
      console.log(files, field101fileList);
      this.$message.warning(`请最多上传 1 个文件`);
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
        location: null,
        locationClass: null,
        eqNumber: null,
        useDownload: null,
        personCharg: null,
        personPhone: null
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
      this.title = "添加多媒体分布信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.field101fileList = [];
      this.reset();
      const useDownload = row.useDownload;
      console.log(useDownload.length)
      if(useDownload.length > 0){
        const oriType = useDownload.substring(useDownload.lastIndexOf('/')+1,useDownload.length);
        this.field101fileList.push({name:oriType})
      }
      const id = row.id || this.ids
      getLocation(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改多媒体分布信息";
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "数据导入";
      this.upload.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        let that = this;
        if (valid) {
          // if (this.field101fileList.length === 0) {
          //   this.$message({
          //     message: '请先选择文件',
          //     type: 'warning'
          //   })
          // }else
            if(this.form.useDownload != null && this.flag === false){
            const formData =new FormData();
            formData.append('location',this.form.location);
            formData.append('locationClass',this.form.locationClass);
            formData.append('eqNumber',this.form.eqNumber);
            formData.append('useDownload',this.form.useDownload);
            formData.append('personCharg',this.form.personCharg);
            formData.append('personPhone',this.form.personPhone);
            formData.append('id',that.form.id)
            updateLocation(formData).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.field101fileList =[];
              this.flag = false;
            });
          }
          else {
            this.$refs.field101.submit();
          }
          // if (this.form.id != null) {
          //   updateLocation(this.form).then(response => {
          //     this.$modal.msgSuccess("修改成功");
          //     this.open = false;
          //     this.getList();
          //   });
          // } else {
          //   addLocation(this.form).then(response => {
          //     this.$modal.msgSuccess("新增成功");
          //     this.open = false;
          //     this.getList();
          //   });
          // }
        }
      });
    },

  handledownload(row) {
    const docPath = row.useDownload;
    //以文档标题命名文件
    let fileName = docPath.substring(docPath.lastIndexOf('/')+1,docPath.length);
    const id = row.id;
    var that =this

    //得到文件后缀
    const oriType = docPath.substring(docPath.lastIndexOf('.'),docPath.length);
    downloadFile(id).then(response => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        try {
          let { code, msg } = JSON.parse(fileReader.result);
          if (code !== 200) this.msgError(msg || "下载失败！");
        } catch (err) {
          const content = response;
          const blob = new Blob([content]);
          if ("download" in document.createElement("a")) {
            const elink = document.createElement("a");
            elink.download = fileName + oriType;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else {
            navigator.msSaveBlob(blob, fileName);
          }
        }
      };
      fileReader.readAsText(response);
    }).catch((err) => {
      this.$message.error("下载失败！")
    }).catch(err => {
      this.$message.error("下载失败！")

    })
  },
    handleProgress(event,file,field101fileList){
      //进度条设置
    },
    handleRemove(file,field101fileList){
      // 移除文件时，要重新给field101fileList赋值
      const arr = []
      for (let i = 0; i < this.field101fileList.length; i++) {
        if (this.field101fileList[i].uid !== file.uid) {
          arr.push(this.field101fileList[i])
        }
      }
      this.field101fileList = arr;
    },

    //上传成功后操作
    handleSuccess(response,file,field101fileList){

    },

    //上传失败后操作
    handleError(response,file,field101fileList){
      this.field101fileList = [];
    },
    // 手动上传文件
    httpRequest(field101fileList) {
      const formData =new FormData();
      formData.append('location',this.form.location);
      formData.append('locationClass',this.form.locationClass);
      formData.append('eqNumber',this.form.eqNumber);
      formData.append('useDownload',this.form.useDownload);
      formData.append('personCharg',this.form.personCharg);
      formData.append('personPhone',this.form.personPhone);
      formData.append('file',field101fileList.file);
      console.log(field101fileList.file)
      if (this.form.id != null) {
        formData.append('id', this.form.id)
        addLocation(formData).then(response => {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
          this.field101fileList = [];
        });
      }
      else{
        addLocation(formData).then(response => {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
          this.field101fileList =[];
        });
      }
      this.flag = false;
    },
  beforeRemove(file, field101fileList) {
    return this.$confirm(`确定移除 ${file.name}？`);
  },
  handleChange(file,field101fileList) {
    this.flag = true;
    let isRightSize = file.size / 1024 / 1024 < 2
    let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
    let acceptList = ["doc", "pdf","docx","txt"]
    if (!isRightSize) {
      field101fileList.pop(file.raw);
      this.$message.error('文件大小超过 2MB')
    }else if (acceptList.indexOf(extension) === -1) {
      field101fileList.pop(file.raw);
      this.$message({
        message: "上传文件只能是.doc/.pdf/.txt/.docx格式!",
        type: "warning",
      });
    }else {}
    this.field101fileList = field101fileList;
  },
  //文件上传之前验证
  field101BeforeUpload(file,field101fileList) {
  },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除多媒体分布信息编号为"' + ids + '"的数据项？').then(function() {
        return delLocation(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipmentMan/location/export', {
        ...this.queryParams
      }, `location_${new Date().getTime()}.xlsx`)
    },
  /** 下载模板操作 */
  importTemplate() {
    this.download('equipmentMan/location/importTemplate', {
    }, `location_template_${new Date().getTime()}.xlsx`)
  },
  // 文件上传中处理
  handleFileUploadProgress(event, file, fileList) {
    this.upload.isUploading = true;
  },
  // 文件上传成功处理
  handleFileSuccess(response, file, fileList) {
    this.upload.open = false;
    this.upload.isUploading = false;
    this.$refs.upload.clearFiles();
    this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
    this.getList();
  },
  // 提交上传文件
  submitFileForm() {
    this.$refs.upload.submit();
  }
  }
};
</script>
