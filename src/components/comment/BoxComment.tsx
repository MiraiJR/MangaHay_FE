import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import './BoxComment.scoped.sass';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";
import { toast_config } from "../../config/toast.config";
import React from "react";
import moment from "moment";
import { Loading, demoAsyncCall } from "../loading/Loading";

const modules = {
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ]
}

const origin_url_be = 'http://localhost:3000';

export class BoxComment extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            comments: [],
            isShowLoading: false,
            is_running: false,
        };
        this.reloadComment = this.reloadComment.bind(this);
    }

    async componentDidMount() {
        this.reloadComment();
    }

    async componentDidUpdate() {
        if (this.props.id_comic && !this.state.is_running) {
            this.reloadComment();
            this.setState({
                is_running: true,
            });
        }
    }

    reloadComment = async () => {
        this.setState({
            isShowLoading: true,
        });

        demoAsyncCall().then(async () => {
            const response = await fetch(`${origin_url_be}/api/comment/${this.props.id_comic}/comments`, {
                method: 'get'
            }).then((response) => response.json());

            this.setState({
                comments: response.result,
                isShowLoading: false,
            });
        })
    }

    render() {
        return (
            <div className="boxcard">
                <div className="boxcard__title">
                    <FontAwesomeIcon icon={faComment} />
                    <span>Bình luận</span>
                </div>
                <div className="boxcard__body">
                    <EditorComment id_comic={this.props.id_comic} addComment={this.reloadComment} />
                    {this.state.isShowLoading && <Loading />}
                    <div id="allcomment">
                        {
                            this.state.comments && this.state.comments.map((ele: any) => (
                                <CommentDetail comment={ele} key={ele.id} reloadComment={this.reloadComment} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function EditorComment(props: any) {
    const [value, setValue] = useState('');

    const getValueInput = async () => {
        if (!sessionStorage.getItem("access_token")) {
            toast.warn('Bạn cần đăng nhập để thực hiện chức năng này!', toast_config);
            return;
        }

        const response = await fetch(`${origin_url_be}/api/comment/${props.id_comic}`, {
            method: "post",
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: value,
            })
        }).then((response) => response.json());

        if (response.success) {
            setValue('');
            await props.reloadComment;
        }
    }

    return (
        <div className="comment__texteditor">
            <ReactQuill modules={modules} theme="snow" value={value} onChange={setValue} />
            <div>
                <button className="button button-comment" onClick={getValueInput}>Đăng</button>
            </div>
        </div>
    );
}

function EditorAnswer(props: any) {
    const [value, setValue] = useState('');

    const getValueInput = async () => {
        if (!sessionStorage.getItem("access_token")) {
            toast.warn('Bạn cần đăng nhập để thực hiện chức năng này!', toast_config);
            return;
        }

        let url_fetch = `${origin_url_be}/api/comment/answer/`;

        if(props.comment.answer_user) {
            url_fetch += props.comment.id_comment;
        }else {
            url_fetch += props.comment.id;
        }

        const response = await fetch(url_fetch, {
            method: "post",
            headers: {
                'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: value,
                answer_user: props.comment.id_user.fullname,
            })
        }).then((response) => response.json());

        if (response.success) {
            setValue('');
            await props.reloadComment;
        }
    }

    return (
        <div className="comment__texteditor">
            <ReactQuill modules={modules} theme="snow" value={value} onChange={setValue} />
            <div>
                <button className="button button-comment" onClick={getValueInput}>Trả lời</button>
            </div>
        </div>
    );
}

function CommentDetail(props: any) {
    const [isShowEditor, SetIsShowEditor] = useState(false);

    const showEditor = () => {
        SetIsShowEditor(!isShowEditor);
    }

    return (
        <div>
            <div className="commentdetail">
                <img className="commentdetail__image" src={props.comment.id_user.avatar} alt="" />
                <div className="commentdetail__body">
                    <div className="bodycomment_name">
                        {props.comment.id_user.fullname} {props.comment.answer_user && <span><span style={{ 'color': 'red' }}>trả lời</span> <strong>{props.comment.answer_user}</strong></span>}
                    </div>
                    <div className="bodycomment_content" dangerouslySetInnerHTML={{ __html: props.comment.content }}>
                    </div>
                    <div className="bodycomment_action">
                        <span>{formateDate(props.comment.updatedAt)}</span>
                        <button className="button button-comment" onClick={showEditor}>Trả lời</button>
                    </div>
                    {
                        isShowEditor &&
                        <EditorAnswer comment={props.comment} reloadComment={props.reloadComment} />
                    }
                    <div className="bodycomment_answer">
                        {
                            props.comment.answer && props.comment.answer.map((ele: any) => (
                                <CommentDetail key={ele.id} comment={ele} />
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    );
}

function formateDate(date: any) {
    return moment(date).format('DD/MM/YYYY hh:mm:ss');
}