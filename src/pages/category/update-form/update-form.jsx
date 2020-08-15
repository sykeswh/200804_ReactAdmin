import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item

//更新分类的form组件
class UpdateForm extends Component {
    formRef = React.createRef();  //!!! 
    static propTypes = {
        categoryName:PropTypes.string.isRequired
    }
    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            categoryName: this.props.categoryName,
        });
    }
    render() {
        const { categoryName } = this.props
        console.log('render()',categoryName)
        return (
            <Form ref={this.formRef} > 
                <Item 
                   name='categoryName' 
                   initialValue={categoryName}
                   rules={[
                    {required: true, message: '分类名称不能为空!'},
                
                    ]} >
                    <Input  placeholder='请输入分类名称' ></Input>
                </Item>
            </Form>
        )
    }
}

export default UpdateForm