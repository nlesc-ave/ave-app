import * as React from 'react';

import { Gene } from 'pileup/dist/main/viz/GeneTrack';

interface IProps {
    gene: Gene;
}

export const GeneInfo = ({gene}: IProps) => {
    return (
        <div>
            <div>Gene identifier: {gene.geneId}</div>
            <div>Transcript identifier: {gene.id}</div>
            <h3>Name</h3>
            {gene.name}
            <h3>Position</h3>
            {gene.position.contig}:{gene.position.interval.start}-{gene.position.interval.stop}
        </div>
    );
};
