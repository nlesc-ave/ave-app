import { History } from 'history';
import * as React from 'react';
import { withRouter } from 'react-router';

import PileupRoot from 'pileup/dist/main/Root';
import { VisualizedTrack  } from 'pileup/dist/main/Root';
import { GenomeRange, IRootProps, IRootState } from 'pileup/dist/main/Root';
import VisualizationWrapper from 'pileup/dist/main/VisualizationWrapper';

import { AccessionsMenu } from './components/AccessionsMenu';
import { Controls } from './Controls';
import { AveHaplotypesDataSource } from './sources/AveHaplotypesDataSource';
import { HaplotypeTree } from './viz/HaplotypeTree';

import './Root.css';

interface IProps extends IRootProps {
    history: History;
    match: any;
    location: any;
    genome: IGenome;
}

class RootWithoutHistory extends PileupRoot<IProps, IRootState> {
    handleRangeChange(newRange: GenomeRange) {
        const path = this.props.match.path
            .replace(':genome_id', this.props.match.params.genome_id)
            .replace(':chrom_id', newRange.contig)
            .replace(':start_position', newRange.start + '')
            .replace(':end_position', newRange.stop + '')
        ;
        this.props.history.replace(path);
        super.handleRangeChange(newRange);
    }

    componentDidUpdate(_prevProps: IProps, _prevState: IRootState) {
        const a: GenomeRange = this.props.initialRange;
        const b = this.state.range;
        if (a && b && (a.contig !== b.contig || a.start !== b.start || a.stop !== b.stop)) {
            super.handleRangeChange(this.props.initialRange);
        }
    }

    makeDivForTrack(key: string, track: VisualizedTrack) {
        const trackEl = (
            <VisualizationWrapper
                visualization={track.visualization}
                range={this.state.range}
                onRangeChange={this.handleRangeChange.bind(this)}
                source={track.source}
                referenceSource={this.props.referenceSource}
            />
        );

        const trackName = track.track.name || '(track name)';

        let gearIcon = null;
        const settingsMenu = null;
        if (track.visualization.component.getOptionsMenu) {
            gearIcon = (
                <span
                        ref={'gear-' + key}
                        className="gear"
                        onClick={this.toggleSettingsMenu.bind(this, key)}
                >
                    ⚙
                </span>
            );
        }

        // TODO copy settingMenu from pileup/Root

        let trackLegend = null;
        if (track.visualization.component.displayName === 'haplotype') {
            trackLegend = <HaplotypeTree source={track.source as AveHaplotypesDataSource} width={150}/>;
            gearIcon = (
                <AccessionsMenu
                    accessions={this.props.genome.accessions}
                    source={track.source as AveHaplotypesDataSource}
                />
            );
        }

        const className = [
            'track',
            track.visualization.component.displayName || '',
            track.track.cssClass || ''
        ].join(' ');
        return (
            <div key={key} className={className}>
                <div className="track-label">
                    <span>{trackName}{gearIcon}</span>
                    <br/>
                    {settingsMenu}
                    {trackLegend}
                </div>
                <div className="track-content">
                    {trackEl}
                </div>
            </div>
        );
    }

    render() {
        const trackEls = this.props.tracks.map((t, i) => this.makeDivForTrack('' + i, t));
        return (
            <div id="pileup">
                <Controls
                    chromosomes={this.props.genome.chromosomes}
                    range={this.state.range}
                    onChange={this.handleRangeChange.bind(this)}
                />
                <div className="pileup-root">
                    <div className="track controls">
                        <div className="track-label">
                            &nbsp;
                        </div>
                    </div>
                    {trackEls}
                </div>
            </div>
        );
    }
}

export const Root = withRouter(RootWithoutHistory);
