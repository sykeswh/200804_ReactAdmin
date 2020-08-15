import React,{Component} from 'react'
import { Card,Select,Input,Button,Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import LinkButton from '../../components/link-button'

const Option = Select.Option
/* 
商品管理默认界面路由
*/
export default class ProductHome extends Component{
    state ={
        products:[],
        total:0, //商品的总数量
        loading:false,
        searchName:'',
        searchType:'productName',
    }
    initColumns = () =>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name'
            },
            {
              title: '商品描述',
              dataIndex: 'desc'
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price)=> '￥' + price
            },
            {
              width:100,
              title: '状态',
              render:(product)=>(
                  <span>
                      <Button type='primary' onClick={() => this.updateStatus(product)}>{product.status===1 ? '下架' : '上架'}</Button>
                      <span style={{marginLeft:16}}>{product.status===1 ? '在售' : '已下架'}</span>
                  </span>
              )
            },
            {
              title: '操作',
              width:100,
              render:(product)=>(
                  <span>
                      <LinkButton style={{marginRight:10}} onClick={()=>this.props.history.push('/product/detail',product)}>详情</LinkButton>
                      <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                  </span>
              )
            },
          ];
    }
    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) =>{
         this.pageNum = pageNum  //保存页码，后面更新商品状态后重新获取商品列表需要
         this.setState({loading:true})
         const {searchName,searchType} = this.state
         let result
         if (searchName) {
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
         } else{
            result = await reqProducts(pageNum,PAGE_SIZE)
         }
         this.setState({loading:false})
         if (result.status === 0) {
             const {total,list} = result.data
             this.setState({products:list,total})
         }
    }
    //更新商品状态
    updateStatus = async (product) =>{
        const {_id,status} = product 
        const newStatus = status === 1 ? 2 : 1
        const result = await reqUpdateStatus(_id,newStatus)
        if (result.status === 0) {
             message.success('更新商品成功！')
             this.getProducts(this.pageNum)
        }
    }
    UNSAFE_componentWillMount(){
        this.initColumns()
     }
     componentDidMount(){
         this.getProducts(1)
     }
    render(){
        const {products,loading,total,searchName,searchType} = this.state
        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} value={searchName} 
                  onChange={event => this.setState({searchName:event.target.value})}/>
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        return (
            <Card title={title} extra={<Button type="primary" icon={<PlusOutlined/>} onClick={()=>this.props.history.push('/product/addupdate')}>添加商品</Button>}>
                  <Table
                     dataSource={products} 
                     columns={this.columns} 
                     bordered
                     loading={loading} 
                     rowKey='_id' 
                     pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true,total,onChange:this.getProducts,current:this.pageNum}}
                  />
            </Card>
        )
    }
}