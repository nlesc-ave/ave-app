import * as React from 'react';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';

import { GenomeRange } from 'pileup/dist/main/Root';

interface IProps {
    chromosomes: IChromosome[];
    range: GenomeRange;
    onChange(newRange: GenomeRange): void;
}

export class RangeSelector extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.onChromosomChange = this.onChromosomChange.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onStopChange = this.onStopChange.bind(this);
    }

    onChromosomChange(_event: any, _index: any, contig: string) {
        const {start, stop} = this.props.range;
        const newRange = {
            contig,
            start,
            stop
        };
        this.props.onChange(newRange);
    }

    onStartChange(_event: any, start: string) {
        const {contig, stop} = this.props.range;
        const newRange = {
            contig,
            start: Number(start),
            stop
        };
        this.props.onChange(newRange);
    }

    onStopChange(_event: any, stop: string) {
        const {contig, start} = this.props.range;
        const newRange = {
            contig,
            start,
            stop: Number(stop)
        };
        this.props.onChange(newRange);
    }

    render() {
        const {range , chromosomes} = this.props;
        const chromosomeItems = chromosomes.map(
            (c) => <MenuItem key={c.chrom_id} value={c.chrom_id} primaryText={c.chrom_id} />
        );
        const currentChromosome = chromosomes.filter((c) => c.chrom_id === range.contig)[0];
        let error = '';
        if (range.start > range.stop) {
            error = 'Stop should be greater than start';
        }
        return (
            <ToolbarGroup>
                <SelectField
                    value={range.contig}
                    floatingLabelText="Chromosome"
                    onChange={this.onChromosomChange}
                >
                    {chromosomeItems}
                </SelectField>
                <TextField
                    type="number"
                    value={range.start}
                    floatingLabelText="Start"
                    onChange={this.onStartChange}
                    min={1}
                    max={currentChromosome.length + 1}
                    errorText={error}
                />
                <TextField
                    type="number"
                    floatingLabelText="End"
                    value={range.stop}
                    onChange={this.onStopChange}
                    min={1}
                    max={currentChromosome.length + 1}
                    errorText={error}
                />
            </ToolbarGroup>
        );
    }
}
