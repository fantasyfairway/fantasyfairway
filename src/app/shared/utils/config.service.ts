import { Injectable } from '@angular/core';
 
@Injectable()
export class ConfigService {
     
    _apiURI : string;
 
    constructor() {
        this._apiURI = 'https://fantasyfairway.azurewebsites.net/api';
     }
 
     getApiURI() {
         return this._apiURI;
     }    
}
 