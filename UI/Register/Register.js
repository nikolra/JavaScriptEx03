"use strict";

class LoginUser extends React.Component {
    constructor(props) {
        super(props);
        this.handle_register = this.handle_register.bind(this);
    }

    async handle_register() {
        const email = document.querySelector('#emailField').value;
        const password = document.querySelector('#passwordField').value;
        const full_name = document.querySelector('#fullNameField').value;
        const response = await fetch('/api/admin/user', {
            method: 'POST',
            body: JSON.stringify({
                full_name: full_name,
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            window.location.href = '/Login/Login.html';
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Full Name"), /*#__PURE__*/React.createElement("input", {
            id: 'fullNameField'
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Email"), /*#__PURE__*/React.createElement("input", {
            id: 'emailField'
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Password"), /*#__PURE__*/React.createElement("input", {
            id: 'passwordField',
            type: 'password'
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            onClick: this.handle_register
        }, "Register")));
    }

}