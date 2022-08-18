import { Pipe, PipeTransform } from '@angular/core';
import { LIMIT_LENGTH_WORD_DEFAULT } from '@shared/constants/common.constant';

/**
 * Slice date from 0 to 10
 *
 * @author tuyentd
 * @date 2022-05-15
 * @export
 * @class AppDatePipe
 * @implements {PipeTransform}
 * @howToUse
 * ```
 *     <some-element>{{ user?.date | appDate }}</some-element>
 * ```
 */
@Pipe({ name: 'limitWord' })
export class LimitWordPipe implements PipeTransform {
  transform(str?: string, length = LIMIT_LENGTH_WORD_DEFAULT): string {
    if (!!str && str.indexOf(' ') === -1) {
      return str.length <= length
        ? str
        : str.slice(0, LIMIT_LENGTH_WORD_DEFAULT).trim() + '...';
    }
    return !!str
      ? str.length <= length
        ? str
        : str.slice(0, length).trim() + '...'
      : '';
  }
}
