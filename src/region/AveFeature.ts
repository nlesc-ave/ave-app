import Feature from 'pileup/dist/main/data/feature';

export class AveFeature extends Feature {
    annotation: IFeatureAnnotation;

    constructor(feature: object, annotation: IFeatureAnnotation) {
        super(feature);
        this.annotation = annotation;
    }
}
