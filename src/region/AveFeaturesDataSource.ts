import ContigInterval from 'pileup/dist/main/ContigInterval';

import { AveDataSource } from './AveDataSource';
import { AveFeature } from './AveFeature';

export class AveFeaturesDataSource extends AveDataSource {
    features: AveFeature[] = [];

    onFetch() {
        if (this.interval) {
            const url = this.buildUrl(this.interval);
            this.subject.next(url);
        }
    }

    buildUrl(interval: ContigInterval) {
        return `${this.apiroot}` +
            `/genomes/${this.genome_id}` +
            `/chromosomes/${interval.contig}` +
            `/start/${interval.start()}` +
            `/end/${interval.stop()}` +
            '/features';
    }

    fetch(url: string) {
        return fetch(url)
            .then<IFeatureAnnotation[]>((response) => response.json())
            .then((response) => this.load(response))
            .catch((reason) => this.events.trigger('networkfailure', reason))
        ;
    }

    load(response: IFeatureAnnotation[]) {
        this.features = response.map(this.toFeature);
        this.events.trigger('newdata', this.interval);
        return response;
    }

    toFeature = (res: IFeatureAnnotation): AveFeature => {
        return new AveFeature({
            contig: res.sequence,
            featureType: res.feature,
            id: res.source,
            score: res.score,
            start: res.start,
            stop: res.end
        }, res);
    }

    getFeaturesInRange(_range: ContigInterval): AveFeature[] {
        return this.features;
    }
}
