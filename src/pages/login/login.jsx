/* 
登录的路由组件
 */
import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Form,Input,Button} from 'antd'
import { UserOutlined,LockOutlined } from '@ant-design/icons'
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.png'
import {login} from '../../redux/action'


class Login extends Component{
    onFinish = async (event)=>{
        const {username,password} = event
        //调用分发异步action的函数 => 发登陆的异步请求,有了结果后更新状态
        this.props.login(username,password)
    }
    render(){
        //如果用户已经登陆，自动跳转到登陆界面
        const user = this.props.user
        //如果内存没有存储user ==> 当前没有登陆
        if (user && user._id) {
            return <Redirect to='/home'/>
        }
        const errorMsg = this.props.user.errorMsg
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React:后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div className={errorMsg ? 'error-msg show':'error-msg'}>{errorMsg}</div>
                    <h2>用户登陆</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish = {this.onFinish}
                        >
                        <Form.Item
                            name="username"
                            //声明式验证
                            rules={[
                            {required: true, message: '请输入用户名!'}
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            //自定义验证
                            rules={[
                                {validator:(rule, value)=> {
                                  if(!value){
                                    return Promise.reject('请输入密码!');
                                  }else{
                                     return Promise.resolve()
                                  }
                                },}
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                              登陆
                            </Button>
                        </Form.Item>
                        </Form>
                </section>
            </div>
        )
    }
}
export default connect(
    state =>({user:state.user}),
    {login}
)(Login)