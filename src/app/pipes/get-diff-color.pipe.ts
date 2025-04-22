import { Pipe, PipeTransform } from '@angular/core';
import {DiffColor} from "../utils/utils";

@Pipe({
  name: 'getDiffColor',
  standalone: true
})
export class GetDiffColorPipe implements PipeTransform {
  transform(type: string) {
    if (type in DiffColor) {
      return DiffColor[type as keyof typeof DiffColor];
    }
    return 'transparent';
  }
}
