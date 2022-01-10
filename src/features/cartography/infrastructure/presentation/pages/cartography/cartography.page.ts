import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  BoundedMarkers,
  CenterView,
  CnfsPermanenceProperties,
  MarkerEvent,
  MarkerProperties,
  PointOfInterestMarkerProperties,
  StructurePresentation,
  TypedMarker
} from '../../models';
import { CartographyPresenter } from './cartography.presenter';
import { BehaviorSubject, merge, Observable, of, Subject, tap } from 'rxjs';
import { Coordinates } from '../../../../core';
import { ViewportAndZoom, ViewReset } from '../../directives/leaflet-map-state-change';
import { CartographyConfiguration, CARTOGRAPHY_TOKEN, Marker } from '../../../configuration';
import { Feature, FeatureCollection, Point } from 'geojson';
import { catchError, combineLatestWith, map, startWith } from 'rxjs/operators';
import { usagerFeatureFromCoordinates } from '../../helpers';
import {
  boundedMarkerEventToCenterView,
  coordinatesToCenterView,
  permanenceMarkerEventToCenterView
} from '../../models/center-view/center-view.presentation-mapper';

// TODO Inject though configuration token
const DEFAULT_MAP_VIEWPORT_AND_ZOOM: ViewportAndZoom = {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
  zoomLevel: 6
};

const addUsagerFeatureToMarkers = (
  visibleMapPointsOfInterest: Feature<Point, PointOfInterestMarkerProperties>[],
  usagerCoordinates: Coordinates | null
): Feature<Point, PointOfInterestMarkerProperties | TypedMarker>[] =>
  usagerCoordinates == null
    ? visibleMapPointsOfInterest
    : [...visibleMapPointsOfInterest, usagerFeatureFromCoordinates(usagerCoordinates)];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartographyPresenter],
  templateUrl: './cartography.page.html'
})
export class CartographyPage {
  private readonly _addressToGeocode$: Subject<string> = new Subject<string>();
  private readonly _mapViewportAndZoom$: Subject<ViewportAndZoom> = new BehaviorSubject<ViewportAndZoom>(
    DEFAULT_MAP_VIEWPORT_AND_ZOOM
  );
  private readonly _usagerCoordinates$: Subject<Coordinates> = new Subject<Coordinates>();

  private readonly _visibleMapPointsOfInterest$: Observable<Feature<Point, PointOfInterestMarkerProperties>[]> = this.presenter
    .visibleMapPointsOfInterestThroughViewportAtZoomLevel$(this._mapViewportAndZoom$)
    .pipe(startWith([]));

  public centerView: CenterView = this.cartographyConfiguration;

  public displayMap: boolean = false;

  public hasAddressError: boolean = false;

  public structuresList$: Observable<StructurePresentation[]> = this.presenter.structuresList$(this._mapViewportAndZoom$);

  public readonly usagerCoordinates$: Observable<Coordinates | null> = merge(
    this.presenter.geocodeAddress$(this._addressToGeocode$),
    this._usagerCoordinates$
  ).pipe(
    tap((coordinates: Coordinates): void => {
      this.centerView = coordinatesToCenterView(coordinates);
    }),
    startWith(null),
    catchError((): Observable<null> => {
      this.hasAddressError = true;
      return of(null);
    })
  );

  public readonly visibleMarkersWithUsager$: Observable<
    FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker>
  > = this._visibleMapPointsOfInterest$.pipe(
    combineLatestWith(this.usagerCoordinates$),
    map(
      ([visibleMapPointsOfInterest, usagerCoordinates]: [
        Feature<Point, PointOfInterestMarkerProperties>[],
        Coordinates | null
      ]): FeatureCollection<Point, PointOfInterestMarkerProperties | TypedMarker> => ({
        features: addUsagerFeatureToMarkers(visibleMapPointsOfInterest, usagerCoordinates),
        type: 'FeatureCollection'
      })
    )
  );

  public constructor(
    private readonly presenter: CartographyPresenter,
    @Inject(CARTOGRAPHY_TOKEN) private readonly cartographyConfiguration: CartographyConfiguration
  ) {}

  private handleBoundedMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    this.centerView = boundedMarkerEventToCenterView(markerEvent as MarkerEvent<MarkerProperties<BoundedMarkers>>);
  }

  private handleCnfsPermanenceMarkerEvents(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    this.centerView = permanenceMarkerEventToCenterView(markerEvent as MarkerEvent<MarkerProperties<CnfsPermanenceProperties>>);
  }

  public onAutoLocateUsagerRequest(coordinates: Coordinates): void {
    this._usagerCoordinates$.next(coordinates);
  }

  public onGeocodeUsagerRequest(address: string): void {
    this._addressToGeocode$.next(address);
  }

  public onMapViewChanged($event: ViewReset): void {
    this._mapViewportAndZoom$.next({ viewport: $event.viewport, zoomLevel: $event.zoomLevel });
  }

  public onMarkerChanged(markerEvent: MarkerEvent<PointOfInterestMarkerProperties>): void {
    switch (markerEvent.markerProperties.markerType) {
      case Marker.CnfsPermanence:
        this.handleCnfsPermanenceMarkerEvents(markerEvent);
        break;
      case Marker.CnfsByRegion:
      case Marker.CnfsByDepartment:
        this.handleBoundedMarkerEvents(markerEvent);
        break;
      case Marker.Usager:
        break;
    }
  }
}
