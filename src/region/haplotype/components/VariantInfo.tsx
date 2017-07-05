import * as React from 'react';

import { IVariant } from '../AveHaplotypesDataSource';

interface IProps {
    variant: IVariant;
}

export const VariantInfo = ({variant}: IProps) => {
    const alts = variant.alt.map((d, i) => <li key={i}>{d}</li>);
    return (
        <div>
            <div>Identifier: {variant.id}</div>
            <div>Position: {variant.pos}</div>
            <div>Reference: {variant.ref}</div>
            <h3>Alternatives</h3>
            <ol>
                {alts}
            </ol>
            <div>Quality score: {variant.qual}</div>
            <div>Passed filters: {variant.filter}</div>
            <div>Description: {variant.info}</div>
            <div>Sample fields: {variant.format}</div>
            <div>Samples: {variant.samples}</div>
        </div>
    );
};
