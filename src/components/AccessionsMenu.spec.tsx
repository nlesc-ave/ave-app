import * as React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { AveHaplotypesDataSource } from '../sources/AveHaplotypesDataSource';
import { AccessionsMenu, IProps, IState } from './AccessionsMenu';

const DEFAULT_ACCESSIONS = ['a1', 'a2', 'a3'];

describe('<AccessionsMenu/>', () => {
    describe('without accessions', () => {
        it('should have nothing selected', () => {
            const source = new AveHaplotypesDataSource('some genome id', '/');
            const wrapper = shallow(<AccessionsMenu accessions={[]} source={source}/>);
            const expected = {
                selected: new Set()
            };
            expect(wrapper.state()).toEqual(expected);
        });
    });

    describe('with accessions', () => {
        let wrapper: ShallowWrapper<IProps, IState>;
        let source: AveHaplotypesDataSource;
        beforeEach(() => {
            source = new AveHaplotypesDataSource('some genome id', '/');
            source.setAccessions = jest.fn();
            const response = {
                haplotypes: [{
                    accessions: DEFAULT_ACCESSIONS,
                    haplotype_id: 'h1',
                    sequence: 'ACTG',
                    variants: []
                }],
                hierarchy: {}
            };
            const interval = {
                contig: '1',
                length: () => 9,
                start: () => 1,
                stop: () => 10
            };
            source.load(response, interval);
            wrapper = shallow<IProps, IState>(<AccessionsMenu accessions={DEFAULT_ACCESSIONS} source={source}/>);
        });

        it('should have selected all accessions', () => {
            const expected = new Set(DEFAULT_ACCESSIONS);
            expect(wrapper.state().selected).toEqual(expected);
        });

        it('should have `Select all` menu item disabled', () => {
            const menuItem = wrapper.find({primaryText: 'Select all'});
            expect(menuItem.prop('disabled')).toBeTruthy();
        });

        describe('when a1 accession is unchecked', () => {
            beforeEach(() => {
                wrapper.find({accession: 'a1'}).simulate('toggle', 'a1');
            });

            it('should not be selected', () => {
                expect(wrapper.state().selected.has('a1')).toBeFalsy();
            });

            it('should call source.setAccessions', () => {
                expect(source.setAccessions).toBeCalledWith(['a2', 'a3']);
            });

            it('should have `Select all` menu item enabled', () => {
                const menuItem = wrapper.find({primaryText: 'Select all'});
                expect(menuItem.prop('disabled')).toBeFalsy();
            });

            describe('when selected all clicked', () => {
                beforeEach(() => {
                    wrapper.find({primaryText: 'Select all'}).simulate('touchTap');
                });

                it('should selected all', () => {
                    const expected = new Set(DEFAULT_ACCESSIONS);
                    expect(wrapper.state().selected).toEqual(expected);
                });

                it('should call source.setAccessions', () => {
                    expect(source.setAccessions).toBeCalledWith([]);
                });
            });

            describe('when a1 accession is checked', () => {
                beforeEach(() => {
                    wrapper.find({accession: 'a1'}).simulate('toggle', 'a1');
                });

                it('should selected all', () => {
                    const expected = DEFAULT_ACCESSIONS;
                    // jest does not work on Set object, so convert it into an array.
                    const selected = [...wrapper.state().selected];
                    expect(selected).toEqual(expect.arrayContaining(expected));
                });

                it('should call source.setAccessions', () => {
                    expect(source.setAccessions).toBeCalledWith([]);
                });
            });

        });
    });
});
