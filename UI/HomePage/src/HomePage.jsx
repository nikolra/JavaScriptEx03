
const N = 5;

class HomePage extends React.Component {


    constructor(props) {
        super(props);
        this.handle_add_post = this.handle_add_post.bind(this);
        this.handle_post_post = this.handle_post_post.bind(this);
        this.state = {
            posts: [],
            show: "HomePage"
        };
    }

    async componentDidMount() {

        if (await this.fetch_is_logged_in()) {
            const posts = await this.fetch_posts();
            if (!posts) return;
            const first_post = await this.fetch_user_last_post();
            if (!first_post) return;
            posts.splice(posts.indexOf(first_post), 1);
            posts.sort((p1, p2) => {
                if (p1.date < p2.date) return 1;
                else if (p1.data === p2.date) return 0;
                else return -1;
            });

            posts.unshift(first_post);
            if(posts.length < N)
                this.update_list(posts);
            else this.update_list(posts.slice(0, N));
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
            return user.posts[0];
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
            return await response.json();
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
        if(await this.fetch_post_post(text))
            this.setState({show: "HomePage"})
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

        return true;
    }

    render() {

        switch (this.state.show) {
            case "HomePage":
                return React.createElement('div', null,
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
                    <span>Please write the text of your new post</span>
                    <input id={'postText'}/>
                    <button className={'button'} id={'postButton'} onClick={this.handle_post_post}>Post!</button>
                </div>
        }
    }
}
