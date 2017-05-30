import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router-dom';

export interface IStateProps {
    apiroot: string;
    flank: number;
}

export interface IDispatchProps {
    saveSettings(apiRoot: string, flank: number): void;
}

type IProps = IDispatchProps & IStateProps;
// mirror of state props so they can be changed locally and saveSettings on submit
type IState = IStateProps;

export class SettingsPage extends React.Component<IProps, IState> {
    state: IState = {
        apiroot: '',
        flank: 0
    };

    constructor(props: IProps) {
        super(props);
        this.state.apiroot = props.apiroot;
        this.state.flank = props.flank;
    }

    // If settings are changed outside component then update internal state to it
    componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            apiroot: nextProps.apiroot,
            flank: nextProps.flank
        });
    }

    onSubmit = () => {
        if (this.props.apiroot !== this.state.apiroot || this.props.flank !== this.state.flank) {
            this.props.saveSettings(
                this.state.apiroot,
                this.state.flank
            );
        }
    }

    onApirootChange = (_e: any, apiroot: string) => this.setState({apiroot});
    onFlankChange = (_e: any, flank: string) => this.setState({ flank: parseInt(flank, 10) });

    render() {
        const {apiroot, flank} = this.state;
        const backButton = (
            <IconButton containerElement={<Link to="/"/>} tooltip="Back to start">
                <NavigationBack />
            </IconButton>
        );
        return (
            <div>
                <AppBar title="Allelic Variation Explorer: Settings" iconElementLeft={backButton} />
                <Paper style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: 10, padding: 10 }}>
                    <TextField
                        floatingLabelText="Allelic Variation Explorer web service root (URL)"
                        fullWidth={true}
                        value={apiroot}
                        onChange={this.onApirootChange}
                    />
                    <br />
                    <TextField
                        floatingLabelText="Flank region size (bp)"
                        fullWidth={true}
                        type="number"
                        value={flank}
                        onChange={this.onFlankChange}
                    />
                    <br />
                    <RaisedButton label="Save" primary={true} onTouchTap={this.onSubmit}/>
                </Paper>
            </div>
        );
    };
}
