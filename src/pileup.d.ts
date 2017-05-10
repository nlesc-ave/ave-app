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
    interface IRootProps {
        tracks: any[];
        referenceSource: any;
        initialRange: any;
    }

    interface GenomeRange {
        contig: string;
        start: number;
        stop: number;
    }

    interface IRootState {
        contigList: string[];
        range?: GenomeRange;
        settingsMenuKey?: string;
    }

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

    export default class Root extends React.Component<IRootProps, IRootState> {
        handleRangeChange: any;
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
    export namespace viz {
        export var genome: () => any;
        export var scale: () => any;
        export var location: () => any;
        export var genes: () => any;
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

declare module 'pileup/dist/main/ContigInterval' {
    export default class ContigInterval {
        contig: string;
        constructor(contig: string, start: number, stop: number);
        start(): number;
        stop(): number;
        length(): number;
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