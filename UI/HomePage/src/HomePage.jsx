
const N = 5;

class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.handle_add_post = this.handle_add_post.bind(this);
        this.handle_post_post = this.handle_post_post.bind(this);
        this.fetch_messages = this.fetch_messages.bind(this);
        this.update_posts = this.update_posts.bind(this);
        const href = window.location.href;
        const url = href.split('?');
        let token = url[1];
        token = token.split('=')[1];
        this.state = {
            posts: [],
            allPosts: [],
            messages: [],
            show: "HomePage",
            Token: token,
            id: -1
        };
    }

    async componentDidMount() {

        if (await this.fetch_is_logged_in()) {
            await this.fetch_messages();
            await this.update_posts()
        }
    }

    async update_posts() {
        const posts = await this.fetch_posts();
        if (!posts) return;
        const first_post = await this.fetch_user_last_post();
        if (!first_post) return;
        first_post.date = new Date(first_post.date).toLocaleDateString();
        posts.splice(posts.indexOf(first_post), 1);
        posts.sort((p1, p2) => {
            if (p1.date < p2.date) return 1; else if (p1.data === p2.date) return 0; else return -1;
        });
        posts.unshift(first_post);
        if (posts.length < N) this.update_list(posts); else this.update_list(posts.slice(0, N));
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
            this.setState({Token: token, id: data.id})
            document.cookie = JSON.stringify(data);
            return true;
        }
        window.location.href = "http://localhost:2718/Login/Login.html";
        return false;
    }

    async fetch_user_last_post() {
        const data = JSON.parse(document.cookie);
        const response = await fetch('/api/admin/get_user', {
            method: 'POST',
            body: JSON.stringify({
                id: data.id
            }),
            headers: {
                'authorization': data.token,
                'Content-Type': 'application/json'

            }
        });

        if (response.status === 200) {
            const user = await response.json();
            return user.posts[user.posts.length - 1];
        } else {
            const err = await response.text();
            alert(err);
        }
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
                allPosts: posts
            });
            posts.forEach(post => {
                post.date = new Date(post.date).toLocaleDateString();
            })
            return posts
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    update_list(posts) {
        this.setState({
            posts: posts
        });
    }

    handle_add_post() {
        this.setState({show: "AddPost"})
    }

    async handle_post_post() {
        const text = document.querySelector('#postText').value;
        if(await this.fetch_post_post(text)) {
            await this.update_posts()
            this.setState({show: "HomePage"})
        }
        else this.setState({show: "AddPost"})
    }

    async fetch_post_post (text){
        const data = JSON.parse(document.cookie);
        const response = await fetch('/api/post/user', {
            method: 'POST',
            body: JSON.stringify({
                post_text: text
            }),
            headers: {
                'authorization': data.token,
                'Content-Type': 'application/json',
            }
        });

        if (response.status !== 202) {
            const err = await response.text();
            alert(err);
            return false;
        }

        await this.fetch_posts()
        return true;
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
            this.setState({messages: await response.json()})
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {

        switch (this.state.show) {
            case "HomePage":
                return React.createElement('div', null,
                    React.createElement(NavigationBar, null),
                    React.createElement('div', null, this.state.posts.map((item) => {
                            return React.createElement(Post, {
                                text: item.text,
                                date: item.date
                            });
                        }),
                        <button className={'button'} onClick={this.handle_add_post}>Add new post</button>
                    )
                )
            case "AddPost":
                return <div>
                    <NavigationBar/>
                    <Indicators userId={this.state.id} messages={this.state.messages} posts={this.state.allPosts}/>
                    <div>Please write the text of your new post</div>
                    <div>
                        <textarea id={'postText'}/>
                    </div>
                    <button className={'button'} id={'postButton'} onClick={this.handle_post_post}>Post!</button>
                </div>
        }
    }
}
