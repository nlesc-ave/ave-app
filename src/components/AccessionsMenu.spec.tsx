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
                    id: 'h1',
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
        });
    });
});
