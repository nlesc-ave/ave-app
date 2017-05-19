import * as React from 'react';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

interface IProps {
    accessions: string[];
}

export const AccessionPickList = (props: IProps) => {
    const menuitems = props.accessions.map(
        (a) => <MenuItem key={a} checked={true} primaryText={a}/>
    );
    return (
        <Paper>
            <Menu desktop={true} width={320}>
                {menuitems}
            </Menu>
        </Paper>
    );
};
