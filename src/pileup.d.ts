declare module 'pileup/dist/main/Controls' {
    interface IControlProps {
        contigList: string[];
        range: any;
        onChange: any;
    }

    export default class Controls extends React.Component<IControlProps, any> {
        handleFormSubmit: any;
        handleContigChange: any;
        zoomOut: any;
        zoomIn: any;
    }
}

declare module 'pileup/dist/main/Root' {
    export interface IRootProps {
        tracks: any[];
        referenceSource: any;
        initialRange: any;
    }

    export interface GenomeRange {
        contig: string;
        start: number;
        stop: number;
    }

    export interface IRootState {
        contigList: string[];
        range: GenomeRange;
        settingsMenuKey?: string;
    }

    export interface VizWithOptions {
        component: any;
        options?: object;
    }

    export interface Track {
        viz: VizWithOptions;
        data: object;  // This is a DataSource object
        name?: string;
        cssClass?: string;
        isReference?: boolean;
    }

    export interface VisualizedTrack {
        visualization: VizWithOptions;
        source: object;  // data source
        track: Track;  // for css class and options
    }

    export default class Root<P extends IRootProps, S extends IRootState> extends React.Component<P, S> {
        handleRangeChange(newRange: GenomeRange): void;
        toggleSettingsMenu: any;
        makeDivForTrack(key: string, track: VisualizedTrack): any;
        handleSelectOption: any;
    }
}

declare module 'pileup/dist/main/VisualizationWrapper' {
    interface IProps {
        visualization: any;
        range: any;
        onRangeChange: any;
        source: any;
        referenceSource: any;
    }
    export default class VisualizationWrapper extends React.Component<IProps, {}> {
    }
}

declare module 'pileup/dist/main/pileup' {
    import { IGeneTrackOptions } from 'pileup/dist/main/viz/GeneTrack';
    import { IFeatureTrackOptions } from 'pileup/dist/main/viz/FeatureTrack';
    export namespace viz {
        export var genome: () => any;
        export var scale: () => any;
        export var location: () => any;
        export var genes: (options: IGeneTrackOptions) => any;
        export var pileup: () => any;
        export var features: (options: IFeatureTrackOptions) => any;
    }
    export namespace formats {
        export var bigBed: (config: any) => any;
        export var twoBit: (config: any) => any;
        export var empty: () => any;
    }
}

declare module 'pileup/dist/main/viz/d3utils' {
    export var sizeCanvas: (el: Element, width: number, height: number) => void;
    export var getTrackScale: (range: any, width: number) => any;
}
declare module 'pileup/dist/main/viz/canvas-utils' {
    export var getContext: (el: Element) => CanvasRenderingContext2D;
    export var drawLine: (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => void;
}

declare module 'pileup/dist/main/viz/GeneTrack' {
    import ContigInterval from 'pileup/dist/main/ContigInterval';
    import Interval from 'pileup/dist/main/Interval';
    export type Strand = '-' | '+';
    export type Gene = {
        position: ContigInterval;
        id: string;  // transcript ID, e.g. "ENST00000269305"
        strand: Strand;
        codingRegion: Interval;  // locus of coding start
        exons: Interval[];
        geneId: string;  // ensembl gene ID
        name: string;  // human-readable name, e.g. "TP53"
    }
    export interface IGeneTrackOptions {
        onGeneClicked(genes: Gene[]): void;
    }
    interface IProps {
        options: IGeneTrackOptions;
    }
    export default class GeneTrack extends React.Component<IProps, {}> {
        
    }
}

declare module 'pileup/dist/main/data/feature' {
    export default class Feature {
        id: string;
        featureType: string;
        contig: string;
        start: number;
        stop: number;
        score: number;
        constructor(feature: object);
    }
}

declare module 'pileup/dist/main/viz/FeatureTrack' {
    import Feature from 'pileup/dist/main/data/feature';
    export interface IFeatureTrackOptions {
        onFeatureClicked(feature: Feature): void;
    }
    interface IProps {
        options: IFeatureTrackOptions;
    }
    export default class FeatureTrack extends React.Component<IProps, {}> {

    }
}

declare module 'pileup/dist/main/Interval' {
    export default class Interval {
        constructor(start: number, stop: number);
        start: number;
        stop: number;
    }
}

declare module 'pileup/dist/main/ContigInterval' {
    import Interval from 'pileup/dist/main/Interval';
    export default class ContigInterval {
        contig: string;
        constructor(contig: string, start: number, stop: number);
        start(): number;
        stop(): number;
        length(): number;
        interval: Interval;
    }
}

declare module 'pileup/dist/main/style' {
    export const VARIANT_HEIGHT: number;
    export const VARIANT_FILL: string;
    export const VARIANT_STROKE: string;
}

declare module 'data-canvas' {
    export class DataCanvasRenderingContext2D extends CanvasRenderingContext2D {
        pushObject(o: any): void;
        popObject(): void;
        reset(): void;
    }
    export class ClickTrackingContext extends DataCanvasRenderingContext2D {
        constructor(ctx: CanvasRenderingContext2D, x: number, y: number);
        hit?: any[];
        hits: any[][];
    }
    export var getDataContext: (context: CanvasRenderingContext2D) => DataCanvasRenderingContext2D ;
}