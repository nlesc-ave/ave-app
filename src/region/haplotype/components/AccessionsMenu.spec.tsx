import * as React from 'react'

import { shallow, ShallowWrapper } from 'enzyme'

import { AveHaplotypesDataSource } from '../AveHaplotypesDataSource'
import { AccessionsMenu, IProps, IState } from './AccessionsMenu'

const DEFAULT_ACCESSIONS = ['a1', 'a2', 'a3']

describe('<AccessionsMenu/>', () => {
  describe('without accessions', () => {
    it('should have selected all accessions', () => {
      const source = new AveHaplotypesDataSource(
        'some genome id',
        '/',
        DEFAULT_ACCESSIONS
      )
      const wrapper = shallow(
        <AccessionsMenu accessions={[]} source={source} />
      )
      const expected = new Set(DEFAULT_ACCESSIONS)
      expect(wrapper.state().selected).toEqual(expected)
    })
  })

  describe('with accessions', () => {
    let wrapper: ShallowWrapper<IProps, IState>
    let source: AveHaplotypesDataSource
    beforeEach(() => {
      source = new AveHaplotypesDataSource(
        'some genome id',
        '/',
        DEFAULT_ACCESSIONS
      )
      source.setAccessions = jest.fn()
      const response = {
        haplotypes: [
          {
            accessions: DEFAULT_ACCESSIONS,
            haplotype_id: 'h1',
            sequence: 'ACTG',
            variants: []
          }
        ],
        hierarchy: {}
      }
      source.load(response)
      wrapper = shallow<IProps, IState>(
        <AccessionsMenu accessions={DEFAULT_ACCESSIONS} source={source} />
      )
    })

    it('should have selected all accessions', () => {
      const expected = new Set(DEFAULT_ACCESSIONS)
      expect(wrapper.state().selected).toEqual(expected)
    })

    it('should have `All` menu item disabled', () => {
      const menuItem = wrapper.find({ label: 'All' })
      expect(menuItem.prop('disabled')).toBeTruthy()
    })

    describe('when a1 accession is unchecked', () => {
      beforeEach(() => {
        wrapper.find({ accession: 'a1' }).simulate('toggle', 'a1')
      })

      it('should not be selected', () => {
        expect(wrapper.state().selected.has('a1')).toBeFalsy()
      })

      it('should call source.setAccessions', () => {
        expect(source.setAccessions).toBeCalledWith(['a2', 'a3'])
      })

      it('should have `All` menu item enabled', () => {
        const menuItem = wrapper.find({ label: 'All' })
        expect(menuItem.prop('disabled')).toBeFalsy()
      })

      describe('when selected all clicked', () => {
        beforeEach(() => {
          wrapper.find({ label: 'All' }).simulate('touchTap')
        })

        it('should selected all', () => {
          const expected = new Set(DEFAULT_ACCESSIONS)
          expect(wrapper.state().selected).toEqual(expected)
        })

        it('should call source.setAccessions', () => {
          expect(source.setAccessions).toBeCalledWith([])
        })
      })

      describe('when a1 accession is checked', () => {
        beforeEach(() => {
          wrapper.find({ accession: 'a1' }).simulate('toggle', 'a1')
        })

        it('should selected all', () => {
          const expected = DEFAULT_ACCESSIONS
          // jest does not work on Set object, so convert it into an array.
          const selected = [...wrapper.state().selected]
          expect(selected).toEqual(expect.arrayContaining(expected))
        })

        it('should call source.setAccessions', () => {
          expect(source.setAccessions).toBeCalledWith([])
        })
      })
    })
  })
})
