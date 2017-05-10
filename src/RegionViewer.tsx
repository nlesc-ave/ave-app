import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import * as pileup from 'pileup/dist/main/pileup';
import { Root } from './Root';
import { AveVariantsDataSource, IHaplotype, IVariant } from './sources/AveVariantsDataSource';
import { HaplotypeTrack } from './viz/HaplotypeTrack';
import { HaplotypeTree } from './viz/HaplotypeTree';

import 'pileup/style/pileup.css';
import './RegionViewer.css';

export const RegionViewer = ({ match }: any) => {
    const closeButton = <IconButton href="#/" tooltip="Back to start"><NavigationClose /></IconButton>;
    // TODO when server is online use dynamic range
    // const range = {
    //     contig: match.params.chrom_id,
    //     start: match.params.start_position,
    //     stop: match.params.end_position
    // };4,938,381-4,938,899
    const range = {contig: 'SL2.40ch05', start: 4938381, stop: 4938899};
    const variantDataSource = new AveVariantsDataSource(match.params.genome_id);
    const sources = [{
        data: pileup.formats.twoBit({
            // tslint:disable-next-line:no-http-string
            // url: 'http://www.biodalliance.org/datasets/hg19.2bit'
            url: '/api/S_lycopersicum_chromosomes.2.40.2bit'
        }),
        isReference: true,
        name: 'Reference',
        viz: pileup.viz.genome()
    }, {
        data: pileup.formats.empty(),
        name: 'Scale',
        viz: pileup.viz.scale()
    }, {
        data: pileup.formats.empty(),
        name: 'Location',
        viz: pileup.viz.location()
    // }, {
    //     data: pileup.formats.bigBed({
    //         // tslint:disable-next-line:no-http-string
    //         url: 'http://www.biodalliance.org/datasets/ensGene.bb'
    //     }),
    //     name: 'Genes',
    //     viz: pileup.viz.genes()
    }, {
        cssClass: 'normal',
        data: variantDataSource,
        name: 'Haplotypes',
        viz: {component: HaplotypeTrack, options: {
            onVariantClick: (variant: IVariant, haplotype: IHaplotype) => {
                // TODO replace with route change or show pretty dialog
                alert([variant.pos, haplotype.id]);
            }
        }}
    }];
    const vizTracks = sources.map((track) => {
        const source = track.data;
        return {visualization: track.viz, source, track};
    });
    // TODO move instantiation of HaplotypeTree to Root.makeDivForTrack
    return (
        <div>
            <AppBar title="Allelic Variation Explorer: Region viewer" iconElementLeft={closeButton} />
            <p>
                Genome: {match.params.genome_id},
                Chromsome: {match.params.chrom_id},
                Start: {match.params.start_position},
                End: {match.params.end_position}
            </p>
            <Root referenceSource={vizTracks[0].source} tracks={vizTracks} initialRange={range} />
            <HaplotypeTree source={variantDataSource} width={150}/>
        </div>
    );
};
