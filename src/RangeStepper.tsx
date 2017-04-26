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

interface IState {
    finished: boolean;
    stepIndex: number;
    selectedSpecies: string;
    selectedGenome: string;
    selectedChromosome: string;
    selectedStart: number;
    selectedEnd: number;
}

export class RangeStepper extends React.Component<{}, IState> {
    state = {
        finished: false,
        stepIndex: 0,
        // tslint:disable-next-line:object-literal-sort-keys
        selectedSpecies: '',
        selectedGenome: '',
        selectedChromosome: '1',
        selectedStart: 1,
        selectedEnd: 10000
    };

    allowedSpecies = ['human', 'mouse', 'rat'];
    allowedGenomes = ['GRCh38.p10', 'GRCh38.p7', 'GRCh38.p5'];
    allowedChromosomes = [{
        chrom_id: '1',
        length: 1209341
    }, {
        chrom_id: '2',
        length: 534534
    }];

    handleNext = () => {
        const { stepIndex } = this.state;
        this.setState({
            finished: stepIndex >= 2,
            stepIndex: stepIndex + 1
        });
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
                this.state.selectedChromosome,
                this.state.selectedStart,
                this.state.selectedEnd
            ].join('/');
            const finalEnabled = this.state.selectedGenome &&
                this.state.selectedChromosome &&
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
        this.handleNext();
    }

    selectGenome = (_e: any, selectedGenome: string) => {
        this.setState({ selectedGenome });
        this.handleNext();
    }

    selectChromosome = (_e: any, selectedChromosomeIndex: number, _payload: any) => {
        const selectedChromosome = this.allowedChromosomes[selectedChromosomeIndex].chrom_id;
        this.setState({ selectedChromosome });
    }

    selectStart = (_e: any, selected: string) => this.setState({ selectedStart: parseInt(selected, 10) });
    selectEnd = (_e: any, selected: string) => this.setState({ selectedEnd: parseInt(selected, 10) });

    render() {
        const { stepIndex, selectedGenome, selectedSpecies } = this.state;
        const speciesRadios = this.allowedSpecies.map((name) => <RadioButton key={name} label={name} value={name} />);
        const genomeRadios = this.allowedGenomes.map((name) => <RadioButton key={name} label={name} value={name} />);
        const chromosomeItems = this.allowedChromosomes.map(
            (chr) => <MenuItem key={chr.chrom_id} primaryText={chr.chrom_id} value={chr.chrom_id} />
        );

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
                            value={this.state.selectedChromosome}
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
                            />
                            <TextField
                                type="number"
                                floatingLabelText="End"
                                value={this.state.selectedEnd}
                                onChange={this.selectEnd}
                                style={{ paddingLeft: '5px' }}
                            />
                        </div>
                        {this.renderStepActions(2)}
                    </StepContent>
                </Step>
            </Stepper>
        );
    }
}
