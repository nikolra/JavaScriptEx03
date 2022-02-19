
class Post extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return <div className={"post"}>
            <div className={"postData"}>
                {this.props.text}
            </div>
            <div className={"postData"}>
                {this.props.date}
            </div>
        </div>
    }
}