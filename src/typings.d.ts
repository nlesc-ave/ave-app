/* import all svg files as strings */
declare module '*.svg' {
    const __path__: string;
    export default __path__;
}

// @types/react-tap-event-plugin did not work
declare module 'react-tap-event-plugin' {
    const injectTapEventPlugin: () => void;
    export default injectTapEventPlugin;
}