import * as React from 'react'

import { shallow, ShallowWrapper } from 'enzyme'

import { IProps, IState, SettingsPage } from './SettingsPage'

describe('<SettingsPage/>', () => {
  let props: IProps

  beforeEach(() => {
    props = {
      apiroot: '/api',
      flank: 1000,
      resetSettings: jest.fn(),
      saveSettings: jest.fn()
    }
  })

  describe('render()', () => {
    let comp: ShallowWrapper<IProps, IState>

    beforeEach(() => {
      comp = shallow(<SettingsPage {...props} />)
    })

    it('should have initial state equal to props', () => {
      const expected = {
        apiroot: '/api',
        flank: 1000
      }
      expect(comp.state()).toEqual(expected)
    })

    describe('on api root change', () => {
      beforeEach(() => {
        comp.find({ value: '/api' }).simulate('change', {}, '/newapi')
      })

      it('should have state set', () => {
        expect(comp.state('apiroot')).toEqual('/newapi')
      })
    })

    describe('on flank change', () => {
      beforeEach(() => {
        comp.find({ value: 1000 }).simulate('change', {}, '1234')
      })

      it('should have state set', () => {
        expect(comp.state('flank')).toEqual(1234)
      })
    })

    describe('when save button clicked', () => {
      beforeEach(() => {
        const button = comp.find({ label: 'Save' })
        button.simulate('touchTap')
      })

      it('should not call props.saveSettings, because nothing changed', () => {
        expect(props.saveSettings).not.toBeCalled()
      })
    })

    describe('when reset button is clicked', () => {
      beforeEach(() => {
        comp.find({ label: 'Reset' }).simulate('touchTap')
      })

      it('should call props.resetSettings', () => {
        expect(props.resetSettings).toHaveBeenCalled()
      })
    })

    describe('after fields have changed', () => {
      beforeEach(() => {
        comp.find({ value: '/api' }).simulate('change', {}, '/newapi')
        comp.find({ value: 1000 }).simulate('change', {}, '1234')
      })

      describe('when save button clicked', () => {
        beforeEach(() => {
          const button = comp.find({ label: 'Save' })
          button.simulate('touchTap')
        })

        it('should call props.saveSettings', () => {
          expect(props.saveSettings).toHaveBeenCalledWith('/newapi', 1234)
        })
      })
    })

    describe('when props are updated', () => {
      beforeEach(() => {
        const nextProps = {
          apiroot: '/api/v2',
          flank: 42,
          resetSettings: jest.fn(),
          saveSettings: jest.fn()
        }
        comp.setProps(nextProps)
      })

      it('should set apiroot+flank in state', () => {
        const expected = {
          apiroot: '/api/v2',
          flank: 42
        }
        expect(comp.state()).toEqual(expected)
      })
    })
  })
})
