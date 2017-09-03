import * as React from 'react';

import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Step,
    StepContent,
    StepLabel,
    Stepper
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router-dom';

import { ChromosomePicker } from '../../components/ChromosomePicker';
import { SearchForm } from '../../search/components/SearchForm';

export interface IProps {
    apiroot: string;
    flank: number;
}

interface IState {
    stepIndex: number;
    allowedSpecies: ISpecies[];
    allowedGenomes: IGenome[];
    selectedSpecies?: ISpecies;
    selectedGenome?: IGenome;
    selectedChromosome: IChromosome;
    selectedStart: number;
    selectedEnd: number;
    speciesError: string;
}

export class RangeStepper extends React.Component<IProps, IState> {
    state: IState = {
        stepIndex: 0,
        // tslint:disable-next-line:object-literal-sort-keys
        allowedSpecies: [],
        allowedGenomes: [],
        selectedChromosome: { chrom_id: '', length: 0 },
        selectedStart: 15000,
        selectedEnd: 20000,
        speciesError: ''
    };

    componentDidMount() {
        this.fetchSpecies();
    }

    fetchSpecies() {
        fetch(`${this.props.apiroot}/species`)
            .then<ISpecies[]>((response) => response.json())
            .then((allowedSpecies) => this.setState({ allowedSpecies }))
            .catch((reason: TypeError) => this.setState({ speciesError: reason.message}));
    }

    fetchGenomes(species: ISpecies) {
        fetch(`${this.props.apiroot}/species/${species.species_id}/genomes`)
            .then<IGenome[]>((response) => response.json())
            .then((allowedGenomes) => this.setState({ allowedGenomes, stepIndex: this.state.stepIndex + 1 }));
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
        if (step === 2 && this.state.selectedGenome) {
            // TODO when server is online use dynamic range
            const region_url = [
                '/region',
                this.state.selectedGenome.genome_id,
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
                    containerElement={<Link to={region_url}/>}
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

    selectSpecies = (_event: React.FormEvent<{}>, selectedSpeciesId: string) => {
        const selectedSpecies = this.state.allowedSpecies.find((species) => species.species_id === selectedSpeciesId);
        this.setState({ selectedSpecies });
        if (selectedSpecies) {
            this.fetchGenomes(selectedSpecies);
        }
    }

    selectGenome = (_e: any, selectedGenomeId: string) => {
        const selectedGenome = this.state.allowedGenomes.find((genome) => genome.genome_id === selectedGenomeId);
        if (!selectedGenome) {
            return;
        }
        this.setState({
            selectedChromosome: selectedGenome.chromosomes[0],
            selectedGenome,
            stepIndex: this.state.stepIndex + 1
        });
    }

    selectChromosome = (chromosomeId: string) => {
        const genome = this.state.selectedGenome;
        if (!genome) {
            return;
        }
        const selectedChromosome = genome.chromosomes.filter(
            (c) => c.chrom_id === chromosomeId
        )[0];
        this.setState({ selectedChromosome });
    }

    selectStart = (_e: any, selected: string) => this.setState({ selectedStart: parseInt(selected, 10) });
    selectEnd = (_e: any, selected: string) => this.setState({ selectedEnd: parseInt(selected, 10) });

    render() {
        return (
            <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                {this.renderSpeciesStep()}
                {this.renderGenomeStep()}
                {this.renderRangeSearchStep()}
            </Stepper>
        );
    }

    renderSpeciesStep = () => {
        const { selectedSpecies } = this.state;
        let selectedSpeciesLabel = '';
        if (selectedSpecies) {
            selectedSpeciesLabel = selectedSpecies.name;
        }
        const speciesRadios = this.state.allowedSpecies.map(
            (species) => <RadioButton key={species.species_id} label={species.name} value={species.species_id} />
        );
        let speciesError = null;
        if (this.state.speciesError) {
            speciesError = <span style={{color: 'red'}}>{this.state.speciesError}</span>;
        }
        return (
            <Step>
                <StepLabel>Select species: {selectedSpeciesLabel}</StepLabel>
                <StepContent>
                    <RadioButtonGroup name="species" onChange={this.selectSpecies}>
                        {speciesRadios}
                    </RadioButtonGroup>
                    {speciesError}
                    {this.renderStepActions(0)}
                </StepContent>
            </Step>
        );
    }

    renderGenomeStep = () => {
        const { selectedGenome } = this.state;
        const genomeRadios = this.state.allowedGenomes.map(
            (genome) => <RadioButton key={genome.genome_id} label={genome.genome_id} value={genome.genome_id} />
        );
        let selectedGenomeLabel = '';
        if (selectedGenome) {
            selectedGenomeLabel = selectedGenome.genome_id;
        }
        return (
            <Step>
                <StepLabel>Select genome: {selectedGenomeLabel}</StepLabel>
                <StepContent>
                    <RadioButtonGroup name="genome" onChange={this.selectGenome}>
                        {genomeRadios}
                    </RadioButtonGroup>
                    {this.renderStepActions(1)}
                </StepContent>
            </Step>
        );
    }

    renderRangeSearchStep = () => {
        const { selectedGenome } = this.state;
        if (!selectedGenome) {
            return <Step><StepLabel>Select range or search</StepLabel></Step>;
        }
        const startError = this.state.selectedStart < 1 ? 'Start should be greater than 1' : '';
        let endError = '';
        if (this.state.selectedEnd <= this.state.selectedStart) {
            endError = 'End should be greater than start';
        }
        if (this.state.selectedChromosome && this.state.selectedEnd > this.state.selectedChromosome.length) {
            endError = `End should be smaller than chromosome length ${this.state.selectedChromosome.length}`;
        }
        const chromosomeIds = selectedGenome.chromosomes.map(
            (chr) => chr.chrom_id
        );
        const chrom = this.state.selectedChromosome;
        return (
            <Step>
                <StepLabel>Select range or search</StepLabel>
                <StepContent>
                    <table><tbody><tr><td style={{verticalAlign: 'top'}}>
                        <ChromosomePicker
                            value={chrom.chrom_id}
                            onPick={this.selectChromosome}
                            choices={chromosomeIds}
                        />
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
                    </td><td style={{verticalAlign: 'top'}}>
                        <SearchForm
                            apiroot={this.props.apiroot}
                            genome_id={selectedGenome.genome_id}
                            flank={this.props.flank}
                        />
                    </td></tr></tbody></table>
                    {this.renderStepActions(2)}
                </StepContent>
            </Step>
        );
    }
}
