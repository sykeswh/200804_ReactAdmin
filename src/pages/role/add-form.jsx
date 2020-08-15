import React,{Component} from 'react'
import { Form,Input } from 'antd'
const Item = Form.Item
export default class AddForm extends Component{
      formRef = React.createRef();
      render(){
          return (
              <Form ref={this.formRef}>
                  <Item 
                     name="roleName"
                     label="角色名称"
                     rules={[
                      {required: true, message: '角色名称不能为空!'}
                      ]}> 
                    <Input placeholder='请输入角色名称'/>
                  </Item>
              </Form>
          )
      }
}