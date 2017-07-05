import * as React from 'react';

import { IHaplotype } from '../AveHaplotypesDataSource';

interface IProps {
    haplotype: IHaplotype;
}

export const HaplotypeInfo = ({haplotype}: IProps) => {
    const accessions = haplotype.accessions.map(
        (d, i) => <li key={i}>{d}</li>
    );
    return (
        <div>
            <div>Haplotype identifier: {haplotype.haplotype_id}</div>
            <div>Variants in current region: {haplotype.variants.length}</div>
            <h2>Accessions</h2>
            <ol>
                {accessions}
            </ol>
        </div>
    );
};
