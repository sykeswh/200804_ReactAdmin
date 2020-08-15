import React,{Component} from 'react'
import {Card,Button,Table,Modal, message} from 'antd'

import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
/* 
角色管理路由
*/
export default class Role extends Component{
    authRef = React.createRef();
    formRef = React.createRef();
    state = {
        roles:[],//所有角色的列表
        role:{}, //选中的role
        isShowAdd:false,//是否显示添加界面
        confirmLoading:false,//加载是否显示
        isShowAuth:false,//是否显示设置权限界面
    }
    initColumns = () =>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    //获取所有角色信息列表
    getRoles = async() =>{
        const result = await reqRoles()
        if (result.status===0) {
            const roles = result.data
            this.setState({roles})
        }
    }
    //选择列的函数
    onRow = (role) =>{
        this.setState({role})
    }
    //添加角色
    addRole = () =>{
       this.formRef.current.formRef.current.validateFields().then(async(values)=>{
           const {roleName} = values
           this.formRef.current.formRef.current.resetFields()//清理数据
           this.setState({confirmLoading:true})//加载出现
           const result = await reqAddRole(roleName)
           if (result.status===0) {
               message.success('添加角色成功！')
               this.setState({confirmLoading:false,isShowAdd:false})//加载结束且隐藏添加界面
               //this.getRoles() //重新加载角色列表
               const role = result.data
               this.setState(state =>({
                   roles:[...state.roles,role]
               }))

           }else{
            message.error('添加角色失败！')
           }
       })
    }
    //更新角色
    updateRole = async() =>{
        const {role} = this.state
        const menus = this.authRef.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        this.setState({confirmLoading:true})//加载出现
        const result = await reqUpdateRole(role)
        if (result.status===0) {
            this.setState({confirmLoading:false,isShowAuth:false})//加载结束
            //如果当前更新的是当前账户的角色权限，强制退出
            if (memoryUtils.user.role_id === role._id) {
                message.success('当前用户角色权限修改了,重新登陆！')
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }else{
                message.success('设置角色权限成功！')
                this.getRoles()
            }
        }else{
            message.error('设置角色权限失败！')

        }

    }
    //为第一次render()准备数据
    UNSAFE_componentWillMount(){
       this.initColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
    render(){
        const {roles,role,isShowAdd,confirmLoading,isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' style={{marginRight:10}} onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
               <Table 
                   dataSource={roles} 
                   columns={this.columns} 
                   bordered
                   rowKey='_id' 
                   pagination={{defaultPageSize:5}}
                   rowSelection={{type:'radio',onSelect:this.onRow}}
                />
                <Modal
                  title="添加角色"
                  visible={isShowAdd}
                  onOk={this.addRole}
                  confirmLoading={confirmLoading}
                  onCancel={()=>{
                      this.setState({isShowAdd: false})
                      this.formRef.current.formRef.current.resetFields()//清理数据
                  }}
                >
                  <AddForm ref={this.formRef}/>
                </Modal>
                <Modal
                  title="设置角色权限"
                  visible={isShowAuth}
                  onOk={this.updateRole}
                  confirmLoading={confirmLoading}
                  onCancel={()=>{
                      this.setState({isShowAuth: false})
                  }}
                >
                  <AuthForm ref={this.authRef} role={role}/>
                </Modal>
            </Card>
        )
    }
}