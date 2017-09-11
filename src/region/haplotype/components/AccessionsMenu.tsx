import * as React from 'react'

import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import { List } from 'material-ui/List'
import Popover from 'material-ui/Popover'
import { black, blue500 } from 'material-ui/styles/colors'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import TextField from 'material-ui/TextField'

import { AveHaplotypesDataSource } from '../AveHaplotypesDataSource'
import { AccessionMenuItem } from './AccessionMenuItem'

export interface IProps {
  accessions: string[]
  source: AveHaplotypesDataSource
}

export interface IState {
  anchorEl?: Element
  // TODO is Set going to work in all our target browsers?
  selected: Set<string>
  filtered: string[]
  query: string
  open: boolean
}

const style = {
  height: 16,
  padding: 1,
  verticalAlign: 'middle',
  width: 16
}

const iconStyle = {
  height: 14,
  width: 14
}

const errorStyle = {
  color: 'rgb(244, 67, 54)'
}

const popoverStyle: React.CSSProperties = { padding: 5, overflowY: 'auto' }

export class AccessionsMenu extends React.Component<IProps, IState> {
  state: IState = {
    filtered: [],
    open: false,
    query: '',
    selected: new Set()
  }

  componentWillMount() {
    this.setState({ filtered: this.props.accessions })
    const accessionsFromSource = this.props.source.accessions
    if (accessionsFromSource.length > 0) {
      this.updateSelectionArray(accessionsFromSource)
    } else {
      this.updateSelectionArray(this.props.accessions)
    }
  }

  onAccessionToggle = (accession: string) => {
    const selected = new Set()
    this.state.selected.forEach(d => {
      if (d === accession) {
        // accession was selected, so should not be selected now
      } else {
        selected.add(d)
      }
    })
    // accession was unselected before, so should be selected now
    if (!this.state.selected.has(accession)) {
      selected.add(accession)
    }
    this.updateSelection(selected)
  }

  selectAll = () => {
    this.updateSelectionArray(this.props.accessions)
  }

  selectNone = () => {
    this.updateSelectionArray([])
  }

  selectInvert = () => {
    const currentSelection = this.state.selected
    const invertedSelection = this.props.accessions.filter(
      d => !currentSelection.has(d)
    )
    this.updateSelectionArray(invertedSelection)
  }

  updateSelectionArray(accessions: string[]) {
    const selected = new Set()
    accessions.forEach(d => selected.add(d))
    this.updateSelection(selected)
  }

  updateSelection(selected: Set<string>) {
    this.setState({ selected })
    const accessions: string[] = []
    if (selected.size < this.props.accessions.length) {
      selected.forEach(d => accessions.push(d))
    }
    this.props.source.setAccessions(accessions)
  }

  onFilter = (_e: any, query: string) => {
    let filtered: string[]
    if (query === '') {
      filtered = this.props.accessions
    } else {
      const filterIt = (c: string) => c.includes(query)
      filtered = this.props.accessions.filter(filterIt)
    }
    this.setState({
      query,
      filtered
    })
  }

  closeDialog = () => {
    if (this.state.selected.size !== 0) {
      this.setState({
        open: false
      })
    }
  }

  openDialog = (event: any) => {
    event.preventDefault()
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    })
  }

  isAllSelected() {
    return this.props.accessions.length === this.state.selected.size
  }

  isNoneSelected() {
    return this.state.selected.size === 0
  }

  render() {
    const items = this.state.filtered.map((d, i) => (
      <AccessionMenuItem
        key={i}
        accession={d}
        selected={this.state.selected.has(d)}
        onToggle={this.onAccessionToggle}
      />
    ))
    let error = null
    if (this.isNoneSelected()) {
      error = <span style={errorStyle}>No accessions selected</span>
    }
    return (
      <div>
        {this.renderIconButton()}
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.closeDialog}
          zDepth={2}
          style={popoverStyle}
        >
          <div>
            {this.renderFilter()}
            {this.renderSelectionButtons()}
          </div>
          {error}
          <List>{items}</List>
        </Popover>
      </div>
    )
  }

  renderIconButton = () => (
    <IconButton
      style={style}
      tooltip="Select accessions"
      iconStyle={iconStyle}
      disabled={!this.props.accessions}
      color={this.isAllSelected() ? black : blue500}
      onClick={this.openDialog}
    >
      <ActionSettings />
    </IconButton>
  )

  renderFilter = () => (
    <div>
      <TextField
        hintText="Filter accessions"
        value={this.state.query}
        onChange={this.onFilter}
        errorText={
          this.state.filtered.length === 0 ? 'No accessions matches filter' : ''
        }
      />
    </div>
  )

  renderSelectionButtons = () => (
    <div>
      <FlatButton
        label="All"
        disabled={this.isAllSelected()}
        onTouchTap={this.selectAll}
      />
      <FlatButton
        label="None"
        disabled={this.isNoneSelected()}
        onTouchTap={this.selectNone}
      />
      <FlatButton label="Invert" onTouchTap={this.selectInvert} />
    </div>
  )
}
