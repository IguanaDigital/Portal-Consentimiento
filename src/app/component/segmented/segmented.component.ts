import { Component, Input } from "@angular/core";
import { segmentedOptions } from "./segmented.interface";
/**
 * Componente para seleccionar un elemento entre las multiples opciones
 *
 * @param segmentedOptions - Objeto con todos las opciones
 * @param segmentedOptionSelected - Valor seleccionado por defecto
 * @param onSelectOption - Funcion para retornar el valor que seleccionó
 * @param contexto - Contexto para poder acceder a los atributos
 */
@Component({
  selector: "app-segmented",
  templateUrl: "segmented.component.html",
  styleUrls: ["./segmented.component.css"],
})
export class SegmentedComponent {
  @Input() segmentedOptions: segmentedOptions = [];

  @Input() segmentedOptionSelected: string;

  @Input() onSelectOption: string;

  @Input() contexto: any;

  ngOnInit() {
    /* Valido en caso no me identifique algun elemento por defecto */
    if (
      this.segmentedOptionSelected === undefined &&
      this.segmentedOptions.length > 0
    ) {
      this.segmentedOptionSelected = this.segmentedOptions[0].value;
    }
  }
  /**
   * Funcion para actualizar el estado del componente
   *
   * @param segmentedOption
   */
  onChange(segmentedOption: string) {
    this.segmentedOptionSelected = segmentedOption;
    this.contexto[this.onSelectOption](segmentedOption);
  }
}
