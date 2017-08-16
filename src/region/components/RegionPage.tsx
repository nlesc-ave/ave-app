import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import * as pileup from 'pileup/dist/main/pileup';
import { Track } from 'pileup/dist/main/Root';
import { Gene } from 'pileup/dist/main/viz/GeneTrack';
import { RouteComponentProps } from 'react-router';

import { SideBar } from '../../components/SideBar';
import { Searcher } from '../../search/components/Searcher';
import { AveFeature } from '../AveFeature';
import { AveFeaturesDataSource } from '../AveFeaturesDataSource';
import { AveGenesDataSource } from '../AveGenesDataSource';
import { AveHaplotypesDataSource } from '../haplotype/AveHaplotypesDataSource';
import { HAPLOTYPE_HEIGHT } from '../haplotype/components/HaplotypeTrack';
import { haplotypes } from '../haplotype/haplotypes';
import { FeatureDialog } from './FeatureDialog';
import { GeneDialog } from './GeneDialog';
import { RegionCanvas } from './RegionCanvas';

import 'pileup/style/pileup.css';
import './RegionPage.css';

interface IParams {
   genome_id: string;
   chrom_id: string;
   start_position: string;
   end_position: string;
}

export interface IStateProps {
    apiroot: string;
    flank: number;
}

type IProps = RouteComponentProps<IParams> & IStateProps;

interface IState {
    genome?: IGenome;
    menuOpen: boolean;
    selectedGene?: Gene;
    selectedFeature?: IFeatureAnnotation;
}

export class RegionPage extends React.Component<IProps, IState> {
    variantDataSource: AveHaplotypesDataSource;
    genesDataSource: AveGenesDataSource;
    featuresDataSource: AveFeaturesDataSource;
    state: IState = {menuOpen: false};

    componentDidMount() {
        this.fetchGenome();
        this.variantDataSource = new AveHaplotypesDataSource(this.props.match.params.genome_id, this.props.apiroot);
        this.genesDataSource = new AveGenesDataSource(this.props.match.params.genome_id, this.props.apiroot);
        this.featuresDataSource = new AveFeaturesDataSource(this.props.match.params.genome_id, this.props.apiroot);
    }

    fetchGenome() {
        fetch(`${this.props.apiroot}/genomes/${this.props.match.params.genome_id}`)
            .then<IGenome>((response) => response.json())
            .then((genome) => this.setState({ genome }))
        ;
    }

    onMenuToggle = () => this.setState({menuOpen: !this.state.menuOpen});

    onGeneClick = (genes: Gene[]) => {
        this.setState({selectedGene: genes[0]});
    }

    onFeatureClick = (feature: AveFeature) => {
        this.setState({selectedFeature: feature.annotation});
    }

    onCloseGeneDialog = () => {
        this.setState({
           selectedGene: undefined
        });
    }

    onCloseFeatureDialog = () => {
        this.setState({
           selectedFeature: undefined
        });
    }

    render() {
        const match = this.props.match;
        const { genome, menuOpen } = this.state;
        if (!genome) {
            return <div>Loading ...</div>;
        }
        const menuButton = <IconButton onTouchTap={this.onMenuToggle}><NavigationMenu /></IconButton>;
        const searchButton = (
            <Searcher
                genome_id={genome.genome_id}
                flank={this.props.flank}
                apiroot={this.props.apiroot}
            />
        );
        const range = {
            contig: match.params.chrom_id,
            start: Number.parseInt(match.params.start_position),
            stop: Number.parseInt(match.params.end_position)
        };

        const sources: Track[] = this.addDefaultTracks(genome);
        this.addGeneTrack(genome, sources);
        this.addFeatureTrack(genome, sources);
        this.addHaplotypeTrack(sources, genome.accessions.length);
        const vizTracks = sources.map((track) => {
            const source = track.data;
            return {visualization: track.viz, source, track};
        });

        const title = 'Allelic Variation Explorer: ' + match.params.genome_id;
        const dialog = this.renderDialog();
        return (
            <div>
                <AppBar
                    title={title}
                    iconElementLeft={menuButton}
                    iconElementRight={searchButton}
                />
                <SideBar open={menuOpen} onToggle={this.onMenuToggle}/>
                {dialog}
                <RegionCanvas
                    referenceSource={vizTracks[0].source}
                    tracks={vizTracks}
                    initialRange={range}
                    genome={genome}
                />
            </div>
        );
    }

    absoluteUrl(path: string) {
        if (path.startsWith('http') || path.startsWith('/')) {
            return path;
        }
        return `${this.props.apiroot}/${path}`;
    }

    addDefaultTracks(genome: IGenome) {
        return [{
            data: pileup.formats.twoBit({
                url: this.absoluteUrl(genome.reference)
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
        }];
    }

    addGeneTrack(genome: IGenome, sources: Track[]) {
        if ('gene_track' in genome) {
            sources.push({
                data: pileup.formats.bigBed({
                    url: this.absoluteUrl(genome.gene_track)
                }),
                name: 'Genes',
                viz: pileup.viz.genes({
                    onGeneClicked: this.onGeneClick
                })
            });
        } else {
            sources.push({
                data: this.genesDataSource,
                name: 'Genes',
                viz: pileup.viz.genes({
                    onGeneClicked: this.onGeneClick
                })
            });
        }
    }

    addFeatureTrack(genome: IGenome, sources: Track[]) {
        if ('feature_types' in genome && genome.feature_types.length > 0) {
            sources.push({
                data: this.featuresDataSource,
                name: 'Features',
                viz: pileup.viz.features({
                    onFeatureClicked: this.onFeatureClick
                })
            });
        }
    }

    addHaplotypeTrack(sources: Track[], nr_accessions: number) {
        sources.push({
            cssClass: 'normal',
            data: this.variantDataSource,
            height: nr_accessions * HAPLOTYPE_HEIGHT,
            name: 'Haplotypes',
            viz: haplotypes()
        });
    }

    renderDialog() {
        let dialog;
        if (this.state.selectedGene) {
            dialog = (
                <GeneDialog
                    gene={this.state.selectedGene}
                    onClose={this.onCloseGeneDialog}
                />
            );
        } else if (this.state.selectedFeature) {
            dialog = (
                <FeatureDialog
                    feature={this.state.selectedFeature}
                    onClose={this.onCloseFeatureDialog}
                />
            );
        }
        return dialog;
    }
}
