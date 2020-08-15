import React,{PureComponent} from 'react'
import { Card,Form,Input,Cascader,Button, message } from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextDitor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input
/* 
商品添加路由
*/
export default class ProductAddUpdate extends PureComponent{
    state = {
        options:[],
    };
    wallRef = React.createRef();
    editorRef = React.createRef();
    onFinish = async (values) =>{
        const {name,price,desc,categorys,imgs,detail} = values
        let pCategoryId,categoryId
        if (categorys.length===1) {
            pCategoryId = '0'
            categoryId = categorys[0]
        }else{
            pCategoryId = categorys[0]
            categoryId = categorys[1]
        }
        const product = {name,price,desc,pCategoryId,categoryId,imgs,detail}
        product.imgs = this.wallRef.current.getImgs()
        product.detail = this.editorRef.current.getDetail()
        if (this.isUpdate) {
            product._id = this.product._id
        }
        const result = await reqAddOrUpdateProduct(product)
        if (result.status === 0) {
            message.success(`${this.isUpdate?'更新':'添加'}商品成功！`)
            this.props.history.goBack()
        }else{
            message.error(`${this.isUpdate?'更新':'添加'}商品失败！`)
        }
    }
    //加载下一级列表的回调函数
    loadData =async(selectedOptions) => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        //显示loading效果
        targetOption.loading = true;
        //根据选中的分类,请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        if (subCategorys && subCategorys.length>0) {
            const cOptions = subCategorys.map(c => ({
                label:c.name,
                value:c._id,
                isLeaf:true
            }))
            targetOption.children = cOptions
        }else{
            targetOption.isLeaf = true
        }
        targetOption.loading = false
        //更新option数组状态
        this.setState({
            options: [...this.state.options],
        });
    };
    //获取一级/二级分类列表
    getCategorys = async (parentId) =>{
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            //判断如果是一级列表
            if (parentId==='0') {
                this.initOptions(categorys)
            }else{
                return categorys
            }
            
        }
    }
    //更新options
    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.reduce((pre,item)=>{
               pre.push({
                  label:item.name,
                  value:item._id,
                  isLeaf:false
               })
               return pre
        },[])
        //如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId !== '0'){
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表的options
            const cOptions = subCategorys.map(c => ({
                label:c.name,
                value:c._id,
                isLeaf:true
            }))
            const targetOption = options.find(c => c.value === pCategoryId)
            targetOption.children = cOptions
        }
        //更新options状态
        this.setState({options})
    }
    componentDidMount(){
        this.getCategorys('0')
    }
    UNSAFE_componentWillMount(){
        const product = this.props.location.state
        //保存是否是更新的标识
        this.isUpdate = !!product
        //保存传过来的商品信息(如果没有，保存是{})
        this.product = product || {}
    }
    render(){
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        //用来接收级联分类ID的数组
        const categorys = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categorys.push(categoryId)
            }else{
                categorys.push(pCategoryId)
                categorys.push(categoryId)
            }
            
        }
        const title = (
            <span>
               <LinkButton onClick={()=> this.props.history.goBack()}><ArrowLeftOutlined style={{fontSize:20}}/></LinkButton>
               <span style={{marginLeft:15}}>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        const formItemLayout = {
                labelCol:{span:2},
                wrapperCol:{span:8}
        }
        
        return (
            <div>
                <Card title={title}>
                    <Form 
                       {...formItemLayout}
                       name='add-update'
                       onFinish={this.onFinish}
                       initialValues={{
                         name:product.name,
                         desc:product.desc,
                         price:product.price,
                         categorys:categorys
                       }}
                    > 
                       <Item
                         name="name"
                         label="商品名称"
                         rules={[
                            {
                              required: true,
                              message: '商品名称不能为空！',
                            },
                          ]}
                       >
                          <Input placeholder='请输入商品名称'/>
                       </Item>
                       <Item
                         name="desc"
                         label="商品描述"
                         rules={[
                            {
                              required: true,
                              message: '商品描述不能为空！',
                            },
                          ]}
                       >
                          <TextArea placeholder='请输入商品描述' autoSize/>
                       </Item>
                       <Item
                         name="price"
                         label="商品价格"
                         rules={[
                            {
                              required: true,
                              message: '请输入商品价格！',
                            },
                            {
                                validator:(rule, value) => {
                                    if (value*1<0) {
                                        return Promise.reject('价格必须大于0!');
                                    }else{
                                        return Promise.resolve()
                                    }
                                }
                            }
                          ]}
                       >
                          <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
                       </Item>
                       <Item
                         name="categorys"
                         label="商品分类"
                         rules={[
                            {
                              required: true,
                              message: '商品分类不能为空！',
                            },
                          ]}
                       >
                          <Cascader
                             placeholder="请指定商品分类"
                             options={this.state.options}//需要显示的列表数据
                             loadData={this.loadData} //当选择某个列表项，加载下一级列表的监听回调
                          />
                       </Item>
                       <Item
                         name="imgs"
                         label="商品图片"
                       >
                          <PicturesWall ref={this.wallRef} imgs={imgs}/>
                       </Item>
                       <Item
                         name="detail"
                         label="商品详情"
                         labelCol={{span:2}}
                         wrapperCol={{span:20}}
                       >
                          <RichTextDitor ref={this.editorRef} detail={detail}/>
                       </Item>
                          <Button type='primary' htmlType='submit'>提交</Button>
                    </Form>
                </Card>
            </div>
        )
    }
}