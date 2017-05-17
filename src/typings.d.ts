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

interface ISpecies {
    name: string;
    species_id: string;
}

interface IChromosome {
    chrom_id: string;
    length: number;
}

interface IGenome {
    genome_id: string;
    chromosomes: IChromosome[];
    annotation_feature_types: string[];
    accessions: string[];
    reference: string;
}