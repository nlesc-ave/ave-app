import * as React from 'react'

import { shallow } from 'enzyme'

import { VariantInfo } from './VariantInfo'

describe('<VariantInfo/>', () => {
  it('render', () => {
    const variant = {
      alt: ['C'],
      chrom: 'SL2.40ch05',
      filter: 'filter placeholder',
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
      ],
      id: 'id placeholder',
      info: {
        some: 'info placeholder'
      },
      pos: 100,
      qual: 54.3,
      ref: 'A'
    }
    const wrapper = shallow(<VariantInfo variant={variant} />)

    expect(wrapper.contains(<div>Identifier: id placeholder</div>)).toBeTruthy()
  })
})
