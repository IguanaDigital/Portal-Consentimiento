import { Component, Input } from "@angular/core";
import { IInputs } from "../input/input.interface";
@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class FormComponent {
  @Input() contexto: any;
  @Input() options: IInputs;
  @Input() onChageForm: string;
  onChangeElementInForm(key: string, value: string | number) {
    this.contexto[this.onChageForm](key, value);
  }
}
