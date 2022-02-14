
class Post extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                {className: 'postText', id: 'text'},
                this.props.text
            ),
            React.createElement(
                'div',
                {className: 'postDate', id: 'date'},
                this.props.date
            )
        );
    }
}