import * as React from 'react'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import ActionHome from 'material-ui/svg-icons/action/home'
import ActionAbout from 'material-ui/svg-icons/action/info-outline'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import { Link } from 'react-router-dom'

interface IProps {
  open: boolean
  onToggle(): void
}

export const SideBar = ({ open, onToggle }: IProps) => {
  return (
    <div>
      <Drawer open={open} docked={false} onRequestChange={onToggle}>
        <MenuItem leftIcon={<ActionHome />} containerElement={<Link to="/" />}>
          Home
        </MenuItem>
        <MenuItem
          leftIcon={<ActionSettings />}
          containerElement={<Link to="/settings" />}
        >
          Settings
        </MenuItem>
        <MenuItem
          leftIcon={<ActionAbout />}
          containerElement={<Link to="/about" />}
        >
          About
        </MenuItem>
      </Drawer>
    </div>
  )
}
