import React,{Component} from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'

import {reqDeleteImg} from '../../api'

/* 用于图片上传的组件 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  static props = {
    imgs:PropTypes.array
  }
  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img,index) =>({
        uid:-index,
        name:img,
        status:'done',
        url:BASE_IMG_URL + img
      }))
      this.state = {
        previewVisible: false, //是否弹出对话框
        previewImage: '', //大图的url
        previewTitle: '',//图片名称
        fileList,//已经上传的文件列表
      }
    } else {
      this.state = {
        previewVisible: false, //是否弹出对话框
        previewImage: '', //大图的url
        previewTitle: '',//图片名称
        fileList: [],//已经上传的文件列表
      };
    }
  }
  //获取所有已上传图片文件名的数组
  getImgs = () =>{
    return this.state.fileList.map(file =>file.name)
  }
  //点击遮罩层或右上角叉或取消按钮的回调
  handleCancel = () => this.setState({ previewVisible: false });
  //点击文件链接或预览图标时的回调
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  
  /* 
  file:当前操作的图片文件(上传/删除)
  fileList：所有已上传图片文件对象的数组
  */
  handleChange = async ({ file,fileList }) => {
    //一旦上传成功，将当前上传的file的信息修正(name,url)
    if (file.status==='done') {
           const result = file.response //{status:0.data:{name:'xxx.jpg',url:'图片地址'}}
           if (result.status===0) {
             message.success('上传图片成功！')
             const {name,url} = result.data
             file = fileList[fileList.length-1]
             file.name = name
             file.url = url
           }else{
            message.error('上传图片失败！')
           }
    }else if (file.status==='removed') {//删除图片
           const result = await reqDeleteImg(file.name)
           if (result.status===0) {
             message.success('删除图片成功！')
           }else{
             message.error('删除图片失败！')
           }
    }
    //在操作(上传/删除)过程中更新fileList状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/api/manage/img/upload" //上传的地址
          accept="image/*"  //只接收图片格式
          name="image" //请求参数名
          listType="picture-card" //上传列表的内建样式,以卡片的形式
          fileList={fileList} //已经上传的文件列表
          onPreview={this.handlePreview} //点击文件链接或预览图标时的回调
          onChange={this.handleChange} //上传文件改变时的状态
        >
          {fileList.length >= 2 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible} //对话框是否可见
          title={previewTitle} //对话框名称
          footer={null} //不需要底部按钮
          onCancel={this.handleCancel} //点击遮罩层或右上角叉或取消按钮的回调
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
