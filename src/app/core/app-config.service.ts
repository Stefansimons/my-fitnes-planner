import { IConfigModel } from './model/appConfig';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private _config: IConfigModel;
  constructor(private http: HttpClient) {}
  load() {
    console.log('load');
    return this.http
      .get<IConfigModel>('assets/appConfiguration/config.json')
      .toPromise()
      .then((data) => {
        this._config = data;
        console.log('config loaded data=>', this._config);
      })
      .catch((error) => {
        console.log('Config file is not founded=>', error);
      });
  }

  get config() {
    return this._config;
  }
}
