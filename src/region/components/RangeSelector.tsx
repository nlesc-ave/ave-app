import * as React from 'react';

import IconButton from 'material-ui/IconButton';
import GoIcon from 'material-ui/svg-icons/av/play-arrow';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';

import { GenomeRange } from 'pileup/dist/main/Root';
import { ChromosomePicker } from '../../components/ChromosomePicker';

interface IProps {
    chromosomes: IChromosome[];
    range: GenomeRange;
    onChange(newRange: GenomeRange): void;
}

interface IState {
    start: number;
    stop: number;
}

export class RangeSelector extends React.Component<IProps, {}> {
    state: IState = {
        start: 1,
        stop: 10000
    };

    constructor(props: IProps) {
        super(props);

        this.state.start = props.range.start;
        this.state.stop = props.range.stop;
    }

    // If start/stop are changed outside component then update internal state to it
    componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            start: nextProps.range.start,
            stop: nextProps.range.stop
        });
    }

    onChromosomeChange = (contig: string) => {
        const {start, stop} = this.props.range;
        const newRange = {
            contig,
            start,
            stop
        };
        this.props.onChange(newRange);
    }

    onStartChange = (_event: any, start: string) => {
        this.setState({start: Number(start)});
    }

    onStopChange = (_event: any, stop: string) => {
        this.setState({stop: Number(stop)});
    }

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.props.range.start !== this.state.start || this.props.range.stop !== this.state.stop) {
            const newRange = {
                contig: this.props.range.contig,
                start: this.state.start,
                stop: this.state.stop
            };
            this.props.onChange(newRange);
        }
    }

    render() {
        const {range , chromosomes} = this.props;
        const {start, stop} = this.state;
        const chromosomeIds = chromosomes.map(
            (c) => c.chrom_id
        );
        const currentChromosome = chromosomes.filter((c) => c.chrom_id === range.contig)[0];
        let error = '';
        if (start > stop) {
            error = 'Stop should be greater than start';
        }
        return (
            <ToolbarGroup>
                <ChromosomePicker
                    value={range.contig}
                    onPick={this.onChromosomeChange}
                    choices={chromosomeIds}
                />
                <form onSubmit={this.onSubmit}>
                    <TextField
                        type="number"
                        value={start}
                        floatingLabelText="Start"
                        onChange={this.onStartChange}
                        min={1}
                        max={currentChromosome.length + 1}
                        errorText={error}
                    />
                    <TextField
                        type="number"
                        floatingLabelText="End"
                        value={stop}
                        onChange={this.onStopChange}
                        min={1}
                        max={currentChromosome.length + 1}
                        errorText={error}
                    />
                    <IconButton tooltip="GO" type="submit"><GoIcon/></IconButton>
                </form>
            </ToolbarGroup>
        );
    }
}
