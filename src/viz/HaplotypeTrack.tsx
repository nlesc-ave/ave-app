import * as React from 'react';

import * as dataCanvas from 'data-canvas';
import * as style from 'pileup/dist/main/style';
import * as canvasUtils from 'pileup/dist/main/viz/canvas-utils';
import * as d3utils from 'pileup/dist/main/viz/d3utils';
import {AveVariantsDataSource} from '../sources/AveVariantsDataSource';

interface IGenomeRange {
    contig: string;
    start: number;  // inclusive
    stop: number;  // inclusive
}

interface IProps {
    source: AveVariantsDataSource;
    width: number;
    height: number;
    range: IGenomeRange;
    referenceSource: any;
    options: any;
}

const VARIANT_FILL = 'red';
const VARIANT_RADIUS = 7;
const HAPLOTYPE_HEIGHT = 16;
const HAPLOTYPE_STROKE = 'darkgrey';
const HAPLOTYPE_PADDING = 4;
const containerStyles = {height: '100%'};

export class HaplotypeTrack extends React.Component<IProps, {}> {
    static displayName = 'pileup';
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
        this.props.source.on('newdata', this.updateVisualization.bind(this));
    }

    onClick() {
        // TODO
    }

    render() {
        return (
            <div style={containerStyles}>
                <canvas onClick={this.onClick} ref={this.canvasRefHandler}/>
            </div>
        );
    }

    updateVisualization() {
        const {width} = this.props;
        // Hold off until height & width are known.
        if (width === 0) {
            return;
        }
        const height = this.props.source.haplotypes.length * (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING);
        // console.log(height);
        d3utils.sizeCanvas(this.canvas, width, height);
        const ctx = canvasUtils.getContext(this.canvas);
        const dtx = dataCanvas.getDataContext(ctx);
        this.renderScene(dtx);
    }

    renderScene(ctx: dataCanvas.DataCanvasRenderingContext2D ) {
        const range = this.props.range;
        const haplotypes = this.props.source.haplotypes;
        const scale = this.getScale();

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.reset();
        ctx.save();

        ctx.fillStyle = style.VARIANT_FILL;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const haplotypeWidth = Math.round(scale(range.stop) - scale(range.start));
        haplotypes.forEach((haplotype, index) => {
            ctx.pushObject(haplotype);

            ctx.strokeStyle = HAPLOTYPE_STROKE;
            const yOffset = index * (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING);
            ctx.strokeRect(0, yOffset, haplotypeWidth, HAPLOTYPE_HEIGHT);

            // Number of accessions in haplotype
            ctx.strokeText(haplotype.accessions.length.toString(), 2, yOffset + Math.round(HAPLOTYPE_HEIGHT / 2));

            haplotype.variants.forEach((variant) => {
                ctx.pushObject(variant);
                // TODO choose fill style on type of variant
                ctx.fillStyle = VARIANT_FILL;
                ctx.beginPath();
                // TODO remove range.start when variant.pos is from real dataset
                const xCenter = scale(range.start + variant.pos);
                const yCenter = yOffset + Math.round(HAPLOTYPE_HEIGHT / 2);
                ctx.arc(xCenter, yCenter, VARIANT_RADIUS, 0, 2 * Math.PI);
                ctx.fill();
                ctx.popObject();
            });
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
