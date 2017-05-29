import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';

export const AboutPage = () => {
    const backButton = <IconButton href="/" tooltip="Back to start"><NavigationBack /></IconButton>;
    return (
        <div>
            <AppBar title="Allelic Variation Explorer: About" iconElementLeft={backButton} />
            <Paper style={{ width: '100%', maxWidth: 700, margin: 'auto', marginTop: 10 }}>
                <a href="https://www.esciencecenter.nl">
                    <img
                        src="https://www.esciencecenter.nl/img/cdn/logo_escience_center.png"
                        alt="Netherlands eScience Center"
                    />
                </a>
            </Paper>
        </div>
    );
};
