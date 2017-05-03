import ContigInterval from 'pileup/dist/main/ContigInterval';

interface IHaplotype {
    position: number;
    accessions: string[];
    variations: number[];
}

interface GenomeRange {
  contig: string;
  start: number;  // inclusive
  stop: number;  // inclusive
}

export class AveDataSource {
    tree() {
        return [];
    }

    getFeaturesInRange(interval: ContigInterval): IHaplotype[] {
        const sample = {
            accessions: ['plantvariant1', 'plantvariant2'],
            position: interval.start() + 10,
            variations: [interval.start() + 40 ]
        };
        return [sample];
    }

    rangeChanged(_newRange: GenomeRange) {
        // TODO
    }
}
