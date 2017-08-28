import * as React from 'react';

import { Link } from 'react-router-dom';

interface IProps {
    feature: IFeatureAnnotation;
    regionUrl: string;
}

export const FeatureInfo = ({feature, regionUrl}: IProps) => {
    const attributes = Object.keys(feature.attributes).map(
        (k) => <div>{k}: {feature.attributes[k]}</div>
    );
    return (
        <div>
            <div>Source: {feature.source}</div>
            <div>Type: {feature.feature}</div>
            <div>Score: {feature.score}</div>
            <div>Position:
                <Link to={regionUrl}>
                    {feature.sequence}:{feature.start}-{feature.end}
                </Link>
            </div>
            <div>Strand: {feature.strand}</div>
            <div>Phase: {feature.phase}</div>
            <h3>Attributes</h3>
            {attributes}
        </div>
    );
};
