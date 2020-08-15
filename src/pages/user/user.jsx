import React,{Component} from 'react'
import {Card,Button,Table,Modal, message} from 'antd'

import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button/index'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'
/* 
用户管理路由
*/
export default class User extends Component{
    formRef = React.createRef();
    state = {
        users:[],//所有的用户列表
        roles:[],//所有的角色列表
        loading:false,
        isShow:false,
        confirmLoading:false,
    }
    //初始化Table所有列的数组
    initColumns = () =>{
      this.columns = [
        {
          title: '用户名',
          dataIndex: 'username',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
        },
        {
          title: '电话',
          dataIndex: 'phone',
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          render:formateDate
        },
        {
          title: '所属角色',
          dataIndex: 'role_id',
          render:(role_id)=>this.roleNames[role_id]
        },
        {
          title: '操作',
          width:100,
          render: (user)=>(
              <span>
                 <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                 <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
              </span>
          )
        }
      ];
    }
    //根据role的数组，生成以role._id为key，name为值的数组
    initRoleNames = (roles) =>{
        const roleNames = roles.reduce((pre,role)=>{
             pre[role._id] = role.name
             return pre
         },{})
         this.roleNames = roleNames
    }
    //删除指定用户
    deleteUser=  (user) =>{
        Modal.confirm({
            title:`确认是否删除${user.username}?`,
            onOk:async ()=>{
                const result = await reqDeleteUser(user._id)
                if (result.status===0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }else{
                    message.error('删除用户失败！')
                }
            }
        })
    }
    //添加或者更新用户
    addOrUpdateUser = () => {
        this.formRef.current.formRef.current.validateFields().then(async(values)=>{
            const user = values
            if (this.user && this.user._id) {
                user._id = this.user._id
            }
           this.formRef.current.formRef.current.resetFields()//清理数据
           this.setState({confirmLoading:true})
           const result = await reqAddOrUpdateUser(user)
           if (result.status===0) {
               message.success(`${this.user ? '修改':'添加'}用户成功！`)
               this.setState({confirmLoading:false,isShow:false})
               this.getUsers()
           }else{
               message.error(`${this.user ? '修改':'添加'}用户失败！`)

        }
        })
    } 
    //获取所有用户的列表
    getUsers = async() =>{
        const result = await reqUsers()
        if (result.status===0) {
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({users,roles})
        }
    }
    //显示修改界面
    showUpdate = (user)=>{
        this.user = user
        this.setState({isShow:true})
    }
    //显示添加界面
    showAdd = () =>{
        this.user = null
        this.setState({isShow:true})
    }
    //为第一次render()准备数据
    UNSAFE_componentWillMount(){
       this.initColumns()
    }
    componentDidMount(){
        this.getUsers()
    }
    render(){
        const {users,loading,isShow,confirmLoading,roles} = this.state
        const user = this.user || {} 
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table 
                   dataSource={users} 
                   columns={this.columns} 
                   bordered
                   loading={loading} 
                   rowKey='_id' 
                   pagination={{defaultPageSize:5,showQuickJumper:true}}/>;
                <Modal
                  title={user._id? '修改用户' : '添加用户'}
                  visible={isShow}
                  onOk={this.addOrUpdateUser}
                  confirmLoading={confirmLoading}
                  onCancel={()=>{
                    this.setState({isShow: false})
                    this.formRef.current.formRef.current.resetFields()
                  }}
                >
                   <UserForm roles={roles} user={user} ref={this.formRef}/>
                </Modal>
            </Card>
        )
    }
}