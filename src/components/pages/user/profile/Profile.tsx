import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { toast } from "react-toastify";
import { toast_config } from "../../../../config/toast.config";

const origin_url_be = 'http://localhost:3000';

export function UserProfile(props: any) {
    const [isShowBoxUpload, SetIsShowBoxUpload] = useState(false);

    const showBoxUpload = async () => {
        SetIsShowBoxUpload(!isShowBoxUpload);
    }

    const changeWallpaper = async () => {
        SetIsShowBoxUpload(!isShowBoxUpload);
    }

    return (
        <div className='userprofile'>
            <div className='userprofile__header'>
                <div className='userprofile__wallpaper'>
                    <img src={props.user.wallpaper} alt="" />
                    <div onClick={changeWallpaper}>
                        <FontAwesomeIcon icon={faCamera} />
                    </div>
                </div>
                <div className='userprofile__avatar'>
                    <div className='userprofile__avatar-1'>
                        <img src={props.avatar !== '' ? props.avatar : props.user.avatar} alt="" />
                        <div onClick={showBoxUpload}>
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                    </div>
                    <div className='userprofile__avatar-2'>
                        <span>{props.user.fullname}</span>
                        <span>{props.user.role}</span>
                    </div>
                </div>
            </div>
            {isShowBoxUpload && <BoxUploadImage user={props.user} loadDataUser={props.loadDataUser} showBoxUpload={showBoxUpload} changeAvatar={props.changeAvatar} />}
        </div>
    );
}


function BoxUploadImage(props: any) {
    const [image, SetImage] = useState(props.user.avatar);
    const [file, SetFile] = useState(null);

    const uploadFile = (event: any) => {
        SetImage(URL.createObjectURL(event.target.files[0]));
        SetFile(event.target.files[0]);

    }

    const changeAvatar = async () => {
        if (file) {
            props.changeAvatar(image);

            const form_data = new FormData();

            form_data.append('file', file);

            fetch(`${origin_url_be}/api/user/update?avatar=1`, {
                method: 'put',
                headers: {
                    'Authorization': `bearer ${sessionStorage.getItem("access_token")}`,
                },
                body: form_data,
            }).then((response) => {
                response.json().then((data) => {
                    if (data.success) {
                        toast.success(data.message.toString(), toast_config);
                        SetImage(data.result);
                    } else {
                        toast.warn(data.message.toString(), toast_config);
                    }
                })
            });

            props.showBoxUpload();
            props.loadDataUser();
        }
    }

    return (
        <div className='boxuploadimage'>
            <label className='uploadimage' htmlFor="upload-image">
                <input type="file" name='upload-image' id='upload-image' onChange={uploadFile} />
                <span className='button button-upload'>Tải hình ảnh</span>
            </label>
            <div id='uploadimage-preview'>
                <img src={image} alt="" />
            </div>
            <button className='button button-oke' onClick={changeAvatar}>Đặt làm avatar</button>
        </div>
    );
}