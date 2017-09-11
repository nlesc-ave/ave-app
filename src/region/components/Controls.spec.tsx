import * as React from 'react'

import { shallow, ShallowWrapper } from 'enzyme'

import { Controls, IProps } from './Controls'

function sampleProps(start = 2000, stop = 3000): IProps {
  return {
    chromosomes: [
      {
        chrom_id: 'chr1',
        length: 100000
      },
      {
        chrom_id: 'chr2',
        length: 200000
      }
    ],
    onChange: jest.fn(),
    range: {
      contig: 'chr1',
      start,
      stop
    }
  }
}

describe('<Controls/>', () => {
  let props: IProps
  let comp: ShallowWrapper<IProps, {}>

  describe('render()', () => {
    describe('in middle of chromosome', () => {
      beforeAll(() => {
        props = sampleProps()
        comp = shallow(<Controls {...props} />)
      })

      it('should have <RangeSelector/>', () => {
        expect(comp.find('RangeSelector').exists()).toBeTruthy()
      })

      it('should have 4 enabled buttons', () => {
        expect(comp.find('IconButton').length).toEqual(4)
        comp.find('IconButton').forEach(b => {
          expect(b.prop('disabled')).toBeFalsy()
        })
      })

      describe('Range changed', () => {
        it('should call props.onChange function', () => {
          const newRange = {
            contig: 'chr2',
            start: 1000,
            stop: 2000
          }
          comp.find('RangeSelector').simulate('change', newRange)

          expect(props.onChange).toBeCalledWith(newRange)
        })
      })

      describe('prev window click', () => {
        it('should call props.onChange function with prev window start/stop', () => {
          comp.find({ tooltip: 'Back 1 window' }).simulate('touchTap')

          const newRange = {
            contig: 'chr1',
            start: 1000,
            stop: 2000
          }
          expect(props.onChange).toBeCalledWith(newRange)
        })
      })

      describe('next window click', () => {
        it('should call props.onChange function with next window start/stop', () => {
          comp.find({ tooltip: 'Forward 1 window' }).simulate('touchTap')

          const newRange = {
            contig: 'chr1',
            start: 3000,
            stop: 4000
          }
          expect(props.onChange).toBeCalledWith(newRange)
        })
      })

      describe('zoom in click', () => {
        it('should zoom in 1x time', () => {
          comp.find({ tooltip: 'Zoom in' }).simulate('touchTap')

          const newRange = {
            contig: 'chr1',
            start: 2250,
            stop: 2750
          }
          expect(props.onChange).toBeCalledWith(newRange)
        })
      })

      describe('zoom out click', () => {
        it('should zoom out 1x time', () => {
          comp.find({ tooltip: 'Zoom out' }).simulate('touchTap')

          const newRange = {
            contig: 'chr1',
            start: 1000,
            stop: 4000
          }
          expect(props.onChange).toBeCalledWith(newRange)
        })
      })
    })

    describe('at start of chromosome', () => {
      beforeAll(() => {
        props = sampleProps(1, 1000)
        comp = shallow(<Controls {...props} />)
      })

      it('should have "Back 1 window" button disabled', () => {
        const button = comp.find({ tooltip: 'Back 1 window' })
        expect(button.prop('disabled')).toBeTruthy()
      })
    })

    describe('at start of chromosome', () => {
      beforeAll(() => {
        props = sampleProps(100000 - 1000, 100000)
        comp = shallow(<Controls {...props} />)
      })

      it('should have "Forward 1 window" button disabled', () => {
        const button = comp.find({ tooltip: 'Forward 1 window' })
        expect(button.prop('disabled')).toBeTruthy()
      })
    })
  })
})
