import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import * as pileup from 'pileup/dist/main/pileup';
import { RouteComponentProps } from 'react-router';

import IconButton from 'material-ui/IconButton';
import { Root } from '../Root';
import { Searcher } from '../Searcher';
import { SideBar } from '../SideBar';
import { AveHaplotypesDataSource } from '../sources/AveHaplotypesDataSource';
import { haplotypes } from '../viz/haplotypes';

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
}

export class RegionPage extends React.Component<IProps, IState> {
    variantDataSource: AveHaplotypesDataSource;
    state: IState = {menuOpen: false};

    componentDidMount() {
        this.fetchGenome();
        this.variantDataSource = new AveHaplotypesDataSource(this.props.match.params.genome_id, this.props.apiroot);
    }

    fetchGenome() {
        fetch(`${this.props.apiroot}/genomes/${this.props.match.params.genome_id}`)
            .then<IGenome>((response) => response.json())
            .then((genome) => this.setState({ genome }))
        ;
    }

    onMenuToggle = () => this.setState({menuOpen: !this.state.menuOpen});

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
                padding={this.props.flank}
                apiroot={this.props.apiroot}
            />
        );
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
                url: genome.gene_track
            }),
            name: 'Genes',
            viz: pileup.viz.genes()
        }, {
            cssClass: 'normal',
            data: this.variantDataSource,
            name: 'Haplotypes',
            viz: haplotypes()
        }];
        const vizTracks = sources.map((track) => {
            const source = track.data;
            return {visualization: track.viz, source, track};
        });
        const title = 'Allelic Variation Explorer: ' + match.params.genome_id;
        return (
            <div>
                <AppBar
                    title={title}
                    iconElementLeft={menuButton}
                    iconElementRight={searchButton}
                />
                <SideBar open={menuOpen} onToggle={this.onMenuToggle}/>
                <Root referenceSource={vizTracks[0].source} tracks={vizTracks} initialRange={range} genome={genome}/>
            </div>
        );
    }
}
