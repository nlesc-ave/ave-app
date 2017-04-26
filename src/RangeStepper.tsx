import * as React from 'react';

import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {
    Step,
    StepContent,
    StepLabel,
    Stepper
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';

interface IChromosome {
    chrom_id: string;
    length: number;
}

interface IState {
    stepIndex: number;
    allowedSpecies: string[];
    allowedGenomes: string[];
    allowedChromosomes: IChromosome[];
    selectedSpecies: string;
    selectedGenome: string;
    selectedChromosome: IChromosome;
    selectedStart: number;
    selectedEnd: number;
}

export class RangeStepper extends React.Component<{}, IState> {
    state: IState = {
        stepIndex: 0,
        // tslint:disable-next-line:object-literal-sort-keys
        allowedSpecies: [],
        allowedGenomes: [],
        allowedChromosomes: [],
        selectedSpecies: '',
        selectedGenome: '',
        selectedChromosome: { chrom_id: '', length: 0 },
        selectedStart: 1,
        selectedEnd: 10000
    };

    componentDidMount() {
        this.fetchSpecies();
    }

    fetchSpecies() {
        fetch('/api/species.json')
            .then<string[]>((response) => response.json())
            .then((allowedSpecies) => this.setState({ allowedSpecies }));
    }

    fetchGenomes(species_id: string) {
        fetch(`/api/species/${species_id}/genomes.json`)
            .then<string[]>((response) => response.json())
            .then((allowedGenomes) => this.setState({ allowedGenomes, stepIndex: this.state.stepIndex + 1 }));
    }

    fetchChromosomes(genome_id: string) {
        fetch(`/api/genomes/${genome_id}/chromosomes.json`)
            .then<IChromosome[]>((response) => response.json())
            .then((allowedChromosomes) => this.setState({
                allowedChromosomes,
                selectedChromosome: allowedChromosomes[0],
                stepIndex: this.state.stepIndex + 1
            }));
    }

    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    }

    renderStepActions(step: number) {
        const { stepIndex } = this.state;

        let finishButton;
        if (step === 2) {
            const region_url = [
                '#/region',
                this.state.selectedGenome,
                this.state.selectedChromosome.chrom_id,
                this.state.selectedStart,
                this.state.selectedEnd
            ].join('/');
            const finalEnabled = this.state.selectedGenome &&
                this.state.selectedChromosome.chrom_id &&
                this.state.selectedStart &&
                this.state.selectedEnd;
            finishButton = (
                <RaisedButton
                    disabled={!finalEnabled}
                    label="View"
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    href={region_url}
                    style={{ marginRight: 12 }}
                />
            );
        }
        let backButton;
        if (step > 0) {
            backButton = (
                <FlatButton
                    label="Back"
                    disabled={stepIndex === 0}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    onTouchTap={this.handlePrev}
                />
            );
        }
        return (
            <div style={{ margin: '12px 0' }}>
                {finishButton}
                {backButton}
            </div>
        );
    }

    selectSpecies = (_event: React.FormEvent<{}>, selectedSpecies: string) => {
        this.setState({ selectedSpecies });
        this.fetchGenomes(selectedSpecies);
    }

    selectGenome = (_e: any, selectedGenome: string) => {
        this.setState({ selectedGenome });
        this.fetchChromosomes(selectedGenome);
    }

    selectChromosome = (_e: any, selectedChromosomeIndex: number, _payload: any) => {
        const selectedChromosome = this.state.allowedChromosomes[selectedChromosomeIndex];
        this.setState({ selectedChromosome });
    }

    selectStart = (_e: any, selected: string) => this.setState({ selectedStart: parseInt(selected, 10) });
    selectEnd = (_e: any, selected: string) => this.setState({ selectedEnd: parseInt(selected, 10) });

    render() {
        const { stepIndex, selectedGenome, selectedSpecies } = this.state;
        const speciesRadios = this.state.allowedSpecies.map(
            (name) => <RadioButton key={name} label={name} value={name} />
        );
        const genomeRadios = this.state.allowedGenomes.map(
            (name) => <RadioButton key={name} label={name} value={name} />
        );
        const chromosomeItems = this.state.allowedChromosomes.map(
            (chr) => <MenuItem key={chr.chrom_id} primaryText={chr.chrom_id} value={chr.chrom_id} />
        );
        const startError = this.state.selectedStart < 1 ? 'Start should be greater than 1' : '';
        let endError = '';
        if (this.state.selectedEnd <= this.state.selectedStart) {
            endError = 'End should be greater than start';
        }
        if (this.state.selectedChromosome && this.state.selectedEnd > this.state.selectedChromosome.length) {
            endError = `End should be smaller than chromosome length ${this.state.selectedChromosome.length}`;
        }

        return (
            <Stepper activeStep={stepIndex} orientation="vertical">
                <Step>
                    <StepLabel>Select species: {selectedSpecies}</StepLabel>
                    <StepContent>
                        <RadioButtonGroup name="species" onChange={this.selectSpecies}>
                            {speciesRadios}
                        </RadioButtonGroup>
                        {this.renderStepActions(0)}
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>Select genome: {selectedGenome}</StepLabel>
                    <StepContent>
                        <RadioButtonGroup name="genome" onChange={this.selectGenome}>
                            {genomeRadios}
                        </RadioButtonGroup>
                        {this.renderStepActions(1)}
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>Select range</StepLabel>
                    <StepContent>
                        <SelectField
                            floatingLabelText="Chromosome"
                            value={this.state.selectedChromosome.chrom_id}
                            onChange={this.selectChromosome}
                        >
                            {chromosomeItems}
                        </SelectField>
                        <div>
                            <TextField
                                type="number"
                                floatingLabelText="Start"
                                value={this.state.selectedStart}
                                onChange={this.selectStart}
                                errorText={startError}
                            />
                            <TextField
                                type="number"
                                floatingLabelText="End"
                                value={this.state.selectedEnd}
                                onChange={this.selectEnd}
                                style={{ paddingLeft: '5px' }}
                                errorText={endError}
                            />
                        </div>
                        {this.renderStepActions(2)}
                    </StepContent>
                </Step>
            </Stepper>
        );
    }
}
