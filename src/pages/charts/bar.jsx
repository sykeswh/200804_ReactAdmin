import React,{Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
/* 
柱形图路由
*/
export default class Bar extends Component{
    state = {
        sales:[5, 20, 36, 10, 10, 20],
        stock:[7, 10, 16, 30, 10, 10]
    }
    update = () =>{
        this.setState(state =>({
            sales:state.sales.map(sale => sale +1),
            stock:state.stock.reduce((pre,store)=>{
                pre.push(store-1)
                return pre
            },[])
        }))
    }
    getOption = (sales,stock) =>{
         return {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量','库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            },{
                name: '库存',
                type: 'bar',
                data: stock
            }]
        }
    }
    render(){
        const {sales,stock} = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图一'>
                    <ReactEcharts option={this.getOption(sales,stock)}/>
                </Card>
            </div>
        )
    }
}