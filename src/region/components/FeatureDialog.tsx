import * as React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { FeatureInfo } from './FeatureInfo';

interface IProps {
    feature: IFeatureAnnotation;
    onClose(): void;
}

export const FeatureDialog = ({feature, onClose}: IProps) => {
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
        <Dialog title="Feature information" open={true} onRequestClose={onClose} actions={actions}>
            <FeatureInfo feature={feature}/>
        </Dialog>
    );
};
