import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export const RegionViewer = ({ match }: any) => {
    const closeButton = <IconButton href="#/" tooltip="Back to start"><NavigationClose /></IconButton>;
    return (
        <div>
            <AppBar title="Allelic Variation Explorer: Region viewer" iconElementLeft={closeButton} />
            <ul>
                <li>Genome: {match.params.genome_id}</li>
                <li>Chromsome: {match.params.chrom_id}</li>
                <li>Start: {match.params.start_position}</li>
                <li>End: {match.params.end_position}</li>
            </ul>
        </div>
    );
};
