import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import {QuestionCircleOutlined} from '@ant-design/icons'

import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import './header.less'

const { confirm } = Modal;
/*
左侧导航组件 
 */
class Header extends Component{
    state = {
        currentTime:formateDate(Date.now()),
        weather:''
    }
    //更新日期
    getTime = () =>{
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    //更新天气
    getWeather = async () =>{
        const weather = await reqWeather('大悟县')
        this.setState({weather})
    }
    //查找路由名称
    getTitle =() =>{
        const path = this.props.location.pathname
        let title
        menuList.forEach(item =>{
            if (item.key === path) {
                title = item.title
            }else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) ===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    //退出登录
    getOut = () =>{
        confirm({
            title: '确认退出吗?',
            icon:<QuestionCircleOutlined />,
            onOk:() => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
        })
    }
    componentDidMount(){
       this.getTime()
       this.getWeather()
    }
    //在当前组件销毁时触发
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render(){
        const {currentTime,weather} = this.state
        const {username} = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <a href="#!" onClick={this.getOut}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span className="header-bottom-right-time">{currentTime}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)