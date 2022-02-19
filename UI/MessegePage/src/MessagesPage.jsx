
const N = 5;

class MessagesPage extends React.Component {

    constructor(props) {
        super(props);
        this.handle_send_message = this.handle_send_message.bind(this);
        this.fetch_messages = this.fetch_messages.bind(this);
        this.state = {
            show: "Messages",
            messages: [],
            allMessages: [],
            posts: [],
            token: "",
            id: -1
        };
    }

    async componentDidMount() {
        if (await this.fetch_is_logged_in()) {
            await this.fetch_posts();
            const messages = await this.fetch_messages();
            if (!messages) return;
            messages.sort((m1, m2) => {
                if (m1.date < m2.date) return 1; else if (m1.data === m2.date) return 0; else return -1;
            });
            if (messages.length < N) this.update_list(messages); else this.update_list(messages.slice(0, N));

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
            }
            this.setState({token: token,
            id: data.id})
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
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            data.forEach(message => {
                message.date = new Date(message.date).toLocaleDateString();
            })
            this.setState({allMessages: data});
            return data;
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    async handle_send_message() {
        const text = document.querySelector('#postText').value;
        const id = document.querySelector('#recipientId').value;
        if (await this.fetch_send_message(text, id))
            this.setState({show: "Messages"})
        else this.setState({show: "SendMessage"})
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
                'Content-Type': 'application/json',
            }
        });

        if (response.status !== 200) {
            const err = await response.text();
            alert(err);
            return false;
        }

        return true;
    }

    async fetch_posts() {
        const data = JSON.parse(document.cookie);
        const response = await fetch('/api/post/user', {
            method: 'GET',
            headers: {
                'authorization': data.token,
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            const posts = await response.json();
            this.setState({
                posts: posts
            });
            return posts
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        switch (this.state.show) {
            case "Messages":
                return React.createElement('div', null,
                    <NavigationBar/>,
                    <Indicators userId={this.state.id} messages={this.state.allMessages} posts={this.state.posts}/>,
                    React.createElement('div', null, this.state.messages.map((item) => {
                            return React.createElement(Messages, {
                                text: item.text,
                                date: item.date
                            });
                        }),
                        <button className={'button'} onClick={() => {
                            this.setState({show: "SendMessage"})
                        }}>Send new message</button>
                    )
                )
            case "SendMessage":
                return <div>
                    <NavigationBar/>,
                    <Indicators userId={this.state.id} messages={this.state.allMessages} posts={this.state.posts}/>,
                    <div>
                        <div>Please write the text of your message</div>
                        <textarea id={'postText'}/>
                    </div>
                    <div>
                        <label>Please enter the recipients id</label>
                        <input id={'recipientId'}/>
                    </div>
                    <button className={'button'} id={'postButton'} onClick={this.handle_send_message}>Send!</button>
                </div>
        }
    }
}