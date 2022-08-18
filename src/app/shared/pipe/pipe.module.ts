import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BytesPipe } from './bytes.pipe';
import { CurrencyVndPipe } from './currency.pipe';
import { GenderPipe } from './gender.pipe';
import { JoinPipe } from './join.pipe';
import { LimitWordPipe } from './limit.word.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CurrencyVndPipe,
    JoinPipe,
    BytesPipe,
    GenderPipe,
    LimitWordPipe,
  ],
  exports: [
    CommonModule,
    CurrencyVndPipe,
    JoinPipe,
    BytesPipe,
    GenderPipe,
    LimitWordPipe,
  ],
})
export class PipeModule {}
