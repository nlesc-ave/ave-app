import * as React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import { IHaplotype, IVariant } from '../AveHaplotypesDataSource'
import { HaplotypeInfo } from './HaplotypeInfo'
import { VariantInfo } from './VariantInfo'

interface IProps {
  haplotype: IHaplotype
  variant: IVariant
  onClose(): void
}

export const VariantDialog = ({ haplotype, onClose, variant }: IProps) => {
  const actions = [
    <FlatButton label="Close" primary={true} onTouchTap={onClose} />
  ]
  return (
    <Dialog
      title="Variant information"
      open={true}
      onRequestClose={onClose}
      actions={actions}
      autoScrollBodyContent={true}
    >
      <VariantInfo variant={variant} />
      <h2>Part of haplotype</h2>
      <HaplotypeInfo haplotype={haplotype} />
    </Dialog>
  )
}
