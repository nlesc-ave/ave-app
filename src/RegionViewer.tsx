import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import * as pileup from 'pileup';
import { Root } from 'pileup/dist/main/Root';

export const RegionViewer = ({ match }: any) => {
    const closeButton = <IconButton href="#/" tooltip="Back to start"><NavigationClose /></IconButton>;
    // TODO when server is online use dynamic range
    // const range = {
    //     contig: match.params.chrom_id,
    //     start: match.params.start_position,
    //     stop: match.params.end_position
    // };
    const range = {contig: 'chr1', start: 4930382, stop: 4946898};
    const sources = [{
        data: pileup.formats.twoBit({
            // tslint:disable-next-line:no-http-string
            url: 'http://www.biodalliance.org/datasets/hg19.2bit'
        }),
        isReference: true,
        name: 'Reference',
        viz: pileup.viz.genome()
    }, {
        data: pileup.formats.empty(),
        name: 'Scale',
        viz: pileup.viz.scale()
    },
    {
        data: pileup.formats.empty(),
        name: 'Location',
        viz: pileup.viz.location()
    }];
    const vizTracks = sources.map((track) => {
        const source = track.data;
        return {visualization: track.viz, source, track};
    });
    return (
        <div>
            <AppBar title="Allelic Variation Explorer: Region viewer" iconElementLeft={closeButton} />
            <ul>
                <li>Genome: {match.params.genome_id}</li>
                <li>Chromsome: {match.params.chrom_id}</li>
                <li>Start: {match.params.start_position}</li>
                <li>End: {match.params.end_position}</li>
            </ul>
            <Root referenceSource={vizTracks[0].source} tracks={vizTracks} initialRange={range} />
        </div>
    );
};
