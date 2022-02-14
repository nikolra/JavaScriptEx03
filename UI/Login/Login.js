"use strict";

class LoginUser extends React.Component {

    constructor(props) {
        super(props);
        this.handle_Login = this.handle_Login.bind(this);
        this.handle_register = this.handle_register.bind(this);
    }

    async componentDidMount() {
        const data = JSON.parse(document.cookie);
        const response = await fetch('/api/user/isLogin', {
            method: 'POST',
            body: JSON.stringify({
                token: data.token,
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if (response.status === 200) {
            window.location.href = "http://localhost:2718/HomePage/HomePage.html?token=" + data.token;
        }
    }

    async handle_Login() {
        const email_container = document.querySelector('#emailField');
        const email = email_container.value;
        const password_container = document.getElementById('passwordField');
        const password = password_container.value;
        const response = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            document.cookie = JSON.stringify(data);
            window.location.href = "http://localhost:2718/HomePage/HomePage.html?token=" + data.token;
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    handle_register() {
        window.location.href = "http://localhost:2718/Register/Register.html";
    }

    render() {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Email"), /*#__PURE__*/React.createElement("input", {
            id: 'emailField'
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Password"), /*#__PURE__*/React.createElement("input", {
            id: 'passwordField',
            type: 'password'
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            onClick: this.handle_Login
        }, "Login"), /*#__PURE__*/React.createElement("button", {
            onClick: this.handle_register
        }, "Register")));
    }

}