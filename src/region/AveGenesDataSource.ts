import ContigInterval from 'pileup/dist/main/ContigInterval';
import Interval from 'pileup/dist/main/Interval';
import { Gene, Strand } from 'pileup/dist/main/viz/GeneTrack';

import { AveDataSource } from './AveDataSource';

export class AveGenesDataSource extends AveDataSource {
    genes: Gene[];

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
            `/stop/${interval.stop()}` +
            '/genes';
    }

    fetch(url: string) {
        return fetch(url)
            .then<IGeneAnnotation[]>((response) => response.json())
            .then((response) => this.load(response))
            .catch((reason) => this.events.trigger('networkfailure', reason))
        ;
    }

    load(response: IGeneAnnotation[]) {
        this.genes = response.map(this.toGene);
        this.events.trigger('newdata', this.interval);
        return response;
    }

    toGene = (res: IGeneAnnotation): Gene => {
        return {
            codingRegion: new Interval(res.coding_region.start, res.coding_region.end),
            exons: res.exons.map((d) => {
                return new Interval(d.start, d.end);
            }),
            geneId: res.gene_id,
            id: res.id,
            name: res.name,
            position: new ContigInterval(res.position.chrom, res.position.start, res.position.end),
            strand: res.strand as Strand
        };
    }

    getGenesInRange(_range: ContigInterval): Gene[] {
        return this.genes;
    }
}
