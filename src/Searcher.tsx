import * as React from 'react';

import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Popover from 'material-ui/Popover';
import RadioButton from 'material-ui/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import ActionSearch from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router-dom';

interface IProps {
    genome_id: string;
    padding: number;
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
    anchorEl?: Element;
    annotation_type: AnnotationType;
    open: boolean;
    hits: IHit[];
    query: string;
}

export class Searcher extends React.Component<IProps, IState> {
    state: IState = {open: false, hits: [], annotation_type: 'genes', query: ''};

    constructor(props: IProps) {
        super(props);

        this.closeSearchDialog = this.closeSearchDialog.bind(this);
        this.openSearchDialog = this.openSearchDialog.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.onAnnotationTypeChange = this.onAnnotationTypeChange.bind(this);
        this.fetchGeneAnnotations = this.fetchGeneAnnotations.bind(this);
        this.fetchFeatureAnnotations = this.fetchFeatureAnnotations.bind(this);
        this.mapGeneAnnotation2Hit = this.mapGeneAnnotation2Hit.bind(this);
        this.mapFeatureAnnotation2Hit = this.mapFeatureAnnotation2Hit.bind(this);
    }

    closeSearchDialog() {
        this.setState({
            open: false
        });
    }

    openSearchDialog(event: any) {
        event.preventDefault();
        this.setState({
            anchorEl: event.currentTarget,
            open: true
        });
    }

    onAnnotationTypeChange(_event: any, annotation_type: AnnotationType) {
        this.setState({
            annotation_type,
            hits: []
        });
        this.fetch(this.state.query);
    }

    onQueryChange(_event: any, query: string) {
        this.setState({query});
        this.fetch(query);
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

    mapGeneAnnotation2Hit(annotation: IGeneAnnotation) {
        const { chrom, start, end } = annotation.position;
        const flank = this.props.padding;
        const route = `${this.props.genome_id}/${chrom}/${start - flank}/${end + flank}`;
        return {
            key: annotation.id,
            primaryText: annotation.id,
            route,
            secondaryText: annotation.name
        };
    }

    mapFeatureAnnotation2Hit(annotation: IFeatureAnnotation) {
        const flank = this.props.padding;
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
                <IconButton tooltip="Search" onTouchTap={this.openSearchDialog}><ActionSearch /></IconButton>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.closeSearchDialog}
                    zDepth={2}
                    style={{padding: 5}}
                >
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
                </Popover>
            </div>
        );
    }
}
