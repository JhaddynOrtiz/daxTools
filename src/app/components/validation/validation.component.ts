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
  taskId = 'XETtJl5o4ddH0I1Sg'; // ID de la tarea de Apify
  runId!: string;
  token: string = 'apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W';
  logUrl!: string;
  logs: any = '';

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
      if (this.logs.includes('QA Validation Complete') ||this.logs.includes('Request failed')) {
        this.stopLogPolling();
      }
    }, error => {
      console.error('Error getting logs:', error);
    });
  }

  stopLogPolling() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe(); // Cleanup the subscription
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
//notice_preferences=2:; notice_gdpr_prefs=0|1|2:; _gid=GA1.2.41578692.1719327254; gig_bootstrap_4_lTSLeMO7gD5qe4RYaTbteA=account_ver4; gig_canary_ver=16118-3-28655460; notice_behavior=implied|us; SL_G_WPT_TO=es; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; vet_code_required_seen=eyJfcmFpbHMiOnsibWVzc2FnZSI6ImRISjFaUT09IiwiZXhwIjpudWxsLCJwdXIiOiJjb29raWUudmV0X2NvZGVfcmVxdWlyZWRfc2VlbiJ9fQ%3D%3D--9eadd6bbe50be5ec3b020ea3d3cf8d6701fba066; gig_canary=false; gig_canary_ver=16118-3-28656900; TAsessionID=fa319eb4-4d51-4035-ba06-959562abfc7b|EXISTING; gig_canary=false; _ga=GA1.2.190900185.1719327253; AWSALB=V7drJo/74j3p61WNsBD6fkZ/jrw0fXdBMz7LsDazEBOZRHOxegf/tGXoiOcGZhfhWFXQLCh0kXNjDbTO5r6prLqIXe6xZ312R6K4kDf+Nurlc6zXAerVSMy1Vbx/; AWSALBCORS=V7drJo/74j3p61WNsBD6fkZ/jrw0fXdBMz7LsDazEBOZRHOxegf/tGXoiOcGZhfhWFXQLCh0kXNjDbTO5r6prLqIXe6xZ312R6K4kDf+Nurlc6zXAerVSMy1Vbx/; _elp_session=hobHdbIFnjnu5sOe0fC20CkKu1QTvGGkhnDjKxT61yO0iWH9HPUX77DlB2Y7OR9bKQXEWeba43NYIlQNt%2FmHTZM3mPg1sUGJCrTPFo5jP4HVZD%2B1zCUEid1a1GOWijmktpnARGhJvsyTrTC%2BeX6lZqHI652Z13mYZ6%2Fr3znWWsYePSa8kbYPGugwY2GAasAm7hH6z5YXUaxjxZvHqlQxRh8bzjA5GKC%2BS4eJInXPg6%2FbkPrO9a5a0Ok4j7n%2BCd0RgKLp1aoDDiFwFoghIVIpOX2Ym48khUwNFE%2Bb6hiejw8OR8vNgMX0h%2BdXqHeJYENOQwSZI9WRkJWZ%2FeYV%2BFL3N9i1tOROd08J5rXqTJKKa99uyQf%2BDRQnTnnobjPTy7090ok0KLbcnKWIn%2FupFQhbh3Q7JX1qF%2BOMqSkAV4lOUN%2BrcFirsSZoLF8%2BwX3J1k6HnQBJ9P%2BU%2Ft9zILZ44iLK8xiKee11J28GIdSKBGB%2F%2FIgoG6BIERKIPXcV2X4lzKEFzVde6OO5Vg9HYF%2BG8euk%2BQ%3D%3D--W8ZTFidmKsjcCKyO--1U88Tfbo%2FPIZzuwo1W8edw%3D%3D; _ga_RQ5D2C7JW0=GS1.1.1719407913.2.1.1719414680.5.0.0; _gat_UA-2256448-11=1
    if (this.form.valid) {
      const TokenApify = "apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W"

      const urlRequest = `https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token=${TokenApify}`;
      this.apifyService.runTaskUpdater(body, urlRequest).subscribe(
        (response) => {
          if (response.data && response.data.id) {
            this.runId = response.data.id;
            this.logUrl = `https://console.apify.com/organization/${this.cs_QAToken}/actors/tasks/XETtJl5o4ddH0I1Sg/runs/${this.runId}#log`;
            Swal.fire({
              title: "La tarea se envió a ejecutar!",
              text: "Check last run",
              icon: "success"
            });
            this.startLogPolling();
          } else {
            Swal.fire({
              title: "Error!!!",
              text: response,
              icon: "error"
            });
          }
        },
        error => {
          Swal.fire({
            title: "Error!!!",
            text: error.message,
            icon: "error"
          });
        }
      )
    } else {
      Swal.fire({
        title: "Error!",
        text: "Llena los campos para ejecutar la prueba de validación",
        icon: "error"
      });
    }
  }

  copyUrl() {
    navigator.clipboard.writeText(this.logUrl).then(() => {
      console.log('URL copied to clipboard');
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
