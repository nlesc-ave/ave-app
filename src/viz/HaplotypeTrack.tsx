import * as React from 'react';

import * as dataCanvas from 'data-canvas';
import ContigInterval from 'pileup/dist/main/ContigInterval';
import * as style from 'pileup/dist/main/style';
import * as canvasUtils from 'pileup/dist/main/viz/canvas-utils';
import * as d3utils from 'pileup/dist/main/viz/d3utils';
import {AveDataSource} from '../sources/AveDataSource';

interface IGenomeRange {
    contig: string;
    start: number;  // inclusive
    stop: number;  // inclusive
}

interface IProps {
    source: AveDataSource;
    width: number;
    height: number;
    range: IGenomeRange;
    referenceSource: any;
    options: any;
}

export class HaplotypeTrack extends React.Component<IProps, {}> {
    canvas: Element;

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.canvasRefHandler = this.canvasRefHandler.bind(this);

    }

    componentDidUpdate() {
        this.updateVisualization();
    }

    componentDidMount() {
        this.updateVisualization();
    }

    onClick() {
        // TODO
    }

    render() {
        return <canvas onClick={this.onClick} ref={this.canvasRefHandler}/>;
    }

    updateVisualization() {
        const {width, height} = this.props;
        // Hold off until height & width are known.
        if (width === 0) {
            return;
        }
        d3utils.sizeCanvas(this.canvas, width, height);
        const ctx = canvasUtils.getContext(this.canvas);
        const dtx = dataCanvas.getDataContext(ctx);
        this.renderScene(dtx);
    }

    renderScene(ctx: any) {
        const range = this.props.range;
        const interval = new ContigInterval(range.contig, range.start, range.stop);
        const haplotypes = this.props.source.getFeaturesInRange(interval);
        const scale = this.getScale();
        const height = this.props.height;
        const y = height - style.VARIANT_HEIGHT - 1;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.reset();
        ctx.save();

        ctx.fillStyle = style.VARIANT_FILL;
        ctx.strokeStyle = style.VARIANT_STROKE;
        haplotypes.forEach((haplotype) => {
            ctx.pushObject(haplotype);
            const x = Math.round(scale(haplotype.position));
            const width = Math.round(scale(haplotype.position + 100)) - 1 - x;
            ctx.fillRect(x - 0.5, y - 0.5, width, style.VARIANT_HEIGHT);
            ctx.strokeRect(x - 0.5, y - 0.5, width, style.VARIANT_HEIGHT);
            ctx.popObject();
        });

        ctx.restore();
    }

    getScale() {
        return d3utils.getTrackScale(this.props.range, this.props.width);
    }

    canvasRefHandler(ref: Element) {
        this.canvas = ref;
    }

}
