import * as React from 'react'

import IconButton from 'material-ui/IconButton'
import ZoomIn from 'material-ui/svg-icons/action/zoom-in'
import ZoomOut from 'material-ui/svg-icons/action/zoom-out'
import NextWindow from 'material-ui/svg-icons/av/fast-forward'
import PrevWindow from 'material-ui/svg-icons/av/fast-rewind'

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import { GenomeRange } from 'pileup/dist/main/Root'

import { RangeSelector } from './RangeSelector'

export interface IProps {
  chromosomes: IChromosome[]
  range: GenomeRange
  onChange(newRange: GenomeRange): void
}

export class Controls extends React.Component<IProps, {}> {
  onPrevWindowClick = () => {
    const { contig, start, stop } = this.props.range
    const windowSize = stop - start
    const newRange = {
      contig,
      start: start - windowSize,
      stop: stop - windowSize
    }
    this.props.onChange(this.capRange(newRange))
  }

  onZoomInClick = () => {
    const { contig, start, stop } = this.props.range
    const windowSize = Math.floor((stop - start) / 4)
    const newRange = {
      contig,
      start: start + windowSize,
      stop: stop - windowSize
    }
    this.props.onChange(this.capRange(newRange))
  }

  capRange(range: GenomeRange): GenomeRange {
    const chromLength = this.chromLength()
    let start = range.start
    if (start < 1) {
      start = 1
    }
    let stop = range.stop
    if (stop >= chromLength) {
      stop = chromLength
    }
    return {
      contig: range.contig,
      start,
      stop
    }
  }

  onZoomOutClick = () => {
    const { contig, start, stop } = this.props.range
    const windowSize = stop - start
    const newRange = {
      contig,
      start: start - windowSize,
      stop: stop + windowSize
    }
    this.props.onChange(this.capRange(newRange))
  }

  onNexWindowClick = () => {
    const { contig, start, stop } = this.props.range
    const windowSize = stop - start
    const newRange = {
      contig,
      start: start + windowSize,
      stop: stop + windowSize
    }
    this.props.onChange(this.capRange(newRange))
  }

  chromLength() {
    return this.props.chromosomes.filter(
      c => c.chrom_id === this.props.range.contig
    )[0].length
  }

  render() {
    const { range, chromosomes } = this.props
    const { start, stop } = range
    const windowSize = stop - start
    const chromLength = this.chromLength()
    return (
      <Toolbar>
        <RangeSelector
          chromosomes={chromosomes}
          range={range}
          onChange={this.props.onChange}
        />
        <ToolbarGroup>
          <IconButton
            disabled={start <= 1}
            tooltip="Back 1 window"
            onTouchTap={this.onPrevWindowClick}
          >
            <PrevWindow />
          </IconButton>
          <IconButton
            disabled={windowSize <= 1}
            tooltip="Zoom in"
            onTouchTap={this.onZoomInClick}
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            disabled={windowSize * 2 > chromLength}
            tooltip="Zoom out"
            onTouchTap={this.onZoomOutClick}
          >
            <ZoomOut />
          </IconButton>
          <IconButton
            disabled={stop >= chromLength}
            tooltip="Forward 1 window"
            onTouchTap={this.onNexWindowClick}
          >
            <NextWindow />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}
