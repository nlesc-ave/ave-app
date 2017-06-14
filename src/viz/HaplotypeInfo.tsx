import * as React from 'react';

import FlatButton from 'material-ui/FlatButton';
import FileDownload from 'material-ui/svg-icons/file/file-download';

import { IHaplotype } from '../sources/AveVariantsDataSource';

interface IProps {
    haplotype: IHaplotype;
}

export const HaplotypeInfo = ({haplotype}: IProps) => {
    const accessions = haplotype.accessions.map(
        (d, i) => <li key={i}>{d}<FlatButton label="Sequence" icon={<FileDownload/>} disabled={true}/></li>
    );
    return (
        <div>
            <div>Haplotype identifier: {haplotype.id}</div>
            <div>Variants in current region: {haplotype.variants.length}</div>
            <h2>Accessions</h2>
            <ol>
                {accessions}
            </ol>
        </div>
    );
};
