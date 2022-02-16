"use strict";

const N = 5;

class MessagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.handle_send_message = this.handle_send_message.bind(this);
        this.state = {
            show: "Messages",
            messages: [],
            token: "",
            id: -1
        };
    }

    async componentDidMount() {
        if (await this.fetch_is_logged_in()) {
            const messages = await this.fetch_messages();
            if (!messages) return;
            messages.sort((m1, m2) => {
                if (m1.date < m2.date) return 1;else if (m1.data === m2.date) return 0;else return -1;
            });
            if (messages.length < N) this.update_list(messages);else this.update_list(messages.slice(0, N));
        }
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

    update_list(messages) {
        this.setState({
            messages: messages
        });
    }

    async fetch_messages() {
        const data = JSON.parse(document.cookie);
        const response = await fetch('/api/message/user', {
            method: 'GET',
            headers: {
                'authorization': data.token,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            return data;
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    async handle_send_message() {
        const text = document.querySelector('#postText').value;
        const id = document.querySelector('#recipientId').value;
        if (await this.fetch_send_message(text, id)) this.setState({
            show: "Messages"
        });else this.setState({
            show: "SendMessage"
        });
    }

    async fetch_send_message(text, id) {
        const data = JSON.parse(document.cookie);
        const response = await fetch('/api/message/user', {
            method: 'PUT',
            body: JSON.stringify({
                recipient: id,
                text: text
            }),
            headers: {
                'authorization': data.token,
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            const err = await response.text();
            alert(err);
            return false;
        }

        return true;
    }

    render() {
        switch (this.state.show) {
            case "Messages":
                return React.createElement('div', null, React.createElement(NavigationBar, null), React.createElement('div', null, this.state.messages.map(item => {
                    return React.createElement(Messages, {
                        text: item.text,
                        date: item.date
                    });
                }), /*#__PURE__*/React.createElement("button", {
                    className: 'button',
                    onClick: () => {
                        this.setState({
                            show: "SendMessage"
                        });
                    }
                }, "Send new message")));

            case "SendMessage":
                return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(NavigationBar, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Please write the text of your message"), /*#__PURE__*/React.createElement("input", {
                    id: 'postText'
                })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Please enter the recipients id"), /*#__PURE__*/React.createElement("input", {
                    id: 'recipientId'
                })), /*#__PURE__*/React.createElement("button", {
                    className: 'button',
                    id: 'postButton',
                    onClick: this.handle_send_message
                }, "Post!"));
        }
    }

}