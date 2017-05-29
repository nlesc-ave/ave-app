import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router-dom';

export const SettingsPage = () => {
    const backButton = (
        <IconButton containerElement={<Link to="/"/>} tooltip="Back to start">
            <NavigationBack />
        </IconButton>
    );
    return (
        <div>
            <AppBar title="Allelic Variation Explorer: Settings" iconElementLeft={backButton} />
            <Paper style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: 10, padding: 10 }}>
                <TextField floatingLabelText="AVE server endpoint" hintText="http://localhost:3000/api"/>
                <br />
                <TextField floatingLabelText="Flank region size(bp)" type="number" hintText="100"/>
            </Paper>
        </div>
    );
};
