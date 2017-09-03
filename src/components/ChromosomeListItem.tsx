import * as React from 'react';

import { ListItem } from 'material-ui/List';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

interface IProps {
    chromosome: string;
    selected: boolean;
    onClick(chromosome: string): void;
}

export class ChromosomeListItem extends React.Component<IProps, {}> {
    onClick = () => {
        this.props.onClick(this.props.chromosome);
    }

    render() {
        const chr = this.props.chromosome;
        return (
            <ListItem
                primaryText={chr}
                value={chr}
                onClick={this.onClick}
                insetChildren={!this.props.selected}
                leftIcon={this.props.selected ? <CheckIcon/> : undefined}
            />
        );
    }
}
