import {Events} from 'backbone';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
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
    haplotype_id: string;
    accessions: string[];
    variants: IVariant[];
    sequence: string;
}

interface GenomeRange {
  contig: string;
  start: number;  // inclusive
  stop: number;  // inclusive
}

export interface IHaplotypeNode {
    id?: number;
    children?: IHaplotypeNode[];
}

interface IHaplotypesResponse {
    hierarchy: IHaplotypeNode;
    haplotypes: IHaplotype[];
}

export class AveHaplotypesDataSource {
    genome_id: string;
    apiroot: string = '/api';
    interval: ContigInterval;
    hierarchy: IHaplotypeNode = {};
    haplotypes: IHaplotype[] = [];
    accessions: string[] = [];
    events: Backbone.Events = _.extend({}, Events);
    subject: Subject<string> = new Subject<string>();
    observeable = this.buildObserveable();

    constructor(genome_id: string, apiroot: string) {
        this.genome_id = genome_id;
        this.apiroot = apiroot;
        this.observeable.subscribe(this.fetch.bind(this));
    }

    buildObserveable() {
        return this.subject
            .distinctUntilChanged()
            .debounceTime(100)
        ;
    }

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

    rangeChanged(range: GenomeRange) {
        this.interval = new ContigInterval(range.contig, range.start, range.stop);
        this.onFetch();
    }

    on(event: string, callback: (body: any) => void) {
        return this.events.on(event, callback);
    }

    off(event: string, callback: (body: any) => void) {
        return this.events.off(event, callback);
    }

    setAccessions(accessions: string[]) {
        this.accessions = accessions;
        this.onFetch();
    }
}
