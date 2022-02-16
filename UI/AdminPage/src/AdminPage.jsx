
class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.handle_approve = this.handle_approve.bind(this);
        this.handle_Message_all = this.handle_Message_all.bind(this);
        this.handle_delete_or_suspend = this.handle_delete_or_suspend.bind(this);
        this.handle_activate_user = this.handle_activate_user.bind(this);
        this.state = {
            token: "",
            show: "AdminPage"
        };
    }

    async componentDidMount() {
        await this.fetch_is_logged_in()

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
            if(data.id !== 0)
                window.location.href = "http://localhost:2718/Login/Login.html";
            document.cookie = JSON.stringify(data);
            return true;
        }

        window.location.href = "http://localhost:2718/Login/Login.html";
        return false;
    }

    async fetch_approve() {
        const id = document.querySelector('#userToApprove').value;
        const response = await fetch('/api/admin/approve', {
            method: 'PUT',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'authorization': JSON.parse(document.cookie).token,
                'Content-Type': 'application/json; charset=utf-8'}

        });
        if(response.status !== 202) {
            const err = await response.text();
            alert(err);
        }
        else {
            window.location.href = "http://localhost:2718/AdminPage/AdminPage.html?token=" + JSON.parse(document.cookie).token;
        }
    }

    handle_approve() {
        this.setState({show: "Approve"});
    }

    async fetch_Message_all() {
        const message = document.querySelector('#messageText').value;
        const response = await fetch('/api/admin/user/message', {
            method: 'POST',
            body: JSON.stringify({
                message: message
            }),
            headers: {
                'authorization': JSON.parse(document.cookie).token,
                'Content-Type': 'application/json; charset=utf-8'}

        });
        if(response.status !== 202) {
            const err = await response.text();
            alert(err);
        }
        else {
            window.location.href = "http://localhost:2718/AdminPage/AdminPage.html?token=" + JSON.parse(document.cookie).token;
        }
    }

    handle_Message_all() {
        this.setState({show: "MessageAll"});
    }

    async fetch_delete() {
        const id = document.querySelector('#userToDeleteOrSuspend').value;
        const response = await fetch('/api/admin/get_user', {
            method: 'DELETE',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'authorization': JSON.parse(document.cookie).token,
                'Content-Type': 'application/json; charset=utf-8'}

        });
        if(response.status !== 200) {
            const err = await response.text();
            alert(err);
        }
        else {
            window.location.href = "http://localhost:2718/AdminPage/AdminPage.html?token=" + JSON.parse(document.cookie).token;
        }
    }

    handle_delete_or_suspend() {
        this.setState({show: "DeleteOrSuspend"});
    }

    async fetch_suspend() {
        const id = document.querySelector('#userToDeleteOrSuspend').value;
        const response = await fetch('/api/admin/user/suspend', {
            method: 'PUT',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'authorization': JSON.parse(document.cookie).token,
                'Content-Type': 'application/json; charset=utf-8'}

        });
        if(response.status !== 200) {
            const err = await response.text();
            alert(err);
        }
        else {
            window.location.href = "http://localhost:2718/AdminPage/AdminPage.html?token=" + JSON.parse(document.cookie).token;
        }
    }

    async fetch_activate_user() {
        const id = document.querySelector('#userToActivate').value;
        const response = await fetch('/api/admin/get_user', {
            method: 'PUT',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'authorization': JSON.parse(document.cookie).token,
                'Content-Type': 'application/json; charset=utf-8'}

        });
        if(response.status !== 200) {
            const err = await response.text();
            alert(err);
        }
        else {
            window.location.href = "http://localhost:2718/AdminPage/AdminPage.html?token=" + JSON.parse(document.cookie).token;
        }
    }

    handle_activate_user() {
        this.setState({show: "Activate"});
    }

    render() {
        switch (this.state.show) {
            case("AdminPage"):
                return <div>
                    <NavigationBar />
                    <button className={'button'} onClick={this.handle_approve} >Approve user</button>
                    <button className={'button'} onClick={this.handle_Message_all}>Send message to all users</button>
                    <button className={'button'} onClick={this.handle_delete_or_suspend}>Delete or Suspend a user</button>
                    <button className={'button'} onClick={this.handle_activate_user}>Activate suspended user</button>
                </div>
            case("Approve"):
                return <div>
                    <NavigationBar />
                    <label>insert the id of the user to approve </label>
                    <input id={'userToApprove'}/>
                    <button className={'button'} onClick={this.fetch_approve} >Approve</button>
                </div>
            case("MessageAll"):
                return <div>
                    <NavigationBar />
                    <label>insert the message</label>
                    <input id={'messageText'}/>
                    <button className={'button'} onClick={this.fetch_Message_all} >Send</button>
                </div>
            case("DeleteOrSuspend"):
                return <div>
                    <NavigationBar />
                    <div>
                        <label>insert the id of the user</label>
                        <input id={'userToDeleteOrSuspend'}/>
                    </div>
                    <div>
                        <button className={'button'} onClick={this.fetch_delete} >Delete</button>
                        <button className={'button'} onClick={this.fetch_suspend} >Suspend</button>
                    </div>
                </div>
            case("Activate"):
                return <div>
                    <NavigationBar />
                    <label>insert the id of the user to activate</label>
                    <input id={'userToActivate'}/>
                    <button className={'button'} onClick={this.fetch_activate_user} >Activate</button>
                </div>
        }
    }
}