import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent,
    ListComponent,
    EditComponent,
    PreviewComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }