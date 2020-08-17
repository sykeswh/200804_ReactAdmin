import ajax from './ajax'
import axios from 'axios'
import { message } from 'antd'

// const BASE = ''
const BASE = 'http://localhost:3000/api'
//登陆
export const reqLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')
//注册或修改
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST')
//天气
export const reqWeather = (city) => {
    const url = 'https://restapi.amap.com/v3/weather/weatherInfo'
    const key = '7959b8d47c311f317bf62cd7afbf1d6f'
    return new Promise((resolve,response) =>{
        axios.get(url,{params:{key,city}}).then(response =>{
            if (response.data.status === "1") {
                const weather = response.data.lives[0].weather
                resolve(weather)
            }else{
                message.error('获取天气信息失败！')
            }
        }).catch(error =>{
            message.error('获取天气信息失败！')
        })
    })
}
//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST')
//获取一级/二级分类
export const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list',{parentId})
//更新分类
export const reqUpdateCategory = (categoryId,categoryName) => ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
//获取商品信息列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})
//搜索产品分页列表(根据商品名称/商品描述)
//searchType:搜索的类型，productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})
//根据分类ID获取一个分类
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})
//更新商品状态(上架或下架)
export const reqUpdateStatus = (productId,status) => ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')
//删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')
//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')
//获取所有角色的列表
export const reqRoles = () => ajax(BASE+'/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE+'/manage/role/add',{roleName},'POST')
//更新角色
export const reqUpdateRole = (role) => ajax(BASE+'/manage/role/update',role,'POST')
//获取所有用户的列表
export const reqUsers = () => ajax(BASE+'/manage/user/list')
//删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST')


