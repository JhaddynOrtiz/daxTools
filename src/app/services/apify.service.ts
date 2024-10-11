import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApifyService {

  private apiUrl = 'https://api.apify.com/v2/acts';
  private token: any = '';
  private prodToken: any = '';
  private body = {
    "CheckDuplicates": {
      "ProductUrl": true,
      "ProductName": true,
      "ProductId": true
    },
    "CheckMappingCodes": true,
    "CultureCode": "es-ES",
    "Environment": "QA",
    "Regex": {
      "Manufacturer": [
        {
          "Code": "Philips",
          "Match": true
        }
      ],
      "ProductName": [
        {
          "Code": "&amp|&#xE9|&#xE2|&#xEE|&#xE0|&#x2019|&#xB0",
          "Match": false
        }
      ],
      "ProductUrl": [
        {
          "Code": "https://www.casasbahia.com.br/",
          "Match": true
        }
      ],
      "ProductId": [
        {
          "Code": "#|&|;|:|,",
          "Match": false
        }
      ],
      "Price": [
        {
          "Code": "^[0-9]*$|(\\d+\\.\\d+(.\\d+(.\\d+)?)?)|\\d+",
          "Match": true
        }
      ],
      "Stock": [
        {
          "Code": "InStock|OutOfStock",
          "Match": true
        }
      ],
      "ImageUri": [
        {
          "Code": "https://imgs.casasbahia.com.br/",
          "Match": true
        }
      ]
    },
    "RobotTypes": {
      "Name": "Crawler",
      "TaskID": "RrpStpIT2gv7VLluD",
      "ExcludeFields": []
    },
    "debugLog": false
  }

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('authToken');
    this.prodToken = localStorage.getItem('prodToken');
  }

  runTask(taskId: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post("https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token=${this.token}", JSON.stringify(this.body), { headers });

  }

  runTaskUpdater(data: any, urlTask: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(urlTask, JSON.stringify(data), { headers });

  }

  getTaskRunResults(runId: string): Observable<any> {
    const url = `https://api.apify.com/v2/logs/${runId}?token=${this.token}`;
    return this.http.get(url, { responseType: 'text' });
  }

}
