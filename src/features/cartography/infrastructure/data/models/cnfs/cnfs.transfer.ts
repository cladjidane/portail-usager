import { Feature, FeatureCollection, Point } from 'geojson';

export interface CnfsTransferProperties {
  id: string;
  name: string;
  isLabeledFranceServices?: boolean;
  openingHours?: string[];
  address?: string;
}

export interface CnfsTransfer extends FeatureCollection {
  features: Feature<Point, CnfsTransferProperties>[];
}
