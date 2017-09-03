import * as React from 'react';

import { List } from 'material-ui/List';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';

import { ChromosomeListItem } from './ChromosomeListItem';

interface IProps {
    choices: string[];
    value: string;
    onPick(value: string): void;
}

interface IState {
    anchorEl?: Element;
    filtered: string[];
    query: string;
    open: boolean;
}

export class ChromosomePicker extends React.Component<IProps, IState> {
    state: IState = {
        filtered: [],
        open: false,
        query: ''
    };

    componentDidMount() {
        this.setState({filtered: this.props.choices});
    }

    closeSearchDialog = () => {
        this.setState({
            open: false
        });
    }

    openSearchDialog = (event: any) => {
        event.preventDefault();
        this.setState({
            anchorEl: event.currentTarget,
            open: true
        });
    }

    onFilter = (_e: any, query: string) => {
        let filtered: string[];
        if (query === '') {
            filtered = this.props.choices;
        } else {
            const filterIt = (c: string) => c.includes(query);
            filtered = this.props.choices.filter(filterIt);
        }
        this.setState({
            query,
            filtered
        });
    }

    onChange = (value: any) => {
        this.closeSearchDialog();
        this.props.onPick(value);
    }

    render() {
        const selected = this.props.value;
        const chromosomeItems = this.state.filtered.map(
            (chr) => (
                <ChromosomeListItem
                    key={chr}
                    chromosome={chr}
                    selected={chr === selected}
                    onClick={this.onChange}
                />
            )
        );
        let error = '';
        if (this.state.filtered.length === 0 && this.props.choices.length > 0) {
            error = 'No chromosome matches filter';
        }
        return (
            <div>
                <TextField
                    floatingLabelText="Chromosome"
                    onFocus={this.openSearchDialog}
                    value={this.props.value}
                />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeSearchDialog}
                    zDepth={2}
                    style={{padding: 5}}
                >
                    <TextField
                        hintText="Filter chromosomes"
                        value={this.state.query}
                        onChange={this.onFilter}
                        errorText={error}
                    />
                    <List>
                        {chromosomeItems}
                    </List>
                </Popover>
            </div>
        );
    }
}
