import { Component, Input } from "@angular/core";
import { IOPtions, TypeInputEnum } from "./input.interface";
/**
 * Componente para obtener un input o algunos
 */
@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
})
export class InputComponent {
  @Input() contexto: any;
  @Input() label: string = "";
  @Input() type: TypeInputEnum = TypeInputEnum.TEXT;
  @Input() options: IOPtions;
  @Input() key: string;
  @Input() onChange: string;
  @Input() placeholder: string = "";

  ngOnInit() {
    this.placeholder = this.placeholder ?? "";
  }
  /**
   * Funcion que se ejecutara cada que haya un cambio en el valor del input
   *
   * @param key
   * @param type
   * @param element
   */
  onChangeElement(key: string, type: TypeInputEnum, element: any) {
    let value: string | number;
    switch (type) {
      case TypeInputEnum.TEXT:
        value = element.target.value;
        break;
      case TypeInputEnum.SELECT:
        value = element;
        break;

      default:
        break;
    }
    this.contexto[this.onChange](key, value);
  }
}
