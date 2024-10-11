import { Component, ElementRef, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-comparer',
  templateUrl: './comparer.component.html',
  styleUrls: ['./comparer.component.css']
})
export class ComparerComponent {

  crawlerData: any = '';
  updaterData: any = '';
  resultCompare: any = [];

  @ViewChild('targetSection') targetSection!: ElementRef;

  codeEditorOptionsHtmlCrawler = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true
  };

  codeEditorOptionsHtmlUpdater = {
    theme: 'vs-dark',
    language: 'json',
    automaticLayout: true
  };

  cargarArchivoJson(nombreArchivo: any) {
    try {
      return JSON.parse(nombreArchivo);
    } catch (error) {
      return null;
    }
  }

  compararDatos(crawler: any, updater: any) {
    // Buscar el índice del objeto en el segundo array basado en ProductId o ProductUrl
    const indexEnUpdater = updater.findIndex(
      (item: any) => item.ProductId === crawler.ProductId || item.ProductUrl === crawler.ProductUrl
    );

    if (indexEnUpdater !== -1) {
      if (crawler.ProductId !== updater[indexEnUpdater].ProductId) {
        this.resultCompare.push({ "message": `Los id's del crawler ${crawler.ProductId} y el updater ${updater[indexEnUpdater].ProductId} no coinciden`,"success": false });
        console.log(`Los id's del crawler ${crawler.ProductId} y el updater ${updater[indexEnUpdater].ProductId} no coinciden`);
      }
      else if (crawler.ProductUrl !== updater[indexEnUpdater].ProductUrl) {
        this.resultCompare.push({ "message": `Las urls del crawler ${crawler.ProductUrl} y el updater ${updater[indexEnUpdater].ProductUrl} no coinciden`,"success": false });
        console.log(`Las urls del crawler ${crawler.ProductUrl} y el updater ${updater[indexEnUpdater].ProductUrl} no coinciden`);
      }
      else if (crawler.ProductName === updater[indexEnUpdater].ProductName) {
        this.resultCompare.push({ "message": `Los productos ${crawler.ProductId} y ${updater[indexEnUpdater].ProductId} son iguales.`,"success": true });
        console.log(`Los productos ${crawler.ProductId} y ${updater[indexEnUpdater].ProductId} son iguales.`);
      } else {
        this.resultCompare.push({ "message": `¡Alerta! Diferencia de contenido en ProductName para el producto ${crawler.ProductName} y ${updater[indexEnUpdater].ProductName}`,"success": false });
        console.log(
          `¡Alerta! Diferencia de contenido en ProductName para el producto ${crawler.ProductName} y ${updater[indexEnUpdater].ProductName}`
        );
      }
    } else {
      this.resultCompare.push({ "message": `No se encontró el producto ${crawler.ProductId} en el segundo array.`, "success": false });
      console.log(`No se encontró el producto ${crawler.ProductId} en el segundo array.`);
    }
  }

  compareCrawlerUpdater() {
    if (this.crawlerData == '' || this.updaterData == '') {
      Swal.fire({
        title: "Error uno o ambos contenedores vacíos",
        text: "Llena los campos de Resultados",
        icon: "error",
        background: "#131e33",
        color: "#FFF"
      });
    }
    else {
      const crawler = this.cargarArchivoJson(this.crawlerData);
      const updater = this.cargarArchivoJson(this.updaterData);

      if (!crawler || !updater) {
        Swal.fire({
          title: "Error de formato",
          text: "No se pudo convertir a JSON revisa los contenedores",
          icon: "error",
          background: "#131e33",
        color: "#FFF"
        });
      } else {
        crawler.forEach((item: any) => this.compararDatos(item, updater));
        /* Swal.fire({
          title: "Error de formato",
          text: this.resultCompare.message,
          icon: "error"
        }); */
        console.log('data allllll', this.resultCompare);
        this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth' });

      }
    }
  }



  clearConsole(): void {
    this.crawlerData = '';
    this.updaterData = '';
    this.resultCompare = '';
  }
}
