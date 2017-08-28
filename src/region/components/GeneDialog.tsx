import * as React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Gene } from 'pileup/dist/main/viz/GeneTrack';

import { GeneInfo } from './GeneInfo';

interface IProps {
    gene: Gene;
    regionUrl: string;
    onClose(): void;
}

export const GeneDialog = ({gene, regionUrl, onClose}: IProps) => {
    const actions = [
        (
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={onClose}
            />
        )
    ];
    return (
        <Dialog title="Gene information" open={true} onRequestClose={onClose} actions={actions}>
            <GeneInfo gene={gene} regionUrl={regionUrl}/>
        </Dialog>
    );
};
