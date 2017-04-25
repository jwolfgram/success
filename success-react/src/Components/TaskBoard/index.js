import {checkbox as mdcCheckbox} from 'material-components-web';
import React, { Component } from 'react';

export default class TaskBoard extends Component {
    constructor(props) {
        super(props)
        this.state = { activeTab: 2 };
    }

    componentDidMount(){
        console.log('loaded')
    }

    render() {
        return (
            <div className="demo-tabs">
                <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
                    <Tab>Starks</Tab>
                    <Tab>Lannisters</Tab>
                    <Tab>Targaryens</Tab>
                </Tabs>
                <section>
                    <div className="content">Content for the tab: {this.state.activeTab}</div>
                </section>
            </div>
        );
    }
}
