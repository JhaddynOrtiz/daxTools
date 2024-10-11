import { Component, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/tasks.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApifyService } from 'src/app/services/apify.service';

import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnDestroy {

  cs_QAToken: string = 'GTLDwzJnfTMQqgBR4';
  taskId = 'XETtJl5o4ddH0I1Sg';
  runId!: string;
  token: string = 'apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W';
  logUrl!: string;
  logs: any = '';
  loadingbutton: boolean = false;

  logSubscription: any = new Subscription;

  form: FormGroup;

  constructor(private apifyService: ApifyService) {
    this.form = new FormGroup({
      idTask: new FormControl('', [Validators.required]),
      typeRobot: new FormControl('crawler', [Validators.required]),
      manufacturerCode: new FormControl('', [Validators.required]),
      productUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      imageUri: new FormControl('', [Validators.pattern('https?://.+')]),
      cultureCode: new FormControl('', [Validators.required])
    });
  }

  startLogPolling() {
    this.logs = null;
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
    this.logSubscription = interval(5000).pipe(
      switchMap(() => this.apifyService.getTaskRunResults(this.runId))
    ).subscribe(response => {
      this.logs = response;
      if (this.logs.includes('QA Validation Complete') || this.logs.includes('Request failed')) {
        this.stopLogPolling();
      }
    }, error => {
      console.error('Error getting logs:', error);
    });
  }

  stopLogPolling() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
      this.logSubscription = null;
    }
  }

  sendValidation() {
    const body = {
      "CheckDuplicates": {
        "ProductUrl": true,
        "ProductName": true,
        "ProductId": true
      },
      "CheckMappingCodes": true,
      "CultureCode": this.form.value.cultureCode,
      "Environment": "QA",
      "Regex": {
        "Manufacturer": [
          {
            "Code": this.form.value.manufacturerCode,
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
            "Code": this.form.value.productUrl,
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
            "Code": this.form.value.imageUri,
            "Match": true
          }
        ]
      },
      "RobotTypes": {
        "Name": this.form.value.typeRobot,
        "TaskID": this.form.value.idTask,
        "ExcludeFields": []
      },
      "debugLog": false
    };

    if (this.form.valid) {
      this.loadingbutton = true;
      const TokenApify = "apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W"

      const urlRequest = `https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token=${TokenApify}`;
      this.apifyService.runTaskUpdater(body, urlRequest).subscribe(
        (response) => {
          this.loadingbutton = false;
          if (response.data && response.data.id) {
            this.runId = response.data.id;
            this.logUrl = `https://console.apify.com/organization/${this.cs_QAToken}/actors/tasks/XETtJl5o4ddH0I1Sg/runs/${this.runId}#log`;
            Swal.fire({
              title: "La tarea se envió a ejecutar!",
              text: "Check last run",
              icon: "success",
              background: "#131e33",
              color: "#FFF"
            });
            this.startLogPolling();
          } else {
            Swal.fire({
              title: "Error!!!",
              text: response,
              icon: "error",
              background: "#131e33",
              color: "#FFF"
            });
          }
        },
        error => {
          Swal.fire({
            title: "Error!!!",
            text: error.message,
            icon: "error",
            background: "#131e33",
            color: "#FFF"
          });
        }
      )
    } else {
      Swal.fire({
        title: "Error!",
        text: "Llena los campos para ejecutar la prueba de validación",
        icon: "error",
        background: "#131e33",
        color: "#FFF"
      });
    }
  }

  copyUrl() {
    navigator.clipboard.writeText(this.logUrl).then(() => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Texto copiado",
        showConfirmButton: false,
        timer: 1000,
        background: "#131e33",
        color: "#FFF"
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  ngOnDestroy() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }

}
