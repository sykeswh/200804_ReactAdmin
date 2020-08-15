import React,{Component} from 'react'
import {EditorState,convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
/* 
用来指定商品详情的富文本编辑器组件
*/
export default class RichTextDitor extends Component{
    static propTypes = {
        detail:PropTypes.string
    }
    constructor(props){
        super(props)
        const html = this.props.detail
        if (html) {//如果有值，根据html格式字符串创建一个对应的编辑对象
           const contentBlock = htmlToDraft(html)
           if (contentBlock) {
               const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
               const  editorState = EditorState.createWithContent(contentState)
               this.state = {
                   editorState
               }
           }
        } else{
                this.state = {
                    editorState:EditorState.createEmpty()  //创建一个没有内容的编辑对象
                }
        }
      }
    /* 
    输入过程中实时的回调
    */
    onEditorStateChange = (editorState) =>{
        this.setState({editorState})
    }
    //返回当前文本
    getDetail = () =>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    //上传图片
    uploadImageCallBack = (file) =>{
        return new Promise((resolve,reject)=>{
            const xhr = new XMLHttpRequest()
            xhr.open('POST','/api/manage/img/upload')
            // xhr.setRequestHeader('Authorization','Client-ID XXXXX')
            const data = new FormData()
            data.append('image',file)
            xhr.send(data)
            xhr.addEventListener('load',()=>{
                const response = JSON.parse(xhr.responseText)
                const url = response.data.url //得到图片的url
                resolve({data:{link:url}})
            })
            xhr.addEventListener('error',()=>{
                const error = JSON.parse(xhr.responseText)
                reject(error)
            })
        })
    }
    render(){
        const {editorState} = this.state
        return (
            <div>
                <Editor
                   editorState={editorState}
                //    wrapperClassName="demo-wrapper"
                //    editorClassName="demo-editor"
                   editorStyle={{border:'1px solid black',minHeight:200,paddingLeft:10}}
                   onEditorStateChange={this.onEditorStateChange}
                   toolbar={{
                       image:{uploadCallback:this.uploadImageCallBack,alt:{present:true,mandatory:true}}
                   }}
                />
            </div>
        )
    }
}