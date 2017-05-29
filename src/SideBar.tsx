import * as React from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

interface IProps {
    open: boolean;
    onToggle(): void;
}

export const SideBar = ({ open, onToggle }: IProps) => {
    return (
        <div>
            <Drawer open={open} docked={false}  onRequestChange={onToggle}>
                <MenuItem href="/">Home</MenuItem>
                <MenuItem href="/settings">Settings</MenuItem>
                <MenuItem href="/about">About</MenuItem>
            </Drawer>
        </div>
    );
};
