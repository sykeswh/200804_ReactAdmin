import React,{PureComponent} from 'react'
import { Form,Input,Tree } from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'
const Item = Form.Item
export default class AuthForm extends PureComponent{
      static propTypes = {
          role:PropTypes.object.isRequired
      }
      constructor(props){
          super(props)
          const {menus} = this.props.role
          this.state = {
            checkedKeys:menus
          }
      }
      //更改选中权限
      onCheck = (checkedKeys) => {
          this.setState({checkedKeys})
      };
      getMenus = ()=>{
          return this.state.checkedKeys
      }
      /* 
      当prop改变时调用
      */
      UNSAFE_componentWillReceiveProps(nextProps){
        console.log('UNSAFE_componentWillReceiveProps')
          if (nextProps.role!==this.state.checkedKeys) {
            this.setState({checkedKeys:nextProps.role.menus})
          }
      }
      render(){
          console.log('Auth render')
          const {role} = this.props
          const {checkedKeys} = this.state
          return (
              <div>
                  <Item
                     label="角色名称"
                  > 
                    <Input value={role.name} disabled/>
                  </Item>
                  <Tree
                    checkable
                    defaultExpandAll
                    onCheck={this.onCheck}
                    treeData={menuList}
                    checkedKeys={checkedKeys}
                  />
              </div>
          )
      }
}