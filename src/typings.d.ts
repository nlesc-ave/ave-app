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

interface IFeatureTrack {
    label: string;
    url: string;
}

interface IGenome {
    genome_id: string;
    chromosomes: IChromosome[];
    feature_tracks: IFeatureTrack[];
    accessions: string[];
    reference: string;
    gene_track: string;
}

interface IFeatureAnnotation {
    name: string;
    chrom: string;
    source: string;
    feature: string;
    start: number;
    end: number;
    score: number;
    strand: string;
    phase: string;
    attributes: string;
}

interface IRange {
    start: number;
    end: number;
}

interface IExon {
    size: number;
    start: number;
}

interface IGeneAnnotation {
    position: {
        chrom: string;
        start: number;
        end: number;
    }
    id: string;
    strand: string;
    coding_region: IRange;
    exons: IExon[];
    gene_id: string;
    name: string;
}

interface IGeneSearchResult {
    chrom: string;
    start: number;
    end: number;
    id: string;
    gene_id: string;
    name: string;
}
