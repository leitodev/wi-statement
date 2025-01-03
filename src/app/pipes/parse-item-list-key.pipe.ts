import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseItemListKeyPipe',
  standalone: true
})
export class ParseItemListKeyPipe implements PipeTransform {

  transform(item: any, listKeys: any[]): string {
    let values: string[] = [];

    for (let i = 0; i < listKeys.length; i++) {
      if (item[listKeys[i]]) {
        values.push(item[listKeys[i]]);
      };
    };

    return values.join(' - ');
  }

}
