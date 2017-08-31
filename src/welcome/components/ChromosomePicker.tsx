import * as React from 'react';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

interface IProps {
    choices: string[];
    value: string;
    onPick(value: string): void;
}

interface IState {
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
        this.props.onPick(value);
    }

    onToggleMenu = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        const chromosomeItems = this.state.filtered.map(
            (chr) => <MenuItem key={chr} primaryText={chr} value={chr} onClick={this.onChange}/>
        );
        let error = '';
        if (this.state.filtered.length === 0 && this.props.choices.length > 0) {
            error = 'No chromosome matches filter';
        }
        chromosomeItems.unshift(
            <TextField
                key="filter"
                hintText="Filter chromosomes"
                value={this.state.query}
                onChange={this.onFilter}
                errorText={error}
            />
        );
        return (
            <div>
                <IconButton>{this.props.value} <ArrowDropDown/></IconButton>
                <Menu>
                    {chromosomeItems}
                </Menu>
            </div>
        );
    }
}
