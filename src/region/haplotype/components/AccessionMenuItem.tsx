import * as React from 'react';

import MenuItem from 'material-ui/MenuItem';

interface IProps {
    accession: string;
    selected: boolean;
    onToggle(accession: string): void;
}

export class AccessionMenuItem extends React.Component<IProps, {}> {
    onToggle = () => {
        this.props.onToggle(this.props.accession);
    }

    render() {
        return (
            <MenuItem
                key={this.props.accession}
                primaryText={this.props.accession}
                checked={this.props.selected}
                insetChildren={!this.props.selected}
                onTouchTap={this.onToggle}
            />
        );
    }
}
