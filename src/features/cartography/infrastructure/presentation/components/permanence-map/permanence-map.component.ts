import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CenterView,
  CnfsByDepartmentMarkerProperties,
  CnfsByRegionMarkerProperties,
  CnfsPermanenceMarkerProperties,
  MarkerEvent,
  UsagerMarkerProperties
} from '../../models';
import { Feature, FeatureCollection, Point } from 'geojson';
import { ViewReset } from '../../directives';
import { MARKERS, MARKERS_TOKEN } from '../../../configuration';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MARKERS_TOKEN,
      useValue: MARKERS
    }
  ],
  selector: 'permanence-map',
  templateUrl: './permanence-map.component.html'
})
export class PermanenceMapComponent {
  @Input() public centerView!: CenterView;

  @Output() public readonly cnfsDepartementMarkerChange: EventEmitter<MarkerEvent<CnfsByDepartmentMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsByDepartmentMarkerProperties>>();

  @Input() public cnfsDepartementMarkers: FeatureCollection<Point, CnfsByDepartmentMarkerProperties> | null = null;

  @Output() public readonly cnfsPermanenceMarkerChange: EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>> =
    new EventEmitter<MarkerEvent<CnfsPermanenceMarkerProperties>>();

  @Input() public cnfsPermanenceMarkers: FeatureCollection<Point, CnfsPermanenceMarkerProperties> | null = null;

  @Output() public readonly cnfsRegionMarkerChange: EventEmitter<MarkerEvent<CnfsByRegionMarkerProperties>> = new EventEmitter<
    MarkerEvent<CnfsByRegionMarkerProperties>
  >();

  @Input() public cnfsRegionMarkers: FeatureCollection<Point, CnfsByRegionMarkerProperties> | null = null;

  @Input() public highlightedStructureId: string | null = null;

  @Output() public readonly stateChange: EventEmitter<ViewReset> = new EventEmitter<ViewReset>();

  @Input() public usagerMarker: Feature<Point, UsagerMarkerProperties> | null = null;

  @Output() public readonly zoomOut: EventEmitter<void> = new EventEmitter<void>();

  public onDepartementClick(cnfsByDepartementMarkerEvent: MarkerEvent<CnfsByDepartmentMarkerProperties>): void {
    this.cnfsDepartementMarkerChange.emit(cnfsByDepartementMarkerEvent);
  }

  public onPermanenceClick(cnfsPermanenceMarkerEvent: MarkerEvent<CnfsPermanenceMarkerProperties>): void {
    this.cnfsPermanenceMarkerChange.emit(cnfsPermanenceMarkerEvent);
  }

  public onRegionClick(cnfsByRegionMarkerEvent: MarkerEvent<CnfsByRegionMarkerProperties>): void {
    this.cnfsRegionMarkerChange.emit(cnfsByRegionMarkerEvent);
  }

  public onStateChanged(viewReset: ViewReset): void {
    this.stateChange.emit(viewReset);
  }

  public trackByDepartementName(_: number, cnfsDepartemenFeature: Feature<Point, CnfsByDepartmentMarkerProperties>): string {
    return cnfsDepartemenFeature.properties.code;
  }

  public trackByPermanenceId(_: number, cnfsPermanenceFeature: Feature<Point, CnfsPermanenceMarkerProperties>): string {
    return cnfsPermanenceFeature.properties.id;
  }

  public trackByRegionName(_: number, cnfsRegionFeature: Feature<Point, CnfsByRegionMarkerProperties>): string {
    return cnfsRegionFeature.properties.region;
  }
}
