import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'humanDate'
})
/**
 * This pipe modifies the date to display it in multiple formats
 * using moment.js it fallback to MMMM DD, YYYY, if nothing is passed
 * e.g; Saturday 14 2020
 */
export class HumanDatePipe implements PipeTransform {

  transform(value: string|Date, format: string): string {
    const f = format ? format : 'MMMM DD, YYYY';
    return moment(value).format(f);
  }

}
