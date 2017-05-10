import {Events} from 'backbone';
import * as _ from 'underscore';

import ContigInterval from 'pileup/dist/main/ContigInterval';

interface IVariant {
    pos: number;
    ref: string;
    alt: string;
    qual: number;
    info: string;
}

interface IHaplotype {
    id: number;
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
    genome_id: string = 'GRCH38.p10';
    interval: ContigInterval;
    hierarchy: IVariantNode = {};
    haplotypes: IHaplotype[] = [];
    events: Backbone.Events = _.extend({}, Events);

    constructor(genome_id: string) {
        this.genome_id = genome_id;
    }

    loadVariants(response: IVariantsResponse, interval: ContigInterval) {
        this.hierarchy = response.hierarchy;
        this.haplotypes = response.haplotypes;
        this.interval = interval;
        this.events.trigger('newdata', interval);
        return response;
    }

    fetchVariants(interval: ContigInterval) {
        const url = `/api/genomes/${this.genome_id}/variants.json` +
            `#${interval.contig}/${interval.start}/${interval.stop}`;
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
}
