"use strict";

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        const show = this.props.id === 0 ? "Admin" : "User";
        this.state = {
            show: show,
            HomePageUrl: "",
            MessengerUrl: "",
            AboutUrl: ""
        };
    }

    async componentDidMount() {
        const home_page_url = "http://localhost:2718/HomePage/HomePage.html?token=" + this.props.token;
        const about_url = "http://localhost:2718/About/About.html?token=" + this.props.token + "&id=" + this.props.id;
        const messenger_url = "http://localhost:2718/MessegePage/MessegePage.html?token=" + this.props.token;
        this.setState({
            HomePageUrl: home_page_url,
            MessengerUrl: messenger_url,
            AboutUrl: about_url
        });
    }

    render() {
        ///TODO: 1. implement logout as a button
        /// 2.implement About
        /// 3. recieve user id
        switch (this.state.show) {
            case "User":
                return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.HomePageUrl
                }, "Home")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.MessengerUrl
                }, "Messenger")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AboutUrl
                }, "About")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AboutUrl
                }, "Logout"))), /*#__PURE__*/React.createElement("br", null));

            case "Admin":
                return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.HomePageUrl
                }, "Home")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.MessengerUrl
                }, "Messenger")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.MessengerUrl
                }, "Admin")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AboutUrl
                }, "About")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
                    href: this.state.AboutUrl
                }, "Logout"))), /*#__PURE__*/React.createElement("br", null));
        }
    }

}