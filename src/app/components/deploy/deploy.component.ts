import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApifyService } from 'src/app/services/apify.service';

import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.css']
})
export class DeployComponent implements OnDestroy {

  cs_QAToken: string = 'GTLDwzJnfTMQqgBR4';
  taskId = 'XETtJl5o4ddH0I1Sg'; // ID de la tarea de Apify
  runId!: string;
  //token: string = 'apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W';
  token: string = 'apify_api_U4Wd5n7V9USgdsBpkYDpB8WUfhkJEX3wh0LV';
  logUrl!: string;
  logs: any = '';

  form: FormGroup;

  logSubscription: any = new Subscription;

  constructor(private apifyService: ApifyService) {
    this.form = new FormGroup({
      csQaId: new FormControl('', [Validators.required]),
      productionId: new FormControl('', [Validators.required])
    });
  }

  copyUrl() {
    navigator.clipboard.writeText(this.logUrl).then(() => {
      console.log('URL copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
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
      if (this.logs.includes('TotalSuccess') || this.logs.includes('Request failed')) {
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
      console.log('Log polling stopped.');
    }
  }

  sendDeploy() {
    const body = {
      "Operation": "Update",
      "SourceEnvironment": "CS-QA",
      "TargetEnvironment": "Production",
      "Tasks": [
        {
          "sourceId": this.form.value.csQaId,
          "targetId": this.form.value.productionId
        }
      ],
      "Webhook": "Products",
      "debugLog": true
    }
    if (this.form.valid) {
      //const urlRequest = `https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token=${TokenApify}`;
      const urlRequest = `https://api.apify.com/v2/actor-tasks/cs_qa~cs-create-deploy-update-to-production/runs?token=${this.token}&build=latest`;
      this.apifyService.runTaskUpdater(body, urlRequest).subscribe(
        (response) => {
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

  ngOnDestroy() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }
  // POST URL
  //https://api.apify.com/v2/actor-tasks/cs_qa~cs-create-deploy-update-to-production/runs?token=apify_api_U4Wd5n7V9USgdsBpkYDpB8WUfhkJEX3wh0LV&build=latest

  //Log URL -> format noral
  //https://console.apify.com/organization/GTLDwzJnfTMQqgBR4/actors/tasks/yJCNZGs62mj8nujPS/runs/I0TXhAn7jpISwHqhO#log

}
