import * as React from 'react'

import * as dataCanvas from 'data-canvas'
import { BASE_COLORS } from 'pileup/dist/main/style'
import * as canvasUtils from 'pileup/dist/main/viz/canvas-utils'
import * as d3utils from 'pileup/dist/main/viz/d3utils'

import {
  AveHaplotypesDataSource,
  IHaplotype,
  IVariant
} from '../AveHaplotypesDataSource'
import { HaplotypeDialog } from './HaplotypeDialog'
import { VariantDialog } from './VariantDialog'

interface IGenomeRange {
  contig: string
  start: number // inclusive
  stop: number // inclusive
}

interface IProps {
  source: AveHaplotypesDataSource
  width: number
  height: number
  range: IGenomeRange
  referenceSource: any
  options: {}
}

interface IState {
  selectedVariant?: IVariant
  selectedHaplotype?: IHaplotype
  error: string
}

interface ProblemDetail {
  detail: string
  title: string
  type: string
  status: number
}

const VARIANT_HETEROZYGOUS_FILL = 'gold'
const VARIANT_HOMOZYGOUS_FILL = 'red'
const VARIANT_RADIUS = 7
const VARIANT_TEXT_THRESHOLD = 10
const VARIANT_LINE_THRESHOLD = 0.1
const HAPLOTYPE_TOP_MARGIN = 20
export const HAPLOTYPE_HEIGHT = 16
const HAPLOTYPE_STROKE = 'darkgrey'
const HAPLOTYPE_SIZE_STROKE = 'black'
const HAPLOTYPE_FILL = 'white'
export const HAPLOTYPE_PADDING = 4
const containerStyles = { height: '100%' }
const errorStyle = { color: 'red' }
const AMBIGUOUS_BASE_COLORS: { [key: string]: string } = {
  ...BASE_COLORS,
  B: '#c7eae5',
  D: '#80cdc1',
  H: '#35978f',
  K: '#dfc27d',
  M: '#bf812d',
  R: '#f6e8c3',
  S: '#8c510a',
  V: '#01665e',
  W: '#543005',
  X: 'black',
  Y: '#f5f5f5',
  Z: 'black'
}

export class HaplotypeTrack extends React.Component<IProps, IState> {
  static displayName = 'haplotype'
  canvas: Element

  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
    this.canvasRefHandler = this.canvasRefHandler.bind(this)
    this.state = {
      error: ''
    }
  }

  componentDidUpdate() {
    this.updateVisualization()
  }

  componentDidMount() {
    this.props.source.on('newdata', this.newData)
    this.props.source.on('networkfailure', this.setError)
  }

  setError = async (response: Response) => {
    if (response.headers.get('content-type') === 'application/problem+json') {
      const body: ProblemDetail = await response.json()
      this.setState({ error: body.detail })
    } else {
      this.setState({ error: response.statusText })
    }
  }

  newData = () => {
    if (this.state.error) {
      // clear error
      this.setState({ error: '' })
    }
    this.updateVisualization()
  }

  onClick(reactEvent: any) {
    const ev = reactEvent.nativeEvent
    const x = ev.offsetX
    const y = ev.offsetY
    const ctx = canvasUtils.getContext(this.canvas)
    const trackingCtx = new dataCanvas.ClickTrackingContext(ctx, x, y)
    this.renderScene(trackingCtx)

    if (trackingCtx.hit) {
      if (trackingCtx.hit.length === 2) {
        this.setState({
          selectedHaplotype: trackingCtx.hit[1],
          selectedVariant: trackingCtx.hit[0]
        })
      } else {
        this.setState({
          selectedHaplotype: trackingCtx.hit[0]
        })
      }
    }
  }

  onCloseHaplotypeDialog = () => {
    this.setState({
      selectedHaplotype: undefined
    })
  }

  onCloseVariantDialog = () => {
    this.setState({
      selectedHaplotype: undefined,
      selectedVariant: undefined
    })
  }

  buildSequenceUrl(haplotype: IHaplotype) {
    return this.props.source.buildSequenceUrl(haplotype)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={errorStyle}>
          Failed to retrieve haplotypes: {this.state.error}
        </div>
      )
    }
    let dialog
    if (this.state.selectedVariant && this.state.selectedHaplotype) {
      dialog = (
        <VariantDialog
          variant={this.state.selectedVariant}
          haplotype={this.state.selectedHaplotype}
          onClose={this.onCloseVariantDialog}
        />
      )
    } else if (this.state.selectedHaplotype) {
      dialog = (
        <HaplotypeDialog
          haplotype={this.state.selectedHaplotype}
          sequenceUrl={this.buildSequenceUrl(this.state.selectedHaplotype)}
          onClose={this.onCloseHaplotypeDialog}
        />
      )
    }
    return (
      <div style={containerStyles}>
        <canvas onClick={this.onClick} ref={this.canvasRefHandler} />
        {dialog}
      </div>
    )
  }

  updateVisualization() {
    const { width } = this.props
    // Hold off until height & width are known.
    if (width === 0 || !this.canvas) {
      return
    }
    const height =
      this.props.source.haplotypes.length *
        (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING) +
      HAPLOTYPE_TOP_MARGIN
    d3utils.sizeCanvas(this.canvas, width, height)
    const ctx = canvasUtils.getContext(this.canvas)
    const dtx = dataCanvas.getDataContext(ctx)
    this.renderScene(dtx)
  }

  renderScene(ctx: dataCanvas.DataCanvasRenderingContext2D) {
    const range = this.props.range
    const scale = this.getScale()

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.reset()
    ctx.save()

    this.renderHaplotypes(ctx)

    ctx.restore()

    // TODO: the center line should go above alignments, but below mismatches
    this.renderCenterLine(ctx, range, scale)
  }

  renderHaplotypes(ctx: dataCanvas.DataCanvasRenderingContext2D) {
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const haplotypes = this.props.source.haplotypes
    haplotypes.forEach((haplotype, index) =>
      this.renderHaplotype(haplotype, index, ctx)
    )
  }

  renderHaplotype(
    haplotype: IHaplotype,
    index: number,
    ctx: dataCanvas.DataCanvasRenderingContext2D
  ) {
    const range = this.props.range
    const scale = this.getScale()
    const haplotypeWidth = Math.round(scale(range.stop) - scale(range.start))
    ctx.pushObject(haplotype)

    ctx.fillStyle = HAPLOTYPE_FILL
    ctx.strokeStyle = HAPLOTYPE_STROKE
    const yOffset =
      index * (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING) + HAPLOTYPE_TOP_MARGIN
    ctx.fillRect(0, yOffset, haplotypeWidth, HAPLOTYPE_HEIGHT)
    ctx.strokeRect(0, yOffset, haplotypeWidth, HAPLOTYPE_HEIGHT)

    // Number of accessions in haplotype
    ctx.strokeStyle = HAPLOTYPE_SIZE_STROKE
    ctx.strokeText(
      haplotype.accessions.length.toString(),
      2,
      yOffset + Math.round(HAPLOTYPE_HEIGHT / 2)
    )

    haplotype.variants.forEach(variant =>
      this.renderVariant(variant, yOffset, ctx)
    )
    ctx.popObject()
  }

  renderVariant(
    variant: IVariant,
    yOffset: number,
    ctx: dataCanvas.DataCanvasRenderingContext2D
  ) {
    ctx.pushObject(variant)

    const scale = this.getScale()
    const pxPerLetter = scale(1) - scale(0)
    const showText = pxPerLetter >= VARIANT_TEXT_THRESHOLD
    const showLine = pxPerLetter <= VARIANT_LINE_THRESHOLD
    const xCenter = scale(variant.pos)
    const halfHaplotype = Math.round(HAPLOTYPE_HEIGHT / 2)
    const fillStyle = this.getVariantColor(variant, showText)
    if (showText) {
      ctx.fillStyle = HAPLOTYPE_FILL
      // something to click as, fillText is not clickable
      ctx.fillRect(
        xCenter + 1,
        yOffset + 1,
        halfHaplotype,
        HAPLOTYPE_HEIGHT - 2
      )
      ctx.fillStyle = fillStyle
      ctx.fillText(
        variant.genotypes[0].alt_ambiguous_nucleotide,
        xCenter,
        yOffset + halfHaplotype
      )
    } else if (showLine) {
      ctx.fillStyle = fillStyle
      ctx.fillRect(xCenter, yOffset + 1, 1, HAPLOTYPE_HEIGHT - 2)
    } else {
      ctx.fillStyle = fillStyle
      ctx.beginPath()
      const yCenter = yOffset + halfHaplotype
      ctx.arc(xCenter, yCenter, VARIANT_RADIUS, 0, 2 * Math.PI)
      ctx.fill()
    }
    ctx.popObject()
  }

  getVariantColor(variant: IVariant, showText: boolean) {
    const is_homozygous = variant.genotypes[0].is_homozygous
    // Colors based on https://www.ncbi.nlm.nih.gov/tools/sviewer/legends/#anchor_4
    if (is_homozygous) {
      if (showText) {
        const alt_ambiguous_nucleotide =
          variant.genotypes[0].alt_ambiguous_nucleotide
        return AMBIGUOUS_BASE_COLORS[alt_ambiguous_nucleotide]
      } else {
        return VARIANT_HOMOZYGOUS_FILL
      }
    } else {
      return VARIANT_HETEROZYGOUS_FILL
    }
  }

  // Draw the center line(s), which orient the user
  renderCenterLine(
    ctx: CanvasRenderingContext2D,
    range: IGenomeRange,
    scale: (num: number) => number
  ) {
    const midPoint = Math.floor((range.stop + range.start) / 2)
    const rightLineX = Math.ceil(scale(midPoint + 1))
    const leftLineX = Math.floor(scale(midPoint))
    const height = ctx.canvas.height
    ctx.save()
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    if (rightLineX - leftLineX < 3) {
      // If the lines are very close, then just draw a center line.
      const midX = Math.round((leftLineX + rightLineX) / 2)
      canvasUtils.drawLine(ctx, midX - 0.5, 0, midX - 0.5, height)
    } else {
      canvasUtils.drawLine(ctx, leftLineX - 0.5, 0, leftLineX - 0.5, height)
      canvasUtils.drawLine(ctx, rightLineX - 0.5, 0, rightLineX - 0.5, height)
    }
    ctx.restore()
  }

  getScale() {
    return d3utils.getTrackScale(this.props.range, this.props.width)
  }

  canvasRefHandler(ref: Element) {
    this.canvas = ref
  }
}
