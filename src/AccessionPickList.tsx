import * as React from 'react';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

interface IProps {
    accessions: string[];
    selected: string;
}

export const AccessionPickList = ({accessions, selected}: IProps) => {
    const menuitems = accessions.map(
        (a) => <MenuItem key={a} checked={a === selected} primaryText={a}/>
    );
    return (
        <Paper>
            <Menu desktop={true} width={320}>
                {menuitems}
            </Menu>
        </Paper>
    );
};
