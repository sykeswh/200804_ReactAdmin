import React,{Component} from 'react'
import { Form,Select,Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
export default class AddForm extends Component{
       formRef = React.createRef();
       static propTypes= {
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired
      }
      componentDidUpdate(){
        this.formRef.current.setFieldsValue({
          parentId:this.props.parentId,
          categorys:this.props.categorys
        })
      }
      render(){
          const {parentId,categorys} = this.props
          return (
              <Form ref={this.formRef}>
                  <Item name="parentId" initialValue={parentId}>
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(item =><Option key={item._id} value={item._id}>{item.name}</Option>)
                        }
                    </Select>
                  </Item>
                  <Item 
                     name="categoryName"
                     rules={[
                      {required: true, message: '分类名称不能为空!'}
                      ]}> 
                    <Input placeholder='请输入分类名称'/>
                  </Item>
              </Form>
          )
      }
}