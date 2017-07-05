import * as React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FileDownload from 'material-ui/svg-icons/file/file-download';

import { IHaplotype } from '../AveHaplotypesDataSource';
import { HaplotypeInfo } from './HaplotypeInfo';

interface IProps {
    haplotype: IHaplotype;
    sequenceUrl: string;
    onClose(): void;
}

export const HaplotypeDialog = ({haplotype, onClose, sequenceUrl}: IProps) => {
    const actions = [
        (
            <FlatButton
                label="Sequence"
                icon={<FileDownload/>}
                href={sequenceUrl}
                target="_blank"
            />
        ), (
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={onClose}
            />
        )
    ];
    return (
        <Dialog title="Haplotype information" open={true} onRequestClose={onClose} actions={actions}>
            <HaplotypeInfo haplotype={haplotype}/>
        </Dialog>
    );
};
