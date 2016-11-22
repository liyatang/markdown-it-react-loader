import React from 'react';
import ReactDOM from 'react-dom';
import ReadMe from '../README.md';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    render() {
        return (
            <ReadMe/>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById('appContainer'));