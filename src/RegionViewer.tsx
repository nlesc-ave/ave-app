import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';
import ActionSearch from 'material-ui/svg-icons/action/search';
import * as pileup from 'pileup/dist/main/pileup';
import { RouteComponentProps } from 'react-router';

import { Root } from './Root';
import { AveVariantsDataSource, IHaplotype, IVariant } from './sources/AveVariantsDataSource';
import { HaplotypeTrack } from './viz/HaplotypeTrack';

import 'pileup/style/pileup.css';
import './RegionViewer.css';

interface IParams {
   genome_id: string;
   chrom_id: string;
   start_position: string;
   end_position: string;
}

interface IState {
    genome: IGenome;
}

export class RegionViewer extends React.Component<RouteComponentProps<IParams>, IState> {
    variantDataSource: AveVariantsDataSource;

    constructor(props: RouteComponentProps<IParams>) {
        super(props);
    }

    componentDidMount() {
        this.fetchGenome();
        this.variantDataSource = new AveVariantsDataSource(this.props.match.params.genome_id);
    }

    fetchGenome() {
        fetch(`/api/genomes/${this.props.match.params.genome_id}`)
            .then<IGenome>((response) => response.json())
            .then((genome) => this.setState({ genome }))
        ;
    }

    render() {
        if (!this.state) {
            return <div>Loading ...</div>;
        }
        const closeButton = <IconButton href="/" tooltip="Back to start"><NavigationBack /></IconButton>;
        const searchButton = <IconButton tooltip="Search"><ActionSearch /></IconButton>;
        const match = this.props.match;
        const genome = this.state.genome;
        // TODO when server is online use dynamic range
        const range = {
            contig: match.params.chrom_id,
            start: Number.parseInt(match.params.start_position),
            stop: Number.parseInt(match.params.end_position)
        };
        const sources = [{
            data: pileup.formats.twoBit({
                url: genome.reference
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
        }, {
            data: pileup.formats.bigBed({
                url: genome.genes
            }),
            name: 'Genes',
            viz: pileup.viz.genes()
        }, {
            cssClass: 'normal',
            data: this.variantDataSource,
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
        return (
            <div>
                <AppBar
                    title="Allelic Variation Explorer: Region viewer"
                    iconElementLeft={closeButton}
                    iconElementRight={searchButton}
                />
                <p>
                    Genome: {match.params.genome_id},
                    Chromsome: {match.params.chrom_id},
                    Start: {match.params.start_position},
                    End: {match.params.end_position}
                </p>
                <Root referenceSource={vizTracks[0].source} tracks={vizTracks} initialRange={range} genome={genome}/>
            </div>
        );
    }
}
