import ContigInterval from 'pileup/dist/main/ContigInterval';

import { AveDataSource } from '../AveDataSource';

// tslint:disable-next-line:interface-over-type-literal
type IMap = { [s: string]: string; };

export interface Genotype extends IMap {
    accession: string;
}

export interface IVariant {
    chrom: string;
    pos: number;
    id: string;
    ref: string;
    alt: string[];
    qual: number;
    filter: string;
    info: IMap;
    genotypes: Genotype[];
}

export interface IHaplotype {
    haplotype_id: string;
    accessions: string[];
    variants: IVariant[];
    sequence: string;
}

export interface IHaplotypeNode {
    id?: number;
    children?: IHaplotypeNode[];
}

interface IHaplotypesResponse {
    hierarchy: IHaplotypeNode;
    haplotypes: IHaplotype[];
}

export class AveHaplotypesDataSource extends AveDataSource {
    hierarchy: IHaplotypeNode = {};
    haplotypes: IHaplotype[] = [];
    accessions: string[] = [];

    onFetch() {
        if (this.interval) {
            const url = this.buildUrl(this.interval, this.accessions);
            this.subject.next(url);
        }
    }

    load(response: IHaplotypesResponse) {
        this.hierarchy = response.hierarchy;
        this.haplotypes = response.haplotypes;
        this.events.trigger('newdata', this.interval);
        return response;
    }

    buildUrl(interval: ContigInterval, accessions: string[] = []) {
        let url = `${this.apiroot}` +
            `/genomes/${this.genome_id}` +
            `/chromosomes/${interval.contig}` +
            `/start/${interval.start()}` +
            `/stop/${interval.stop()}` +
            '/haplotypes';
        if (accessions.length > 0) {
            url += '?accessions=' + accessions.join(',');
        }
        return url;
    }

    buildSequenceUrl(haplotype: IHaplotype) {
        const header = `>${this.genome_id}:${this.interval.contig}:${this.interval.start()}:${this.interval.stop()}`
             + ` accessions=${haplotype.accessions.join(',')}\n`;
        const blob = new Blob([header, haplotype.sequence], {type: 'text/plain'});
        return URL.createObjectURL(blob);
    }

    fetch(url: string) {
        return fetch(url)
            .then<IHaplotypesResponse>((response) => response.json())
            .then((response) => this.load(response))
            .catch((reason) => this.events.trigger('networkfailure', reason))
        ;
    }

    setAccessions(accessions: string[]) {
        this.accessions = accessions;
        this.onFetch();
    }
}
