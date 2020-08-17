import React,{Component} from 'react'
import {Card,List} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import {BASE_IMG_URL} from '../../utils/constants'
import LinkButton from '../../components/link-button'
import {reqCategory} from '../../api'
import memoryUtils from '../../utils/memoryUtils'

const Item = List.Item
export default class ProductDetail extends Component{
    state = {
        cName1:'',
        cName2:'',
    }
    async componentDidMount(){
        const {pCategoryId,categoryId} = memoryUtils.product
        if (pCategoryId === '0') {//一级分类下的商品 
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else{//二级分类下的商品
            /* const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            console.log(cName1,cName2); */
            //一次性发送多个请求,只有都成功了，才正常处理
            const resules = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = resules[0].data.name
            const cName2 = resules[1].data.name
            this.setState({cName1,cName2})
        }
    }
    componentWillUnmount(){
        memoryUtils.product={}
    }
    render(){
        const {name,desc,imgs,price,detail} = memoryUtils.product
        const {cName1,cName2} = this.state
        const title = (
            <span>
               <LinkButton onClick={()=> this.props.history.goBack()}><ArrowLeftOutlined style={{fontSize:20}}/></LinkButton>
               <span style={{marginLeft:15}}>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                       <div>
                          <span className='left'>商品名称:</span>
                          <span>{name}</span>
                       </div>
                    </Item>
                    <Item>
                        <div>
                           <span className='left'>商品描述:</span>
                           <span>{desc}</span>
                        </div>
                        
                    </Item>
                    <Item>
                        <div>
                           <span className='left'>商品价格:</span>
                           <span>{price}元</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                           <span className='left'>所属分类:</span>
                           <span>{cName1} {cName2? '-->' + cName2 : null}</span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                           <span className='left'>商品图片:</span>
                           <span>
                               {
                                   imgs.map(img =>(
                                    <img src={BASE_IMG_URL+img} alt="" key={img}/>
                                   ))
                               }
                           </span>
                        </div>
                    </Item>
                    <Item>
                        <div>
                           <span className='left'>商品详情:</span>
                           <span dangerouslySetInnerHTML={{__html:detail}}></span>
                        </div>
                    </Item>
                </List>
            </Card>
        )
    }
}