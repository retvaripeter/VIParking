import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { UsersComponent } from "./users/users.component";
import { UserComponent } from "./users/user/user.component";

import { JutalekComponent } from "./jutalek/jutalek.component";
import { KasszaComponent } from "./kassza/kassza.component";
import { DiagrammComponent } from "./diagramm/diagramm.component";
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./header/header.component";
import { UsersService } from "./Services/users.service";
// HttpClient
import { HttpClientModule } from "@angular/common/http";

// ag-grid
import { AgGridModule } from "ag-grid-angular";
import { TableComponent } from "./table/table.component";
import { DataService } from "./Services/data.service";
import { TimeService } from "./Services/time.service";
import { NgxPrintModule } from "ngx-print";
import { NgxQRCodeModule } from "ngx-qrcode2";

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    TableComponent,
    JutalekComponent,
    KasszaComponent,
    DiagrammComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    NgxPrintModule,
    NgxQRCodeModule,
    ReactiveFormsModule
  ],
  providers: [UsersService, TimeService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
