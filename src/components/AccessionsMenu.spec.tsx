import * as React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { AveVariantsDataSource } from '../sources/AveVariantsDataSource';
import { AccessionsMenu, IProps, IState } from './AccessionsMenu';

const DEFAULT_ACCESSIONS = ['a1', 'a2', 'a3'];

describe('<AccessionsMenu/>', () => {
    describe('with empty source', () => {
        it('should have an empty initialState', () => {
            const source = new AveVariantsDataSource('some genome id', '/');
            const wrapper = shallow(<AccessionsMenu source={source}/>);
            const expected = {
                accessions: [],
                selected: new Set()
            };
            expect(wrapper.state()).toEqual(expected);
        });
    });

    describe('with filled source', () => {
        let wrapper: ShallowWrapper<IProps, IState>;
        beforeEach(() => {
            const source = new AveVariantsDataSource('some genome id', '/');
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
            source.loadVariants(response, interval);
            wrapper = shallow<IProps, IState>(<AccessionsMenu source={source}/>);
        });

        it('should have selected all', () => {
            const expected = new Set(DEFAULT_ACCESSIONS);
            expect(wrapper.state().selected).toEqual(expected);
        });

        describe('when a1 accession is unchecked', () => {
            it('should not be selected', () => {
                wrapper.find({accession: 'a1'}).simulate('toggle', 'a1');

                expect(wrapper.state().selected.has('a1')).toBeFalsy();
            });
        });
    });
});
