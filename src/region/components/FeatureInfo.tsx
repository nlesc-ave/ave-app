import * as React from 'react'

import Feature from 'pileup/dist/main/data/feature'
import { Link } from 'react-router-dom'

interface IProps {
  feature: Feature
  regionUrl: string
}

export const FeatureInfo = ({ feature, regionUrl }: IProps) => {
  return (
    <div>
      <div>ID: {feature.id}</div>
      <div>Source: {feature.source}</div>
      <div>Type: {feature.featureType}</div>
      <div>Score: {feature.score}</div>
      <div>
        Position:
        <Link to={regionUrl}>
          {feature.contig}:{feature.start}-{feature.stop}
        </Link>
      </div>
      <div>Strand: {feature.strand}</div>
      <div>Phase: {feature.phase}</div>
      <h3>Attributes</h3>
      {feature.attributes}
    </div>
  )
}
