import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/taskContainer.css';
import TaskList from '../components/taskList';
import { getQueryParams, updateQueryStringParameter, generateSignature } from '../utils'
import { TOKEN } from '../constants'

class TaskContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      pagesCount: 1,
      sortField: '',
      sortDirection: '',
      page: '',
      isAdmin: false
    }
    this.updateTask = this.updateTask.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate() {
    this.fetchData();
  }
  fetchData() {
    const queryParams = getQueryParams(this.props.location.search);
    const sortField = queryParams.sort_field || 'id';
    const sortDirection = queryParams.sort_direction || 'asc';
    const page = queryParams.page || '1';
    if(this.state.sortField === sortField && this.state.sortDirection === sortDirection && this.state.page === page) {
      return;
    }
    this.setState({
      sortField,
      sortDirection,
      page
    });
    fetch(`https://uxcandy.com/~shapoval/test-task-backend/?developer=alexander&sort_field=${sortField}&sort_direction=${sortDirection}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== 'ok' || !data.message) {
          alert('Something went wrong: ' + data.message);
        }
        const {tasks, total_task_count: totalTaskCount} = data.message;
        const pagesCount = Math.max(Math.ceil(totalTaskCount / 3), 1);
        this.setState({
          tasks,
          pagesCount
        })
      });

  }
  updateTask(task) {
    if (!this.props.isAdmin || !task.id) {
      return;
    }
    const formData = new FormData();

    formData.append("text", task.text);
    formData.append("status", task.status);
    formData.append("token", TOKEN);
    formData.append("signature", generateSignature({status: task.status, text: task.text}, TOKEN));
    fetch(`https://uxcandy.com/~shapoval/test-task-backend/edit/${task.id}/?developer=alexander`, {
          body: formData,
          method: "post"
      })
      .then(res => res.json())
      .then(data => {
        if (data.status !== 'ok') {
          alert('Something went wrong: ' + data.message);
          return;
        }
        const tasks = this.state.tasks.slice(0);
        const updatedTask = tasks.find((el) => el.id === task.id);
        updatedTask.text = task.text;
        updatedTask.status = task.status;
        this.setState({
          tasks
        });
      });

  }
  render() {
    const queryString = this.props.location.search;
    const pages = [];
    for (let i = 1; i <= this.state.pagesCount; i++) {
        pages.push(<Link to={updateQueryStringParameter(queryString, 'page', i)} className="pagination-bar__page" key={i}>{i}</Link>);
    };
    return (

      <div className="task-container">
        <div className="task-container__sorting-bar">
          <div className="sorting-bar__section">Sort by:
            <Link to={updateQueryStringParameter(queryString, 'sort_field', 'id')}>Id</Link>
            <Link to={updateQueryStringParameter(queryString, 'sort_field', 'username')}>Username</Link>
            <Link to={updateQueryStringParameter(queryString, 'sort_field', 'email')}>Email</Link>
            <Link to={updateQueryStringParameter(queryString, 'sort_field', 'status')}>Status</Link>
          </div>
          
          <div className="sorting-bar__section">Sort direction:
            <Link to={updateQueryStringParameter(queryString, 'sort_direction', 'asc')}>Ascending</Link>
            <Link to={updateQueryStringParameter(queryString, 'sort_direction', 'desc')}>Descending</Link>
          </div>
        </div>
        <TaskList tasks={this.state.tasks} isAdmin={this.props.isAdmin} updateTask={this.updateTask}></TaskList>
        <div className="task-container__pagination-bar">
            {pages}
        </div>
      </div>
    );
  }
}

export default TaskContainer;
