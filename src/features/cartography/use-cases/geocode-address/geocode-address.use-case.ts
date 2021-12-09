import { Observable } from 'rxjs';
import { UseCase } from '@architecture/use-case';
import { Coordinates, CoordinatesRepository } from '../../core';
import { Injectable } from '@angular/core';

@Injectable()
export class GeocodeAddressUseCase implements UseCase<[string], Coordinates> {
  public constructor(private readonly coordinatesRepository: CoordinatesRepository) {}

  public execute$(address: string): Observable<Coordinates> {
    return this.coordinatesRepository.geocodeAddress$(address);
  }
}
