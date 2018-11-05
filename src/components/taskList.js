import React, { Component } from 'react';
import '../styles/taskList.css'
import Task from './task'

class TaskList extends Component {
    render() {
        const tasks = this.props.tasks;
        const isThereSomeTasks = !!tasks.length;
        return (
            <div className="task-container__tasks">
                {isThereSomeTasks ? tasks.map(task => <Task task={task} key={task.id} isAdmin={this.props.isAdmin} updateTask={this.props.updateTask}></Task>) : <div className='tasks__empty'>No tasks</div>}
            </div>
        );
    }
}

export default TaskList;
