import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

String.prototype.fuzzy = function (s) {
  var hay = this.toLowerCase(), i = 0, n = -1, l
  s = s.toLowerCase()
  for (; l = s[i++];) if (!~(n = hay.indexOf(l, n + 1))) return false
  return true
};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
