import { AddUsagerMarker } from './add-usager-marker.pipe';
import { MarkerProperties } from '../models';
import { FeatureCollection, Point } from 'geojson';
import { Coordinates } from '../../../core';
import { Marker } from '../../configuration';

// eslint-disable-next-line max-lines-per-function
describe('AddUsagerMarker pipe', (): void => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let pipeInstance: AddUsagerMarker;

  beforeEach((): void => {
    pipeInstance = new AddUsagerMarker();
  });

  it('should return an unchanged collection if usager coordinates are null', (): void => {
    const featureCollection: FeatureCollection<Point, MarkerProperties> = {
      features: [],
      type: 'FeatureCollection'
    };

    expect(pipeInstance.transform(featureCollection)).toStrictEqual(featureCollection);
  });

  // eslint-disable-next-line max-lines-per-function
  it('should return the collection with and additional element', (): void => {
    const featureCollection: FeatureCollection<Point, MarkerProperties> = {
      features: [
        {
          geometry: {
            coordinates: [0, 0],
            type: 'Point'
          },
          properties: {
            markerIconConfiguration: Marker.Cnfs
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    expect(pipeInstance.transform(featureCollection, new Coordinates(45, 23))).toStrictEqual({
      features: [
        {
          geometry: {
            coordinates: [0, 0],
            type: 'Point'
          },
          properties: {
            markerIconConfiguration: Marker.Cnfs
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [23, 45],
            type: 'Point'
          },
          properties: {
            markerIconConfiguration: Marker.Usager,
            zIndexOffset: 1000
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    });
  });
});