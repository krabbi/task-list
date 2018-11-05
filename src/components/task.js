import React, { Component } from 'react';
import '../styles/task.css';

class Task extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskText: this.props.task.text,
            taskStatus: this.props.task.status,
            editMode:  false
        }

        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.finishTask = this.finishTask.bind(this);
    }
    toggleEdit() {
        if(this.props.isAdmin) {
            const editMode = !this.state.editMode;
            this.setState({
                editMode,
                taskText: this.props.task.text,
                taskStatus: this.props.task.status,
            });
        };
    }
    handleChange(event) {
        this.setState({taskText: event.target.value});
    }
    saveTask(e) {
        if (e) {
            e.preventDefault();
        }
        this.setState({editMode: false});
        const task = Object.assign({}, this.props.task);
        task.text = this.state.taskText;
        task.status = this.state.taskStatus;
        this.props.updateTask(task);
    }
    finishTask(e) {
        this.setState({
            taskStatus: 10
        }, () => this.saveTask());
    }
    render() {
        const {email, username, image_path: image} = this.props.task;
        const {taskText, taskStatus} = this.state;
        const taskClass = `task ${taskStatus === 10 ? 'task--done' : ''}`;
        const altText = username + '\'s image';
        let content;

        if (this.state.editMode) {
            content = (
                <React.Fragment>
                    <textarea value={taskText} className="task__textarea" onChange={this.handleChange}></textarea>
                    <button onClick={this.saveTask}>Save</button>
                    <img src={image} alt={altText}  className="task__image"></img>
                </React.Fragment>
            );
        } else {
            content = (
                <React.Fragment>
                    {this.props.isAdmin && taskStatus !== 10 ? <button onClick={this.finishTask}>Finish</button> : ''}
                    <p><img src={image} alt={altText}  className="task__image"></img>{taskText}</p>
                </React.Fragment>
            )
        }
        return (
            <article className={taskClass}>
                <h2>{taskStatus === 10 ? '✔ ' : ''}{username} - {email}</h2>
                {this.props.isAdmin ? <button onClick={this.toggleEdit}>Edit</button> : ''}
                {content}
            </article>
        );
    }
}

export default Task;
