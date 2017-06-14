import * as React from 'react';

import * as dataCanvas from 'data-canvas';
import * as canvasUtils from 'pileup/dist/main/viz/canvas-utils';
import * as d3utils from 'pileup/dist/main/viz/d3utils';

import {AveVariantsDataSource, IHaplotype, IVariant} from '../sources/AveVariantsDataSource';
import { HaplotypeDialog } from './HaplotypeDialog';
import { VariantDialog } from './VariantDialog';

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
    options: {};
}

interface IState {
    selectedVariant?: IVariant;
    selectedHaplotype?: IHaplotype;
}

const VARIANT_FILL = 'red';
const VARIANT_RADIUS = 7;
const HAPLOTYPE_TOP_MARGIN = 20;
export const HAPLOTYPE_HEIGHT = 16;
const HAPLOTYPE_STROKE = 'darkgrey';
const HAPLOTYPE_FILL = 'white';
export const HAPLOTYPE_PADDING = 4;
const containerStyles = {height: '100%'};

export class HaplotypeTrack extends React.Component<IProps, IState> {
    static displayName = 'haplotype';
    canvas: Element;

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.canvasRefHandler = this.canvasRefHandler.bind(this);
        this.state = {};
    }

    componentDidUpdate() {
        this.updateVisualization();
    }

    componentDidMount() {
        this.props.source.on('newdata', this.updateVisualization.bind(this));
    }

    onClick(reactEvent: any) {
        const ev = reactEvent.nativeEvent;
        const x = ev.offsetX;
        const y = ev.offsetY;
        const ctx = canvasUtils.getContext(this.canvas);
        const trackingCtx = new dataCanvas.ClickTrackingContext(ctx, x, y);
        this.renderScene(trackingCtx);

        if (trackingCtx.hit) {
            if (trackingCtx.hit.length === 2) {
                this.setState({
                    selectedHaplotype: trackingCtx.hit[1],
                    selectedVariant: trackingCtx.hit[0]
                });
            } else {
                this.setState({
                    selectedHaplotype: trackingCtx.hit[0]
                });
            }
        }
    }

    onCloseHaplotypeDialog = () => {
        this.setState({
           selectedHaplotype: undefined
        });
    }

    onCloseVariantDialog = () => {
        this.setState({
           selectedHaplotype: undefined,
           selectedVariant: undefined
        });
    }

    render() {
        let dialog;
        if (this.state.selectedVariant && this.state.selectedHaplotype) {
            dialog = (
                <VariantDialog
                    variant={this.state.selectedVariant}
                    haplotype={this.state.selectedHaplotype}
                    onClose={this.onCloseVariantDialog}
                />
            );
        } else if (this.state.selectedHaplotype) {
            dialog = (
                <HaplotypeDialog
                    haplotype={this.state.selectedHaplotype}
                    onClose={this.onCloseHaplotypeDialog}
                />
            );
        }
        return (
            <div style={containerStyles}>
                <canvas onClick={this.onClick} ref={this.canvasRefHandler}/>
                {dialog}
            </div>
        );
    }

    updateVisualization() {
        const {width} = this.props;
        // Hold off until height & width are known.
        if (width === 0) {
            return;
        }
        const height = this.props.source.haplotypes.length * (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING)
            + HAPLOTYPE_TOP_MARGIN;
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

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const haplotypeWidth = Math.round(scale(range.stop) - scale(range.start));
        haplotypes.forEach((haplotype, index) => {
            ctx.pushObject(haplotype);

            ctx.fillStyle = HAPLOTYPE_FILL;
            ctx.strokeStyle = HAPLOTYPE_STROKE;
            const yOffset = index * (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING) + HAPLOTYPE_TOP_MARGIN;
            ctx.fillRect(0, yOffset, haplotypeWidth, HAPLOTYPE_HEIGHT);
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

        // TODO: the center line should go above alignments, but below mismatches
        this.renderCenterLine(ctx, range, scale);
    }

    // Draw the center line(s), which orient the user
    renderCenterLine(ctx: CanvasRenderingContext2D,
                     range: IGenomeRange,
                     scale: (num: number) => number) {
        const midPoint = Math.floor((range.stop + range.start) / 2);
        const rightLineX = Math.ceil(scale(midPoint + 1));
        const leftLineX = Math.floor(scale(midPoint));
        const height = ctx.canvas.height;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        if (rightLineX - leftLineX < 3) {
            // If the lines are very close, then just draw a center line.
            const midX = Math.round((leftLineX + rightLineX) / 2);
            canvasUtils.drawLine(ctx, midX - 0.5, 0, midX - 0.5, height);
        } else {
            canvasUtils.drawLine(ctx, leftLineX - 0.5, 0, leftLineX - 0.5, height);
            canvasUtils.drawLine(ctx, rightLineX - 0.5, 0, rightLineX - 0.5, height);
        }
        ctx.restore();
    }

    getScale() {
        return d3utils.getTrackScale(this.props.range, this.props.width);
    }

    canvasRefHandler(ref: Element) {
        this.canvas = ref;
    }

}
