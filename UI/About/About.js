"use strict";

class About extends React.Component {
    constructor(props) {
        super(props);
        const href = window.location.href;
        const url = href.split('?');
        const params = url[1].split('&')
        let token = params[0].split('=')[1];
        const id = params[1].split('=')[1];
        this.state = {
            token: token,
            id: id
        };
    }

    async componentDidMount() {}

    render() {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(NavigationBar, {
            token: this.state.token,
            id: this.state.id
        }), "Date: 16/02/2022 Exercise #3 in JavaScript Course Nikol Rafalovich 208001693 nikolra@mta.ac.il");
    }

}