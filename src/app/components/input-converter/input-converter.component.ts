import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthServiceService } from '../../services/auth-service.service';
import { ApifyService } from '../../services/apify.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-input-converter',
  templateUrl: './input-converter.component.html',
  styleUrls: ['./input-converter.component.css']
})

export class InputConverterComponent implements OnInit, OnDestroy {

  jsonModal: string = '';
  jsonData: any = '';

  cs_QAToken: string = 'GTLDwzJnfTMQqgBR4';
  //token: string = 'apify_api_Q4q60TiTquK8bxxcJe1luBgwoce66X0fNM5W';
  taskId!: string;
  runId!: string;
  logUrl!: string;
  logs: any = '';
  logSubscription: any = new Subscription;

  private modalRef!: NgbModalRef;

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    public fbAuth: AngularFireAuth,
    private authService: AuthServiceService,
    private apifyService: ApifyService,
    private modalService: NgbModal) {
    this.jsonModal = JSON.stringify(null, null, 2);

  }

  codeEditorOptionsHtml = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true
  };

  codeEditorOptionsHtml2 = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true
  };


  showJsonViewer: boolean = false;
  codeHtml: any = ``;
  crawlerJson: any = '';
  productName: boolean = false;
  productId: boolean = false;
  codeHtml2: any = '';
  crawlerOutput: any;

  urlTask: string = '';
  startUrls: any = '';

  userInfo: any = '';

  processData(): void {
    const updaterList: any[] = [];
    try {
      const crawler: any = JSON.parse(this.codeHtml);
      for (const x of crawler) {
        if (!x.Handled) {
          const newData = {
            url: x.ProductUrl,
            userData: {
              Manufacturer: x.Manufacturer,
              ProductName: this.productName ? x.ProductName : undefined,
              ProductId: this.productId ? x.ProductId : undefined
            }
          }
          updaterList.push(newData);
        }
      }
      //this.codeHtml2 = updaterList;
      this.codeHtml2 = JSON.stringify({ "startUrls": updaterList }, null, 2);
      this.jsonModal = this.codeHtml2;
      // read state user  console.log('state ', this.fbAuth.user);
    } catch (error) {
      Swal.fire({
        title: "Error de formato del JSON",
        text: "Revisa que noexistan caracteres adicionales en el contenido de startUrls",
        icon: "error"
      });
    }


  }

  clearConsole(): void {
    this.codeHtml = '';
    this.codeHtml2 = '';
    this.startUrls = '';
    this.jsonModal = '';
    this.urlTask = '';
  }

  ClearUrl() {
    this.urlTask = '';
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content, { centered: true, windowClass: 'custom-modal' });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
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
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "No se encontró la URL",
        showConfirmButton: false,
        timer: 1000,
        background: "#131e33",
        color: "#FFF"
      });
    });
  }

  copyToClipboard(text: string) {
    if (text) {
      this.clipboard.copy(JSON.stringify({ "startUrls": text }, null, 2));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Texto copiado",
        showConfirmButton: false,
        timer: 1000,
        background: "#131e33",
        color: "#FFF"
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "No se encontró el JSON",
        showConfirmButton: false,
        timer: 1000,
        background: "#131e33",
        color: "#FFF"
      });
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  stopLogPolling() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe(); // Cleanup the subscription
      this.logSubscription = null;
      console.log('Log polling stopped.');
    }
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
      if (this.logs.includes('Cheerio Scraper finished') || this.logs.includes('The Actor run was aborted')) {
        this.stopLogPolling();
      }
    }, error => {
      console.error('Error getting logs:', error);
    });
  }

  sendRequest() {
    try {
      //this.jsonData = JSON.parse(this.jsonModal);
      this.jsonData = JSON.parse(this.codeHtml2);
      this.logs = null;
    } catch (error) {
      Swal.fire({
        title: "Error de formato del JSON",
        text: "Revisa que noexistan caracteres adicionales en el contenido de startUrls",
        icon: "error",
        background: "#131e33",
        color: "#FFF"
      });
    }
    if (!this.urlTask) {
      Swal.fire({
        title: "Agregue la url de la solicitud",
        text: "Debes agregar la url de Run Task",
        icon: "error",
        background: "#131e33",
        color: "#FFF"
      });
    } else {
      //this.apifyService.runTaskUpdater(JSON.parse(this.jsonModal), this.urlTask).subscribe(
      this.apifyService.runTaskUpdater(JSON.parse(this.codeHtml2), this.urlTask).subscribe(
        (response) => {
          this.closeModal();
          this.runId = response.data.id;
          this.taskId = response.data.actorTaskId;
          this.logUrl = `https://console.apify.com/organization/${this.cs_QAToken}/actors/tasks/${this.taskId}/runs/${this.runId}#log`;
          Swal.fire({
            title: "La tarea se envió a ejecutar!",
            text: "Check last run",
            icon: "success",
            background: "#131e33",
            color: "#FFF"
          });
          this.startLogPolling();
        },
        error => {
          Swal.fire({
            title: "Ocurrió un problema al realziar la solicitud",
            text: error.message,
            icon: "error",
            background: "#131e33",
            color: "#FFF"
          });
        }
      )
    }

  }

  ngOnDestroy(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    /* const authUser = this.authService.isAuth();
    this.userInfo = authUser; */
  }
}
