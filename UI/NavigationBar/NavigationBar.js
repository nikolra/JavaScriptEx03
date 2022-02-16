"use strict";

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.handle_log_out = this.handle_log_out.bind(this);
        const show = this.props.id === 0 ? "Admin" : "User";
        this.state = {
            token: "",
            id: -1,
            show: show,
            HomePageUrl: "",
            MessengerUrl: "",
            AboutUrl: "",
            AdminUrl: ""
        };
    }

    async componentDidMount() {
        await this.fetch_is_logged_in();
        const home_page_url = "http://localhost:2718/HomePage/HomePage.html?token=" + this.state.token;
        const about_url = "http://localhost:2718/About/About.html?token=" + this.state.token// + "&id=" + this.state.id;
        const messenger_url = "http://localhost:2718/MessegePage/MessegePage.html?token=" + this.state.token;
        const admin_url = "http://localhost:2718/AdminPage/AdminPage.html?token=" + this.state.token;
        const show = this.state.id === 0 ? "Admin" : "User";
        this.setState({
            HomePageUrl: home_page_url,
            MessengerUrl: messenger_url,
            AboutUrl: about_url,
            AdminUrl: admin_url,
            show: show
        });
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

    async handle_log_out() {
        const response = await fetch('/api/user/logoff', {
            method: 'PUT',
            headers: {
                'authorization': this.state.token,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if (response.status !== 200) {
            const err = await response.text();
            alert(err);
        }
        else window.location.href = "http://localhost:2718/Login/Login.html";
    }

    render() {
        switch (this.state.show) {
            case "User":
                return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.HomePageUrl
                }, "Home"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.MessengerUrl
                }, "Messenger"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AboutUrl
                }, "About"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
                    onClick: this.handle_log_out
                }, "Logout"))), /*#__PURE__*/React.createElement("br", null));

            case "Admin":
                return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.HomePageUrl
                }, "Home"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.MessengerUrl
                }, "Messenger"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AdminUrl
                }, "Admin"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AboutUrl
                }, "About"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
                    onClick: this.handle_log_out
                }, "Logout"))), /*#__PURE__*/React.createElement("br", null));
        }
    }

}