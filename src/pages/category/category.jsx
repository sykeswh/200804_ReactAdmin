import React,{Component} from 'react'
import { Card, Button, Table, message,Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api/index'
import AddForm from './add-form/add-form'
import UpdateForm from './update-form/update-form'

/* 
品类管理路由
*/
export default class Category extends Component{
    formRef = React.createRef();
    state ={
      loading:false,
      categorys:[], //一级分类列表
      subCategorys:[],//二级分类列表
      parentId:'0', //当前需要显示的分类列表的父分类ID
      parentName:'',//当前需要显示的分类列表的父分类名称
      visible: 0, //Modal是否显示
      confirmLoading: false,//加载是否显示
    }
    //初始化Table所有列的数组
    initColumns = () =>{
      this.columns = [
        {
          title: '分类名称',
          dataIndex: 'name',
        },
        {
          title: '操作',
          width:300,
          render: (category)=>(
              <span>
                <a href="#!" style={{marginRight:'10px'}} onClick={()=> this.showUpdate(category)}>修改分类</a>
                {this.state.parentId==='0' ? <a href="#!" onClick={()=> this.showSubCategorys(category)}>查看子分类</a>:null}
              </span>
          )
        }
      ];
    }
    //异步获取一级/二级分类列表显示
    getCategorys = async () =>{
      //在发请求前，显示loading
      this.setState({loading:true})
      const {parentId} = this.state
       const result = await reqCategorys(parentId)
       //请求完成后,隐藏loading
      this.setState({loading:false})
       if (result.status === 0) {
           const categorys = result.data
           if (parentId === '0') {
            this.setState({categorys})
           }else{
            this.setState({subCategorys:categorys})
           }
       }else{
         message.error('获取分类列表失败！')
       }
    }
    //显示指定一级分类对象的子分类
    showSubCategorys = (category) =>{
         this.setState({
           parentId:category._id,
           parentName:category.name
          },()=>{//在状态更新且重新render()后执行
             this.getCategorys()
          })
        
    }
    //显示一级分类列表
    showCategorys = () =>{
        this.setState({
          parentId:'0',
          parentName:'',
          subCategorys:[]
        })
    }
    //显示Modal
    showAdd = () =>{
      this.setState({
        visible: 1,
      });
    }
    showUpdate = (category) =>{
      this.category = category
      this.setState({
        visible: 2
      });
    }
    //修改vicibel,取消Modal
    handleCancel =() =>{
      this.setState({
        visible: 0,
      });
    }
    //添加分类
    addCategory = () =>{
      this.formRef.current.formRef.current.validateFields().then(async(values)=>{
        this.setState({
          confirmLoading: true
        });
        const {categoryName,parentId} = values
        const result = await reqAddCategory(categoryName,parentId)
        this.formRef.current.formRef.current.resetFields()
        if (result.status === 0) {
          this.setState({
            visible: 0,
            confirmLoading: false
          });
          if (parentId===this.state.parentId) {
            this.getCategorys()
          }else if(parentId==='0'){
            this.setState({parentId:'0'},()=>{
              this.getCategorys()
            })
          }
        }else{
          message.error('该分类已被添加！')
        }
      })
      
    }
     //更新分类
    updateCategory = () =>{
          this.formRef.current.formRef.current.validateFields().then(async (values) =>{
            this.setState({
              confirmLoading: true
            });
            const categoryId = this.category._id
            const {categoryName} = values
            const result = await reqUpdateCategory(categoryId,categoryName)
            if (result.status === 0) {
              this.setState({
                visible: 0,
                confirmLoading: false
              });
              this.getCategorys()
            }
          })
    }
    //为第一次render()准备数据
    UNSAFE_componentWillMount(){
       this.initColumns()
    }
    //执行异步任务:发异步ajax请求
    componentDidMount(){
      this.getCategorys()
    }
    render(){
      const {categorys,subCategorys,loading,parentId,parentName,visible,confirmLoading} = this.state
      const category = this.category || {name:''}
      const title = parentId==='0' ? '一级分类列表' : (
        <span>
            <a href="#!" onClick={this.showCategorys}>一级分类列表</a>
            <ArrowRightOutlined style={{marginLeft:'10px',marginRight:'10px'}}/>
            <span>{parentName}</span>
        </span>
      )
        return (
            <Card title={title} extra={<Button onClick={this.showAdd} type="primary" icon={<PlusOutlined/>}>添加</Button>}>
                <Table 
                   dataSource={parentId==='0' ? categorys : subCategorys} 
                   columns={this.columns} 
                   bordered
                   loading={loading} 
                   rowKey='_id' 
                   pagination={{defaultPageSize:5,showQuickJumper:true}}/>;
                <Modal
                  title="添加分类"
                  visible={visible===1}
                  onOk={this.addCategory}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                >
                  <AddForm ref={this.formRef} categorys={categorys} parentId={parentId}/>
                </Modal>
                <Modal
                  title="更新分类"
                  visible={visible===2}
                  onOk={this.updateCategory}
                  confirmLoading={confirmLoading}
                  onCancel={this.handleCancel}
                >
                  <UpdateForm ref={this.formRef} categoryName={category.name}/>
                </Modal>
            </Card>
        )
    }
}