import * as React from 'react'

import { shallow } from 'enzyme'

import { VariantInfo } from './VariantInfo'

describe('<VariantInfo/>', () => {
  it('render', () => {
    const variant = {
      id: 'id placeholder',
      chrom: 'SL2.40ch05',
      filter: 'filter placeholder',
      pos: 100,
      ref: 'A',
      alt: ['C'],
      qual: 54.3,
      info: {
        some: 'info placeholder'
      },
      genotypes: [
        {
          accession: 'a1',
          alt_ambiguous_nucleotide: 'G',
          is_homozygous: 'True',
          type: '1/1'
        },
        {
          accession: 'a2',
          alt_ambiguous_nucleotide: 'G',
          is_homozygous: 'True',
          type: '1/1'
        }
      ]
    }
    const wrapper = shallow(<VariantInfo variant={variant} />)

    expect(wrapper.contains(<div>Identifier: id placeholder</div>)).toBeTruthy()
  })
})
