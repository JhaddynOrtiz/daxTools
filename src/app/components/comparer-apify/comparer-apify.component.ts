import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApifyService } from 'src/app/services/apify.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comparer-apify',
  templateUrl: './comparer-apify.component.html',
  styleUrls: ['./comparer-apify.component.css']
})
export class ComparerApifyComponent {
  cs_QAToken: string = 'GTLDwzJnfTMQqgBR4';
  taskUrl = 'XETtJl5o4ddH0I1Sg'; // ID de la tarea de Apify
  runUrl!: string;
  //token: string = 'apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W';
  token: string = 'apify_api_U4Wd5n7V9USgdsBpkYDpB8WUfhkJEX3wh0LV';
  logUrl!: string;
  logs: any = '';

  form: FormGroup;

  logSubscription: any = new Subscription;
  runId: any;

  constructor(
    private apifyService: ApifyService,
    private functionsService: FunctionsService
  ) {
    this.form = new FormGroup({
      csQaUrl: new FormControl('', [Validators.required]),
      productionUrl: new FormControl('', [Validators.required])
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


  }

  stopLogPolling() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe(); // Cleanup the subscription
      this.logSubscription = null;
      console.log('Log polling stopped.');
    }
  }

  comparison() {
    this.functionsService.compare()
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
}
