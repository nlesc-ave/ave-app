import {Events} from 'backbone';
import * as _ from 'underscore';

import ContigInterval from 'pileup/dist/main/ContigInterval';

export interface IVariant {
    chrom: string;
    pos: number;
    id: string;
    ref: string;
    alt: string[];
    qual: number;
    filter: string;
    info: string;
    format: string;
    samples: string;
}

export interface IHaplotype {
    id: string;
    accessions: string[];
    variants: IVariant[];
}

interface GenomeRange {
  contig: string;
  start: number;  // inclusive
  stop: number;  // inclusive
}

export interface IVariantNode {
    id?: number;
    children?: IVariantNode[];
}

interface IHaplotypesResponse {
    hierarchy: IVariantNode;
    haplotypes: IHaplotype[];
}

export class AveHaplotypesDataSource {
    genome_id: string;
    apiroot: string = '/api';
    interval: ContigInterval;
    hierarchy: IVariantNode = {};
    haplotypes: IHaplotype[] = [];
    accessions: string[] = [];
    events: Backbone.Events = _.extend({}, Events);

    constructor(genome_id: string, apiroot: string) {
        this.genome_id = genome_id;
        this.apiroot = apiroot;
    }

    load(response: IHaplotypesResponse, interval: ContigInterval) {
        this.hierarchy = response.hierarchy;
        this.haplotypes = response.haplotypes;
        this.interval = interval;
        this.events.trigger('newdata', interval);
        return response;
    }

    buildUrl(interval: ContigInterval, accessions: string[] = [], suffix = 'haplotypes') {
        let url = `${this.apiroot}` +
            `/genomes/${this.genome_id}` +
            `/chromosomes/${interval.contig}` +
            `/start/${interval.start()}` +
            `/stop/${interval.stop()}` +
            `/${suffix}`;
        if (accessions.length > 0) {
            url += '?accessions=' + accessions.join(',');
        }
        return url;
    }

    buildSequenceUrl(haplotype: IHaplotype) {
        return this.buildUrl(this.interval, haplotype.accessions, 'haplotype.fa');
    }

    fetch(interval: ContigInterval) {
        const url = this.buildUrl(interval, this.accessions);
        // TODO debounce fetch,
        // haplotypes are fetched for each interval change which can be very frequent due to dragging
        // so wait 100ms for navigation to stop and then fetch
        return fetch(url)
            .then<IHaplotypesResponse>((response) => response.json())
            .then((response) => this.load(response, interval))
            .catch((reason) => this.events.trigger('networkfailure', reason))
        ;
    }

    rangeChanged(range: GenomeRange) {
        this.fetch(new ContigInterval(range.contig, range.start, range.stop));
    }

    on(event: string, callback: (body: any) => void) {
        return this.events.on(event, callback);
    }

    off(event: string, callback: (body: any) => void) {
        return this.events.off(event, callback);
    }

    setAccessions(accessions: string[]) {
        // only update when different
        if (this.accessions.every((d) => accessions.indexOf(d) > -1)) {
            return;
        }
        this.accessions = accessions;
        if (this.interval) {
            this.fetch(this.interval);
        }
    }
}
