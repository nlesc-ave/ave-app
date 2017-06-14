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

interface IVariantsResponse {
    hierarchy: IVariantNode;
    haplotypes: IHaplotype[];
}

export class AveVariantsDataSource {
    genome_id: string;
    apiroot: string = '/api';
    interval: ContigInterval;
    hierarchy: IVariantNode = {};
    haplotypes: IHaplotype[] = [];
    events: Backbone.Events = _.extend({}, Events);

    constructor(genome_id: string, apiroot: string) {
        this.genome_id = genome_id;
        this.apiroot = apiroot;
    }

    loadVariants(response: IVariantsResponse, interval: ContigInterval) {
        this.hierarchy = response.hierarchy;
        this.haplotypes = response.haplotypes;
        this.interval = interval;
        this.events.trigger('newdata', interval);
        return response;
    }

    fetchVariants(interval: ContigInterval) {
        // TODO match service url template
        const url = `${this.apiroot}/genomes/${this.genome_id}/variants#` +
            interval.contig + '/' + interval.start() + '/' + interval.stop();
        // TODO debounce fetch, haplotypes are fetched for each interval change which can be very frequent
        // so wait 100ms for navigation to stop and then fetch
        return fetch(url)
            .then<IVariantsResponse>((response) => response.json())
            .then((response) => this.loadVariants(response, interval))
            .catch((reason) => this.events.trigger('networkfailure', reason))
        ;
    }

    rangeChanged(range: GenomeRange) {
        this.fetchVariants(new ContigInterval(range.contig, range.start, range.stop));
    }

    on(event: string, callback: (body: any) => void) {
        return this.events.on(event, callback);
    }

    off(event: string, callback: (body: any) => void) {
        return this.events.off(event, callback);
    }
}
