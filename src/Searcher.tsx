import * as React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import RadioButton from 'material-ui/RadioButton';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup';
import ActionSearch from 'material-ui/svg-icons/action/search';

interface IProps {
    genome_id: string;
    padding: number;
}

type AnnotationType = 'genes' | 'features';

interface IState {
    open: boolean;
    anchorEl?: Element;
    hits: string[];
    annotation_type: AnnotationType;
}

export class Searcher extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {open: false, hits: [], annotation_type: 'genes'};

        this.closeSearchDialog = this.closeSearchDialog.bind(this);
        this.openSearchDialog = this.openSearchDialog.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
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
           annotation_type
        });
    }

    onQueryChange(query: string) {
        switch (this.state.annotation_type) {
            case 'genes':
                this.fetchGeneAnnotations(query);
                break;
            default:
                this.fetchFeatureAnnotations(query);
        }
    }

    fetchGeneAnnotations(query: string) {
        const url = '/api/genes?query=' + query;
        return fetch(url)
            .then<IGeneAnnotation[]>((r) => r.json())
            .then()
        ;
    }

    fetchFeatureAnnotations(query: string) {
        const url = '/api/features?query=' + query;
        return fetch(url)
            .then<IFeatureAnnotation[]>((r) => r.json())
            .then()
        ;
    }

    render() {
        const queryHint = 'Search term';
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
                    <AutoComplete
                        hintText={queryHint}
                        dataSource={this.state.hits}
                        onUpdateInput={this.onQueryChange}
                        filter={AutoComplete.noFilter}
                    />
                </Popover>
            </div>
        );
    }
}