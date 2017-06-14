import * as React from 'react';

import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { black, blue500 } from 'material-ui/styles/colors';
import ActionSettings from 'material-ui/svg-icons/action/settings';

import { AveVariantsDataSource } from '../sources/AveVariantsDataSource';
import { AccessionMenuItem} from './AccessionMenuItem';

export interface IProps {
    source: AveVariantsDataSource;
}

export interface IState {
    accessions: string[];
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
        accessions: [],
        selected: new Set()
    };

    constructor() {
        super();
    }

    refreshAccessions = () => {
        const accessions = this.props.source.haplotypes
            .map((d) => d.accessions)
            .reduce((p, c) => p.concat(c), []);
        // TODO persist selection so when navigating to another region the same selection is used.
        const selected = new Set();
        accessions.forEach((d) => selected.add(d));
        this.setState({
            accessions,
            selected
        });
    }

    componentWillMount() {
        this.props.source.on('newdata', this.refreshAccessions);
        if (this.props.source.haplotypes) {
            // if source already has data then read it
            this.refreshAccessions();
        }
    }

    componentWillUnmount() {
        this.props.source.off('newdata', this.refreshAccessions);
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
        this.setState({selected});
    }

    onSelectAllClick = () => {
        const selected = new Set();
        this.state.accessions.forEach((d) => selected.add(d));
        this.setState({selected});
    }

    render() {
        const items = this.state.accessions.map(
            (d, i) => (
                <AccessionMenuItem
                    key={i}
                    accession={d}
                    selected={this.state.selected.has(d)}
                    onToggle={this.onAccessionToggle}
                />
            )
        );
        const isAllSelected = this.state.accessions.length === this.state.selected.size;
        const button = (
            <IconButton
                style={style}
                tooltip="Select accessions"
                iconStyle={iconStyle}
                disabled={!this.state.accessions}
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
                    primaryText="Check all"
                    disabled={isAllSelected}
                    onTouchTap={this.onSelectAllClick}
                />
            </IconMenu>
        );
    }
}
