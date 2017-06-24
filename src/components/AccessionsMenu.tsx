import * as React from 'react';

import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { black, blue500 } from 'material-ui/styles/colors';
import ActionSettings from 'material-ui/svg-icons/action/settings';

import { AveHaplotypesDataSource } from '../sources/AveHaplotypesDataSource';
import { AccessionMenuItem} from './AccessionMenuItem';

export interface IProps {
    accessions: string[];
    source: AveHaplotypesDataSource;
}

export interface IState {
     // TODO is Set going to work in all our target browsers?
    selected: Set<string>;
}

const style = {
    height: 16,
    padding: 1,
    verticalAlign: 'middle',
    width: 16
};

const iconStyle = {
    height: 14,
    width: 14
};

export class AccessionsMenu extends React.Component<IProps, IState> {
    state: IState = {
        selected: new Set()
    };

    constructor() {
        super();
    }

    componentWillMount() {
        const accessionsFromSource = this.props.source.accessions;
        if (accessionsFromSource.length > 0) {
            this.updateSelectionArray(accessionsFromSource);
        } else {
            this.updateSelectionArray(this.props.accessions);
        }
    }

    onAccessionToggle = (accession: string) => {
        const selected = new Set();
        this.state.selected.forEach(
            (d) => {
                if (d === accession) {
                    // accession was selected, so should not be selected now
                } else {
                    selected.add(d);
                }
            }
        );
        // accession was unselected before, so should be selected now
        if (!this.state.selected.has(accession)) {
            selected.add(accession);
        }
        this.updateSelection(selected);
    }

    selectAll = () => {
        this.updateSelectionArray(this.props.accessions);
    }

    updateSelectionArray(accessions: string[]) {
        const selected = new Set();
        accessions.forEach((d) => selected.add(d));
        this.updateSelection(selected);
    }

    updateSelection(selected: Set<string>) {
        this.setState({selected});
        const accessions: string[] = [];
        if (selected.size < this.props.accessions.length) {
            selected.forEach((d) => accessions.push(d));
        }
        this.props.source.setAccessions(accessions);
    }

    render() {
        const items = this.props.accessions.map(
            (d, i) => (
                <AccessionMenuItem
                    key={i}
                    accession={d}
                    selected={this.state.selected.has(d)}
                    onToggle={this.onAccessionToggle}
                />
            )
        );
        const isAllSelected = this.props.accessions.length === this.state.selected.size;
        const button = (
            <IconButton
                style={style}
                tooltip="Select accessions"
                iconStyle={iconStyle}
                disabled={!this.props.accessions}
                color={isAllSelected ? black : blue500}
            >
                <ActionSettings/>
            </IconButton>
        );
        return (
            <IconMenu iconButtonElement={button}>
                {items}
                <Divider />
                <MenuItem
                    primaryText="Select all"
                    disabled={isAllSelected}
                    onTouchTap={this.selectAll}
                />
            </IconMenu>
        );
    }
}
