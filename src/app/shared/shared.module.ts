import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from './Loading/loading-overlay.component';

@NgModule({
  declarations: [LoadingOverlayComponent],
  imports: [
    CommonModule
  ],
  exports: [LoadingOverlayComponent] 
})
export class SharedModule { }