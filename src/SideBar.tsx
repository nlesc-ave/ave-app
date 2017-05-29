import * as React from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';

interface IProps {
    open: boolean;
    onToggle(): void;
}

export const SideBar = ({ open, onToggle }: IProps) => {
    return (
        <div>
            <Drawer open={open} docked={false}  onRequestChange={onToggle}>
                <MenuItem containerElement={<Link to="/"/>}>Home</MenuItem>
                <MenuItem containerElement={<Link to="/settings"/>}>Settings</MenuItem>
                <MenuItem containerElement={<Link to="/about"/>}>About</MenuItem>
            </Drawer>
        </div>
    );
};
