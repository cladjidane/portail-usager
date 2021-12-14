import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import Supercluster, { PointFeature } from 'supercluster';

import { Marker } from '../../configuration';
import { AnyGeoJsonProperty } from '../../../../../environments/environment.model';
import { ViewBox } from '../directives/leaflet-map-state-change';
import { Feature, FeatureCollection, Point } from 'geojson';
import { EMPTY_FEATURE_COLLECTION, MarkerProperties } from '../models';
import { setMarkerIcon } from '../pipes/marker-icon-helper';

const CLUSTER_MAX_ZOOM_DISPLAY: number = 12;
const CLUSTER_RADIUS: number = 40;

@Injectable()
export class ClusterService {
  private _isReady: boolean = false;
  public readonly clusterRadius: number = CLUSTER_RADIUS;
  public readonly index: Supercluster<AnyGeoJsonProperty, AnyGeoJsonProperty> = ClusterService.initCluster();
  public readonly maxZoom: number = CLUSTER_MAX_ZOOM_DISPLAY;

  public get isReady(): boolean {
    return this._isReady;
  }

  public static initCluster(): Supercluster<AnyGeoJsonProperty, AnyGeoJsonProperty> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return new Supercluster({
      maxZoom: CLUSTER_MAX_ZOOM_DISPLAY,
      radius: CLUSTER_RADIUS
    } as Supercluster.Options<AnyGeoJsonProperty, AnyGeoJsonProperty>);
  }

  public exceedClusterZoomLevel(zoomlevel: number): boolean {
    return zoomlevel > this.maxZoom;
  }

  public getMarkerAtZoomLevel(zoomlevel: number): Marker {
    return this.exceedClusterZoomLevel(zoomlevel) ? Marker.Cnfs : Marker.CnfsCluster;
  }

  public load(points: PointFeature<AnyGeoJsonProperty>[]): void {
    if (this._isReady) throw new Error('ClusterService data is already loaded !');
    this.index.load(points);
    this._isReady = true;
  }

  public onlyVisibleMarkers(
    cnfsFeatureCollection: FeatureCollection<Point, AnyGeoJsonProperty>,
    viewBox: ViewBox
  ): Feature<Point, MarkerProperties>[] {
    if (!this._isReady) this.load(cnfsFeatureCollection.features);
    return this.viewCulling(viewBox).features.map(setMarkerIcon(this.getMarkerAtZoomLevel(viewBox.zoomLevel)));
  }

  public viewCulling(viewBox?: ViewBox | null): FeatureCollection<Point, AnyGeoJsonProperty> {
    if (viewBox == null || !this._isReady) return EMPTY_FEATURE_COLLECTION;

    return {
      features: this.viewCullingGetFinalFeatures(viewBox),
      type: 'FeatureCollection'
    };
  }

  public viewCullingGetClusterLeaves(cluster: Feature<Point, AnyGeoJsonProperty>): Feature<Point, AnyGeoJsonProperty>[] {
    if (cluster.properties['cluster'] === true) return this.index.getLeaves(Number(cluster.id), Infinity);
    return [cluster];
  }

  public viewCullingGetFinalFeatures(viewbox: ViewBox): Feature<Point, AnyGeoJsonProperty>[] {
    return this.viewCullingGetFinalMarkersPositions(viewbox);
  }

  public viewCullingGetFinalMarkersPositions(viewbox: ViewBox): Feature<Point, AnyGeoJsonProperty>[] {
    const clustersForViewbox: Feature<Point, AnyGeoJsonProperty>[] = this.index.getClusters(
      viewbox.boundingBox,
      viewbox.zoomLevel
    );

    if (this.exceedClusterZoomLevel(viewbox.zoomLevel)) {
      return clustersForViewbox.flatMap((cluster: Feature<Point, AnyGeoJsonProperty>): Feature<Point, AnyGeoJsonProperty>[] =>
        this.viewCullingGetClusterLeaves(cluster)
      );
    }

    return clustersForViewbox;
  }
}
