import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
    }
    submitForm(e) {
        e.preventDefault();
        const login = this.login.current.value;
        const password = this.password.current.value ;
        this.login.current.value = '';
        this.password.current.value = '';
        this.props.processLogin(login, password);
    }
    render() {
        this.login = React.createRef();
        this.password = React.createRef();
        return <header className="header">
            <Link to="/" className="header__logo">Task List<br/> Application</Link>
            <Link to="/new" className="header__addTask">
                Add Task
            </Link>
            {this.props.isAdmin ? <span>admin</span> : (<form className="login-form" onSubmit={this.submitForm}>
                <input type="text" name="login" ref={this.login} placeholder="Login"></input><br/>
                <input type="password" name="password" ref={this.password} placeholder="Password"></input><br/>
                <button>Login</button>
            </form>)}
            
        </header>
    }
}

export default Header;
