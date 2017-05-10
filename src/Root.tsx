import * as React from 'react';

import Controls from 'pileup/dist/main/Controls';
import PileupRoot from 'pileup/dist/main/Root';

import './Root.css';

export class Root extends PileupRoot {
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
