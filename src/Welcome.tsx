import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import { Card, CardText, CardTitle } from 'material-ui/Card';

import { RangeStepper } from './RangeStepper';

export const Welcome = () => (
    <div>
        <AppBar title="Allelic Variation Explorer" showMenuIconButton={false} />
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
