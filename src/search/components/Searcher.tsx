import * as React from 'react'

import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import ActionSearch from 'material-ui/svg-icons/action/search'

import { IProps, SearchForm } from './SearchForm'

interface IState {
  anchorEl?: Element
  open: boolean
}

export class Searcher extends React.Component<IProps, IState> {
  state: IState = { open: false }

  constructor(props: IProps) {
    super(props)
  }

  closeSearchDialog = () => {
    this.setState({
      open: false
    })
  }

  openSearchDialog = (event: any) => {
    event.preventDefault()
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    })
  }

  render() {
    return (
      <div>
        <IconButton tooltip="Search" onTouchTap={this.openSearchDialog}>
          <ActionSearch />
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.closeSearchDialog}
          zDepth={2}
          style={{ padding: 5 }}
        >
          <SearchForm {...this.props} />
        </Popover>
      </div>
    )
  }
}
