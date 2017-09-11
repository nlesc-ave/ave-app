import * as React from 'react'

import { Link } from 'react-router-dom'

import { Gene } from 'pileup/dist/main/viz/GeneTrack'

interface IProps {
  gene: Gene
  regionUrl: string
}

export const GeneInfo = ({ gene, regionUrl }: IProps) => {
  return (
    <div>
      <div>Gene identifier: {gene.geneId}</div>
      <div>Transcript identifier: {gene.id}</div>
      <h3>Name</h3>
      {gene.name}
      <h3>Position</h3>
      <Link to={regionUrl}>
        {gene.position.contig}:{gene.position.interval.start}-{gene.position.interval.stop}
      </Link>
    </div>
  )
}
