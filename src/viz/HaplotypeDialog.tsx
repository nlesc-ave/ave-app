import * as React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { IHaplotype } from '../sources/AveVariantsDataSource';
import { HaplotypeInfo } from './HaplotypeInfo';

interface IProps {
    haplotype: IHaplotype;
    onClose(): void;
}

export const HaplotypeDialog = ({haplotype, onClose}: IProps) => {
    const actions = [(
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={onClose}
      />
    )];
    return (
        <Dialog title="Haplotype information" open={true} onRequestClose={onClose} actions={actions}>
            <HaplotypeInfo haplotype={haplotype}/>
        </Dialog>
    );
};
