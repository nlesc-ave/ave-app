import * as React from 'react'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'

import { IVariant } from '../AveHaplotypesDataSource'

interface IProps {
  variant: IVariant
}

export const VariantInfo = ({ variant }: IProps) => {
  const alts = variant.alt.map((d, i) => <li key={i}>{d}</li>)
  const infos = Object.keys(variant.info).map(k => (
    <div key={k}>
      {k}: {variant.info[k]}
    </div>
  ))
  const genotypeHeader = Object.keys(variant.genotypes[0])
    .filter(k => k !== 'accession')
    .map(k => <TableHeaderColumn key={k}>{k}</TableHeaderColumn>)
  const genotypeRows = variant.genotypes.map((g, i) => {
    const cols = Object.keys(g)
      .filter(k => k !== 'accession')
      .map((k, j) => <TableRowColumn key={i + '-' + j}>{g[k]}</TableRowColumn>)
    return (
      <TableRow key={i}>
        <TableRowColumn key={i + '-accession'}>{g.accession}</TableRowColumn>
        {cols}
      </TableRow>
    )
  })
  return (
    <div>
      <div>Identifier: {variant.id}</div>
      <div>
        Position: {variant.chrom}:{variant.pos}
      </div>
      <div>Reference: {variant.ref}</div>
      <h3>Alternatives</h3>
      <ol>{alts}</ol>
      <div>
        Ambiguous nucliotide of alternatives: {variant.alt_ambiguous_nucleotide}
      </div>
      <div>Quality score: {variant.qual}</div>
      <div>Passed filters: {variant.filter}</div>
      <h3>Info</h3>
      {infos}
      <h3>Genotypes</h3>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>accession</TableHeaderColumn>
            {genotypeHeader}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{genotypeRows}</TableBody>
      </Table>
    </div>
  )
}
