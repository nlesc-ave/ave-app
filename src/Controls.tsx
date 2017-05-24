import * as React from 'react';

import IconButton from 'material-ui/IconButton';
import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ZoomOut from 'material-ui/svg-icons/action/zoom-out';
import NextWindow from 'material-ui/svg-icons/av/fast-forward';
import PrevWindow from 'material-ui/svg-icons/av/fast-rewind';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { GenomeRange } from 'pileup/dist/main/Root';

import { RangeSelector } from './RangeSelector';

interface IProps {
    chromosomes: IChromosome[];
    range: GenomeRange;
    onChange(newRange: GenomeRange): void;
}

export class Controls extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.onNexWindowClick = this.onNexWindowClick.bind(this);
        this.onZoomInClick = this.onZoomInClick.bind(this);
        this.onZoomOutClick = this.onZoomOutClick.bind(this);
        this.onPrevWindowClick = this.onPrevWindowClick.bind(this);
    }

    onPrevWindowClick() {
        const {contig, start, stop} = this.props.range;
        const windowSize = stop - start;
        const newRange = {
            contig,
            start: start - windowSize,
            stop: stop - windowSize
        };
        this.props.onChange(newRange);
    }

    onZoomInClick() {
        const {contig, start, stop} = this.props.range;
        const windowSize = Math.floor((stop - start) / 4);
        const newRange = {
            contig,
            start: start + windowSize,
            stop: stop - windowSize
        };
        this.props.onChange(newRange);
    }

    onZoomOutClick() {
        const {contig, start, stop} = this.props.range;
        const windowSize = stop - start;
        const newRange = {
            contig,
            start: start - windowSize,
            stop: stop + windowSize
        };
        this.props.onChange(newRange);
    }

    onNexWindowClick() {
        const {contig, start, stop} = this.props.range;
        const windowSize = stop - start;
        const newRange = {
            contig,
            start: start + windowSize,
            stop: stop + windowSize
        };
        this.props.onChange(newRange);
    }

    render() {
        const {range , chromosomes} = this.props;
        if (!range) {
            return <Toolbar/>;
        }
        return (
            <Toolbar>
                <RangeSelector chromosomes={chromosomes} range={range} onChange={this.props.onChange}/>
                <ToolbarGroup>
                    <IconButton tooltip="Back 1 window" onTouchTap={this.onPrevWindowClick}><PrevWindow/></IconButton>
                    <IconButton tooltip="Zoom in" onTouchTap={this.onZoomInClick}><ZoomIn/></IconButton>
                    <IconButton tooltip="Zoom out" onTouchTap={this.onZoomOutClick}><ZoomOut/></IconButton>
                    <IconButton tooltip="Forward 1 window" onTouchTap={this.onNexWindowClick}><NextWindow/></IconButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}
