import * as React from 'react';

import * as d3 from 'd3';

import {AveVariantsDataSource, IVariantNode} from '../sources/AveVariantsDataSource';
import {HAPLOTYPE_HEIGHT, HAPLOTYPE_PADDING} from './HaplotypeTrack';

import './HaplotypeTree.css';

interface IProps {
    source: AveVariantsDataSource;
    width: number;
}

interface IState {
    hierarchy: IVariantNode;
    leafs: number;
}

export class HaplotypeTree extends React.Component<IProps, IState> {
    loadData() {
        this.setState({
            hierarchy: this.props.source.hierarchy,
            leafs: this.props.source.haplotypes.length
        });
    }

    componentDidMount() {
        this.props.source.on('newdata', this.loadData.bind(this));
    }

    render() {
        if (this.state == null) {
            return <svg/>;
        }
        const height = this.state.leafs * (HAPLOTYPE_HEIGHT + HAPLOTYPE_PADDING);
        const cluster = d3.layout.cluster().size([height, this.props.width]).separation(() => 1);
        const nodes = cluster.nodes(this.state.hierarchy);
        // tslint:disable-next-line:prefer-array-literal
        const links = cluster.links(nodes) as Array<d3.svg.diagonal.Link<d3.svg.diagonal.Node>>;
        const diagonal = d3.svg.diagonal().projection((d) => [d.y, d.x]);
        const linkStyle = {fill: 'none', stroke: 'darkgrey', strokeWidth: '.8px'};
        const compLinks = links.map((l, i) => <path key={i} d={diagonal(l)} style={linkStyle}/>);
        return (
            <div className="haplotree">
                <svg width={this.props.width} height={height}>
                    {compLinks}
                </svg>
            </div>
        );
    }
}
