import { Component, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/tasks.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApifyService } from 'src/app/services/apify.service';

import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Functions } from 'src/app/functions/compare';
@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent {
  cs_QAToken: string = 'GTLDwzJnfTMQqgBR4';
  taskId = 'XETtJl5o4ddH0I1Sg';
  runId!: string;
  token: string = 'apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W';
  logUrl!: string;
  logs: any = '';
  loadingbutton: boolean = false;

  logSubscription: any = new Subscription;

  form: FormGroup;

  constructor(
    private apifyService: ApifyService, 
    private functionServ: Functions
  ) {

    this.form = new FormGroup({
      Manufacturers: new FormControl('', [Validators.required]),
      QA: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      Production: new FormControl('', [Validators.pattern('https?://.+')]),
      compleUrlProd: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      compleUrlQA: new FormControl('', [Validators.pattern('https?://.+')]),
      compVal: new FormControl(false, [Validators.required]),
      ImageUri: new FormControl('', [Validators.pattern('https?://.+')])
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
    this.functionServ.createComment(this.form.value.QA, this.form.value.compleUrlProd, this.form.value.compleUrlQA, this.form.value.Production, this.form.value.compVal, this.form.value.Manufacturers, this.form.value.ImageUri)
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
