declare module 'pileup/dist/main/Root' {
    export default class Root extends React.Component<any, any> {
        handleRangeChange: any;
        toggleSettingsMenu: any;
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