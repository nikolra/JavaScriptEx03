"use strict";

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            id: -1
        };
    }

    async componentDidMount() {
        await this.fetch_is_logged_in();
    }

    async fetch_is_logged_in() {
        const href = window.location.href;
        const url = href.split('?');
        let token = url[1];
        token = token.split('=')[1];
        const response = await fetch('/api/user/isLogin', {
            method: 'POST',
            body: JSON.stringify({
                token: token
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if (response.status === 200) {
            const data = {
                token: token,
                id: await response.json()
            };
            this.setState({
                token: token,
                id: data.id
            });
            document.cookie = JSON.stringify(data);
            return true;
        }

        window.location.href = "http://localhost:2718/Login/Login.html";
        return false;
    }

    render() {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(NavigationBar, {
            token: this.state.token,
            id: this.state.id
        }), "Date: 16/02/2022 " + '\n' +
            "Exercise #3 in JavaScript Course " + '\n' +
            "Nikol Rafalovich 208001693 nikolra@mta.ac.il");
    }

}