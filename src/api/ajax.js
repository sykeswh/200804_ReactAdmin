import axios from 'axios'
// import qs from 'qs'
import {message} from 'antd'

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,response) =>{
        let promise
        if (type==='GET') {
            promise = axios.get(url,{//配置对象
               params:data
            })
        }else{
            // let instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });
            promise = axios.post(url,data)
        }
        promise.then(response =>{
            resolve(response.data)
        }).catch(error =>{
            message.error('登陆失败,请重新登陆！'+error)
        })
    })
}