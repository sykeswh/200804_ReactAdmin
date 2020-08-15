import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd'

import './left-nav.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;
/*
左侧导航组件 
 */
class LeftNav extends Component{
    //判断当前登陆用户对item是否有权限
    Auth = (item) =>{
       const {key,isPublic} = item
       const menus = memoryUtils.user.role.menus
       const username = memoryUtils.user.username
       if (username==='admin' || isPublic || menus.indexOf(key)!==-1) {
           return true
       }else if(item.children){
           return !!item.children.find(child => menus.indexOf(child.key)!==-1)
       }
       return false
    }
    /* 
    根据menu的数据数组生成对应的标签数组
    使用map加递归调用
    */
    getMenuNodes_map = (menuList)=>{
        let path = this.props.location.pathname
        if (path.indexOf('/product')===0) {
            path = '/product'
        }
        return menuList.map(item =>{
            if (!item.children) {
                return (
                  <Menu.Item key={item.key} icon={<item.icon />}><Link to={item.key}>{item.title}</Link></Menu.Item>
                )
            } else{
                const cItem = item.children.find(cItem => cItem.key ===path)  
                if (cItem) {
                    this.openKey = item.key
                } 
                return (
                    <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
                        {this.getMenuNodes(item.children)}   
                    </SubMenu>
                )
            }
        })
    }
    /* 
    根据menu的数据数组生成对应的标签数组
    使用reduce加递归调用
    */
    getMenuNodes = (menuList)=>{
       let path = this.props.location.pathname
       return menuList.reduce((pre,item)=>{
           if (this.Auth(item)) {
                if (!item.children) {
                    pre.push((<Menu.Item key={item.key} icon={<item.icon />}><Link to={item.key}>{item.title}</Link></Menu.Item>))
                }else{
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)  
                    if (cItem) {
                        this.openKey = item.key
                    } 
                    pre.push((
                        <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
                            {this.getMenuNodes(item.children)}   
                        </SubMenu>
                    ))
                }
           }
           
           return pre
       },[])
    }
    //在第一次render之前将数据准备完成
    UNSAFE_componentWillMount(){
        this.MenuNodes = this.getMenuNodes(menuList)
    }
    render(){
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product')===0) {
            path = '/product'
        }
        //得到当前页面属于哪个子类
        const openKey = this.openKey
        return (
              <div className="left-nav">
                  <Link to='/' className="left-nav-header"> 
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                  </Link>
                  <Menu
                    selectedKeys={[path]} //默认选中
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                  >
                    {
                        this.MenuNodes
                    }
                  </Menu> 
              </div>
        )
    }
}
/* 
withRouter高阶组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(LeftNav)