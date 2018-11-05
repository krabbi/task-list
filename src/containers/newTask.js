import React, { Component } from 'react';
import TaskForm from '../components/taskForm';
import Task from '../components/task';
import '../styles/taskForm.css';

class NewTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: null
        }
        this.previewTask = this.previewTask.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    previewTask (task) {
        this.setState({task})
    }
    submitForm(formData) {
        fetch("https://uxcandy.com/~shapoval/test-task-backend/create?developer=alexander", {
            body: formData,
            method: "post"
        }).then(res => res.json())
        .then(result => {
            if(result.status === 'ok') {
                this.props.history.push('/')
            } else {
                alert('Something went wrong: ' + result.message);
            }
        });
    }
    render() {
        const task = this.state.task;
        return (
            <div className="task-form-container">
                <TaskForm previewTask={this.previewTask} submitForm={this.submitForm}/>
                {task ? <Task task={task}/> : ''}
            </div>
        );
    }
}

export default NewTask;
