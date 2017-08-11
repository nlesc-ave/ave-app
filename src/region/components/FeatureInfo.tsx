import * as React from 'react';

interface IProps {
    feature: IFeatureAnnotation;
}

export const FeatureInfo = ({feature}: IProps) => {
    const attributes = Object.keys(feature.attributes).map(
        (k) => <div>{k}: {feature.attributes[k]}</div>
    );
    return (
        <div>
            <div>Source: {feature.source}</div>
            <div>Type: {feature.feature}</div>
            <div>Score: {feature.score}</div>
            <div>Position: {feature.sequence}:{feature.start}-{feature.end}</div>
            <div>Strand: {feature.strand}</div>
            <div>Phase: {feature.phase}</div>
            <h3>Attributes</h3>
            {attributes}
        </div>
    );
};
