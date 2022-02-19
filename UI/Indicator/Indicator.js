"use strict";

class Indicators extends React.Component {
    constructor(props) {
        super(props);
        this.fetch_is_logged_in = this.fetch_is_logged_in.bind(this);
        this.state = {
            token: "",
            id: -1,
            post: false,
            message: false,
            messages: [],
            posts: []
        };
    }

    async CheckPosts() {
        const token = this.state.token;
        const response = await fetch('/api/post/user', {
            method: 'GET',
            headers: {
                'authorization': token,
                'Content-Type': 'application/json'
            }
        });
        const posts = await response.json();
        const lastStatePost = this.props.posts;

        if (lastStatePost !== []) {
            if (posts.length > lastStatePost.length) {
                this.setState(() => ({
                    post: true,
                    posts: posts
                }));
            }
        } else {
            this.setState(() => ({
                post: false
            }));
        }
    }

    async CheckMessages() {
        const token = this.state.token;
        const response = await fetch('/api/message/user', {
            method: 'GET',
            headers: {
                'authorization': token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const lastMessagesState = this.state.messages;
        if (lastMessagesState !== []) if (data.length !== lastMessagesState.length) this.setState(() => ({
            message: true,
            messages: data
        }));else this.setState(() => ({
            message: false
        }));
    }

    async componentDidMount() {
        await this.fetch_is_logged_in();
        this.setState((state, props) => ({
            messages: this.props.messages,
            posts: this.props.posts
        }));
        setInterval(() => {
            this.fetch_is_logged_in();
            this.CheckPosts();
            this.CheckMessages();
        }, 10000);
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
        return /*#__PURE__*/React.createElement("div", {
            className: "indicatorsWrap"
        }, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
            href: "/HomePage/HomePAge.html?token=" + this.state.token
        }, /*#__PURE__*/React.createElement("svg", {
            className: 'indicator',
            xmlns: "http://www.w3.org/2000/svg",
            width: "30",
            height: "30",
            viewBox: "0 0 16 16"
        }, /*#__PURE__*/React.createElement("path", {
            d: "M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"
        }), /*#__PURE__*/React.createElement("path", {
            d: "M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"
        })), /*#__PURE__*/React.createElement("svg", {
            display: this.state.post ? 'inline' : 'none',
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            className: "bi-bi-record-fill",
            viewBox: "0 0 16 16"
        }, /*#__PURE__*/React.createElement("path", {
            d: "M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"
        }))), /*#__PURE__*/React.createElement("a", {
            href: "/MessegePage/MessegePage.html?token=" + this.state.token
        }, /*#__PURE__*/React.createElement("svg", {
            className: 'indicator',
            xmlns: "http://www.w3.org/2000/svg",
            width: "30",
            height: "30",
            viewBox: "0 0 16 16"
        }, /*#__PURE__*/React.createElement("path", {
            d: "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
        })), /*#__PURE__*/React.createElement("svg", {
            display: this.state.message ? 'inline' : 'none',
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            className: "bi-bi-record-fill",
            viewBox: "0 0 16 16"
        }, /*#__PURE__*/React.createElement("path", {
            d: "M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"
        })))));
    }

}