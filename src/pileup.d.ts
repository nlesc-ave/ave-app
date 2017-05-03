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

    export default class Root extends React.Component<IRootProps, any> {
        handleRangeChange: any;
        toggleSettingsMenu: any;
        makeDivForTrack: any;
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
    export var getContext: (el: Element) => any;
}

declare module 'pileup/dist/main/ContigInterval' {
    export default class ContigInterval {
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
    export var getDataContext: (context: any) => any;
}