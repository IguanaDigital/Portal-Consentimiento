import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FeatherModule } from "angular-feather";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NotifierModule, NotifierService } from "angular-notifier";
import { ComponentsRoutes } from "./component.routing";
import { NgbdpregressbarBasicComponent } from "./progressbar/progressbar.component";
import { NgbdpaginationBasicComponent } from "./pagination/pagination.component";
import { NgbdAccordionBasicComponent } from "./accordion/accordion.component";
import { NgbdAlertBasicComponent } from "./alert/alert.component";
import { NgbdCarouselBasicComponent } from "./carousel/carousel.component";
import { StackedModalComponent } from "./modal/stackedmodal.component";
import { NgbdDropdownBasicComponent } from "./dropdown-collapse/dropdown-collapse.component";
import { NgbdModalBasicComponent } from "./modal/modal.component";
import { NgbdPopTooltipComponent } from "./popover-tooltip/popover-tooltip.component";
import { NgbdratingBasicComponent } from "./rating/rating.component";
import { NgbdnavBasicComponent } from "./nav/nav.component";
import { NgbdtimepickerBasicComponent } from "./timepicker/timepicker.component";
import { NgbdDatepickerBasicComponent } from "./datepicker/datepicker.component";
import { Custommonth } from "./datepicker/customonth.component";
import { SimpleDatepickerBasic } from "./datepicker/simpledatepicker.component";
import { ButtonsComponent } from "./buttons/buttons.component";
import { CardsComponent } from "./card/card.component";
import { NotifierComponent } from "./notifier/notifier.component";
import { ToastComponent } from "./toast/toast.component";
import { ToastsContainer } from "./toast/toast-container";
import { TextComponent } from "./text/text.component";
import { ToggleComponent } from "./toggle/toggle.component";
import { SegmentedComponent } from "./segmented/segmented.component";
import { TableComponent } from "./table/table.component";
import { InputComponent } from "./input/input.component";
import { FormComponent } from "./form/form.component";
import { ExportButtonComponent } from "./export-button/export-button.component";
import { SelectComponent } from "./select/select.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NotifierModule,
    FeatherModule,
  ],
  declarations: [
    NgbdpregressbarBasicComponent,
    NgbdpaginationBasicComponent,
    NgbdAccordionBasicComponent,
    NgbdAlertBasicComponent,
    NgbdCarouselBasicComponent,
    StackedModalComponent,
    NgbdDropdownBasicComponent,
    NgbdModalBasicComponent,
    NgbdPopTooltipComponent,
    NgbdratingBasicComponent,
    NgbdnavBasicComponent,
    NgbdtimepickerBasicComponent,
    ButtonsComponent,
    CardsComponent,
    ToastComponent,
    ToastsContainer,
    NotifierComponent,
    NgbdDatepickerBasicComponent,
    Custommonth,
    SimpleDatepickerBasic,
    TextComponent,
    ToggleComponent,
    SegmentedComponent,
    TableComponent,
    InputComponent,
    FormComponent,
    ExportButtonComponent,
    SelectComponent,
  ],
  exports: [
    TextComponent,
    SegmentedComponent,
    TableComponent,
    InputComponent,
    FormComponent,
    ExportButtonComponent,
    SelectComponent,
  ],
  providers: [NotifierService],
})
export class ComponentsModule {}
