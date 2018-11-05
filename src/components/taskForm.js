import React, { Component } from 'react';
import {dataURItoBlob} from '../utils';
import '../styles/taskForm.css';
import { MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from '../constants'

class TaskForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            previewSrc: ''
        };
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.previewTaskFunction = this.previewTaskFunction.bind(this);
    }
    handleImageUpload(e){
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.onload = () => {
                const canvas = document.createElement('canvas');

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_IMAGE_WIDTH) {
                    height *= MAX_IMAGE_WIDTH / width;
                    width = MAX_IMAGE_WIDTH;
                    }
                } else {
                    if (height > MAX_IMAGE_HEIGHT) {
                    width *= MAX_IMAGE_HEIGHT / height;
                    height = MAX_IMAGE_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                const dataurl = canvas.toDataURL("image/png");
                this.setState({
                    previewSrc: dataurl,
                    imageBlob: dataURItoBlob(dataurl)
                });
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
    validateForm() {
        if(this.form.current.reportValidity()) {
            return true;
        }
        if(this.username.current.checkValidity() && this.email.current.checkValidity() && this.text.current.checkValidity() && !this.state.imageBlob) {
            alert('Please select an image');
        }
    }
    handleSubmitForm(e) {
        e.preventDefault();
        if(this.validateForm()) {
            var formData = new FormData();
            formData.append("username", this.username.current.value);
            formData.append("email", this.email.current.value);
            formData.append("text", this.text.current.value);
            formData.append("image", this.state.imageBlob);
            this.props.submitForm(formData);
        }

    }
    previewTaskFunction(e) {
        e.preventDefault();
        if(!this.validateForm()) {
            return;
        };
        this.props.previewTask({
            username: this.username.current.value,
            email: this.email.current.value,
            text: this.text.current.value,
            image_path: this.state.previewSrc
        });
    }
    render() {
        this.form = React.createRef();
        this.username = React.createRef();
        this.email = React.createRef();
        this.text = React.createRef();
        const imagePreview = this.state.previewSrc;
        
        return (
            <form name="test" className="task-form" ref={this.form} onSubmit={this.handleSubmitForm}>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" name="username" ref={this.username} required></input>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" name="email" ref={this.email} required pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"></input>
                <label htmlFor="text">Text</label>
                <textarea id="text" name="text" rows="10" cols="70" ref={this.text} required></textarea>
                <label htmlFor="image" className="task-form__image-selector">Select an image...</label>
                <input id="image" type="file" name="image" hidden accept="image/x-png,image/gif,image/jpeg" 
                    onChange={this.handleImageUpload} required></input>
                {imagePreview ? <img src={imagePreview} alt="Preview"></img> : ''}
                <div className="button-group">
                    <button type="submit">Add task</button>
                    <button onClick={this.previewTaskFunction}>Preview</button>
                </div>
            </form>
        );
    }
}

export default TaskForm;
