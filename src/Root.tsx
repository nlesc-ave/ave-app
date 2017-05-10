import * as React from 'react';

import Controls from 'pileup/dist/main/Controls';
import PileupRoot from 'pileup/dist/main/Root';
import VisualizationWrapper from 'pileup/dist/main/VisualizationWrapper';
import { AveVariantsDataSource } from './sources/AveVariantsDataSource';
import { HaplotypeTree } from './viz/HaplotypeTree';

import './Root.css';

interface VizWithOptions {
    component: any;
    options?: object;
}

interface Track {
    viz: VizWithOptions;
    data: object;  // This is a DataSource object
    name?: string;
    cssClass?: string;
    isReference?: boolean;
}

interface VisualizedTrack {
    visualization: VizWithOptions;
    source: object;  // data source
    track: Track;  // for css class and options
}

export class Root extends PileupRoot {
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
            trackLegend = <HaplotypeTree source={track.source as AveVariantsDataSource} width={150}/>;
        }

        const className = [
            'track',
            track.visualization.component.displayName || '',
            track.track.cssClass || ''
        ].join(' ');
        return (
            <div key={key} className={className}>
                <div className="track-label">
                    <span>{trackName}</span>
                    <br/>
                    {gearIcon}
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
                <div className="pileup-root">
                    <div className="track controls">
                    <div className="track-label">
                        &nbsp;
                    </div>
                    <div className="track-content">
                        <Controls
                            contigList={this.state.contigList}
                            range={this.state.range}
                            onChange={this.handleRangeChange.bind(this)}
                        />
                    </div>
                    </div>
                    {trackEls}
                </div>
            </div>
        );
    }
}
