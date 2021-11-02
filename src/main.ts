import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ENVIRONMENT, EnvironmentType } from './environments';

if (ENVIRONMENT.type === EnvironmentType.Production)
  enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((bootstrapModuleError: Error): void =>
    // eslint-disable-next-line no-console
    console.error(bootstrapModuleError)
  );
