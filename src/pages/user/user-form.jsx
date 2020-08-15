import React,{PureComponent} from 'react'
import { Form,Select,Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
export default class UserForm extends PureComponent{
      formRef = React.createRef();
      static propTypes = {
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
      }
      componentDidUpdate(){
        this.formRef.current.setFieldsValue({
            username:this.props.user.username,
            password:this.props.user.password,
            phone:this.props.user.phone,
            email:this.props.user.email,
            role_id:this.props.user.role_id
        });
      }
      render(){
          const formItemLayout = {
              labelCol:{span:4},
              wrapperCol:{span:15}
          }
          const {roles,user} = this.props
          
          return (
              <Form 
                  ref={this.formRef}
                  hideRequiredMark
                  {...formItemLayout}
                  initialValues={{
                        username:user.username,
                        password:user.password,
                        phone:user.phone,
                        email:user.email,
                        role_id:user.role_id
                  }}
              >
                  <Item 
                     name="username"
                     label="用户名"
                     rules={[
                        {required: true, message: '用户名不得为空!'},
                        {min:4,message:'用户名不得少于4个字符'},
                        {max:12,message:'用户名不得超过12个字符'},
                        {pattern:/^[a-zA-Z_][0-9a-zA-Z_]{0,}$/g,message:'请以字母或下划线开头并包括数字、字母、下划线组成'}
                    ]}> 
                    <Input placeholder='请输入用户名'/>
                  </Item>
                  <Item 
                     name="password"
                     label="密码"
                     rules={[
                        {required: true, message: '密码不得为空!'},
                        {validator:(rule, value)=> {
                          if (!/^[a-zA-Z0-9!?_]{4,}$/.test(value)) {
                            return Promise.reject('密码至少由4位任意字符组成!');
                          }else{
                             return Promise.resolve()
                          }
                        }}
                      ]}> 
                    <Input type='password' placeholder='请输入密码'  disabled={user._id?true:false}/>
                  </Item>
                  <Item 
                     name="phone"
                     label="手机号"
                     rules={[
                      {required: true, message: '手机号不能为空!'},
                      {len:11,message:'手机号码为11位数字！'},
                      ]}> 
                    <Input placeholder='请输入手机号'/>
                  </Item>
                  <Item 
                     name="email"
                     label="邮箱"
                     rules={[
                      {required: true, message: '邮箱不能为空!'},
                      {type:'email', message: '请输入正确的邮箱地址!'},
                      ]}> 
                    <Input placeholder='请输入邮箱'/>
                  </Item>
                  <Item 
                     name="role_id"
                     label="角色"
                     rules={[
                      {required: true, message: '角色不能为空!'}
                      ]}>
                     <Select placeholder='请选择角色'>
                         {
                             roles.map(role =><Option key={role._id} value={role._id}>{role.name}</Option>)
                         }
                     </Select>
                  </Item>
              </Form>
          )
      }
}