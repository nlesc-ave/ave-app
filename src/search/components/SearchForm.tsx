import * as React from 'react';

import {List, ListItem} from 'material-ui/List';
import RadioButton from 'material-ui/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router-dom';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface IProps {
    genome_id: string;
    flank: number;
    apiroot: string;
}

type AnnotationType = 'genes' | 'features';

interface IHit {
    key: string;
    primaryText: string;
    secondaryText: string;
    route: string;
}

interface IState {
    annotation_type: AnnotationType;
    hits: IHit[];
    query: string;
}

export class SearchForm extends React.Component<IProps, IState> {
    state: IState = {hits: [], annotation_type: 'genes', query: ''};
    querySubject = new Subject<string>();
    queryObservable: Observable<string>;

    constructor() {
        super();
        this.queryObservable = this.querySubject.distinctUntilChanged().debounceTime(500);
        this.queryObservable.subscribe(this.fetch.bind(this));
    }

    onAnnotationTypeChange = (_event: any, annotation_type: AnnotationType) => {
        this.setState({
            annotation_type,
            hits: []
        });
        this.fetch(this.state.query);
    }

    onQueryChange = (_event: any, query: string) => {
        this.setState({query});
        this.querySubject.next(query);
    }

    fetch(query: string) {
        if (!query) {
            this.setState({hits: [] });
            return;
        }
        switch (this.state.annotation_type) {
            case 'genes':
                this.fetchGeneAnnotations(query);
                break;
            default:
                this.fetchFeatureAnnotations(query);
        }
    }

    mapGeneAnnotation2Hit = (annotation: IGeneAnnotation) => {
        const { chrom, start, end } = annotation.position;
        const flank = this.props.flank;
        const route = `${this.props.genome_id}/${chrom}/${start - flank}/${end + flank}`;
        return {
            key: annotation.id,
            primaryText: annotation.id,
            route,
            secondaryText: annotation.name
        };
    }

    mapFeatureAnnotation2Hit = (annotation: IFeatureAnnotation) => {
        const flank = this.props.flank;
        const { sequence, start, end } = annotation;
        const route = `${this.props.genome_id}/${sequence}/${start - flank}/${end + flank}`;
        return {
            key: annotation.attributes.id,
            primaryText: annotation.attributes.id,
            route,
            secondaryText: annotation.attributes.name
        };
    }

    fetchGeneAnnotations(query: string) {
        const url = `${this.props.apiroot}/genomes/${this.props.genome_id}/genes?query=${query}`;
        return fetch(url)
            .then<IGeneAnnotation[]>((r) => r.json())
            .then((annotations) => annotations.map(this.mapGeneAnnotation2Hit))
            .then((hits) => this.setState({hits}))
        ;
    }

    fetchFeatureAnnotations(query: string) {
        const url = `${this.props.apiroot}/genomes/${this.props.genome_id}/features?query=${query}`;
        return fetch(url)
            .then<IFeatureAnnotation[]>((r) => r.json())
            .then((annotations) => annotations.map(this.mapFeatureAnnotation2Hit))
            .then((hits) => this.setState({hits}))
        ;
    }

    render() {
        const queryHint = 'Search term';
        const hits = this.state.hits.map(({key, primaryText, secondaryText, route}) => (
                <ListItem
                    key={key}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                    secondaryTextLines={2}
                    containerElement={<Link to={'/region/' + route}/>}
                />
            )
        );
        return (
            <div>
                <RadioButtonGroup
                    name="annotation_type"
                    defaultSelected={this.state.annotation_type}
                    onChange={this.onAnnotationTypeChange}
                >
                    <RadioButton
                        value="genes"
                        label="Gene"
                    />
                    <RadioButton
                        value="features"
                        label="Features"
                    />
                </RadioButtonGroup>
                <TextField
                    hintText={queryHint}
                    onChange={this.onQueryChange}
                    value={this.state.query}
                />
                <List>
                    {hits}
                </List>
            </div>
        );
    }
}
