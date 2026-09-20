import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  /**
   *
   * @param json
   * @param key
   * @returns object
   */
  // findChildObjectByKeyFromString(json: Object, key: string) {
  //   let foundedKeyObject = {};
  //   for (const objectkey in json) {

  //     if (objectkey === key) {
  //       foundedKeyObject = json.key;
  //     }
  //     // if(typeof key === "object"){
  //     //   return key;
  //     // }
  //   }

  //   return foundedKeyObject;
  // }
}
