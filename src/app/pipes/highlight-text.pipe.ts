import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {

  transform(value: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return value.replace(/INFO/g, '<span class="my-info">INFO</span>')
      .replace(/WARN/g, '<span class="my-warn">WARN</span>')
      .replace(/ERROR/g, '<span class="my-error">ERROR</span>')
      .replace(/DEBUG/g, '<span class="my-debug">DEBUG</span>')
      .replace(/CheerioCrawler:/g, '<span class="my-warn">CheerioCrawler:</span>')
      .replace(urlRegex, '<a class="my-url" href="$1" target="_blank">$1</a>')
      .replace(/[A-Z0-9-:.]{20,}/g, '');

  }

}
