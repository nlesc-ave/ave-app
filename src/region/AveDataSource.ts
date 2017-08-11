import { Events } from 'backbone';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
import * as _ from 'underscore';

import ContigInterval from 'pileup/dist/main/ContigInterval';

interface GenomeRange {
  contig: string;
  start: number;  // inclusive
  stop: number;  // inclusive
}

export class AveDataSource {
    genome_id: string;
    apiroot: string = '/api';
    interval: ContigInterval;
    events: Backbone.Events = _.extend({}, Events);
    // Subject to push urls to fetch into with subject.next(url)
    subject: Subject<string> = new Subject<string>();
    observable = this.buildObservable();

    constructor(genome_id: string, apiroot: string) {
        this.genome_id = genome_id;
        this.apiroot = apiroot;
        this.observable.subscribe(this.fetch.bind(this));
    }

    buildObservable() {
        return this.subject
            .distinctUntilChanged()
            .debounceTime(100)
        ;
    }

    fetch(_url: string) {
        throw Error('unimplemented abstract method');
    }

    onFetch() {
        throw Error('unimplemented abstract method');
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
}
