import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import { Card, CardText, CardTitle } from 'material-ui/Card';
import { RouteComponentProps } from 'react-router';

import { RangeStepper } from './RangeStepper';
import { SideBar } from './SideBar';

interface IState {
    menuOpen: boolean;
}

export class Welcome extends React.Component<RouteComponentProps<{}>, IState> {

    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {menuOpen: false};
    }

    onMenuToggle = () => this.setState({menuOpen: !this.state.menuOpen});

    render() {
        const { menuOpen } = this.state;
        return (
            <div>
                <AppBar title="Allelic Variation Explorer" onLeftIconButtonTouchTap={this.onMenuToggle}/>
                <SideBar open={menuOpen} onToggle={this.onMenuToggle}/>
                <div style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: 10 }}>

                    <Card>
                        <CardTitle title="Welcome to the Allelic Variation Explorer" />
                        <CardText>
                            Please select a genome region to view.
                            <RangeStepper />
                        </CardText>
                    </Card>
                </div>
            </div>
        );
    }
}
