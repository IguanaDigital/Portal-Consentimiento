import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { IOPtion, IOPtions, TypeInputEnum } from "../input/input.interface";
@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"],
})
export class SelectComponent {
  @ViewChild("textInput", { static: false }) textInput!: ElementRef;
  @Input() label: string;
  @Input() key: string;
  @Input() options: IOPtions;
  @Input() placeholder: string = "";
  @Input() onChange: string;
  @Input() contexto: any;
  selectOptions: IOPtions;
  showOptionsContainer: boolean = false;
  showClear: boolean = false;
  inputValue: string = "";
  selectValue: string = "";
  ngOnInit() {
    this.placeholder = this.placeholder ?? "";
  }
  ngOnChanges() {
    this.selectOptions = this.options;
  }
  /**
   * Función para mostrar las opciones
   */
  showOptions() {
    this.showOptionsContainer = true;
  }
  /**
   * Función para ocultar las opciones
   */
  hideOptions() {
    this.showOptionsContainer = false;
  }
  /**
   * Función para cuando cambie el valor del input text
   *
   * @param e elemento HTML
   */
  onChangeInputText(e: any) {
    const value: string = e.target.value;
    this.filterOptionsByText(value);
    this.showClear = value.length > 0;
  }
  /**
   * Función para filtrar las opciones del select
   *
   * @param value texto a filtrar
   */
  filterOptionsByText(value: string) {
    const optionsFiltered = this.options.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );
    this.selectOptions = optionsFiltered;
  }
  /**
   * Función para filtrar las opciones del select
   *
   * @param value value a filtrar
   */
  filterOptionsByValue(value: string) {
    const optionsFiltered = this.options.filter((option) =>
      option.value.toString().includes(value)
    );
    this.selectOptions = optionsFiltered;
  }
  /**
   * Función para obtener la opcion seleccionada del combo
   *
   * @returns la opcion seleccionada
   */
  findOptionSelected(): IOPtion {
    return this.options.find((x) => x.value.toString() === this.selectValue);
  }
  /**
   * Función para cambiar el valor del input cuando se selecciona una opcion
   *
   * @param option valores de la opciones
   */
  onSelectOption(option: IOPtion) {
    const label = option.label;
    const value = option.value.toString();
    this.inputValue = label;
    this.selectValue = value.toString();
    this.hideOptions();
    this.filterOptionsByValue(value);
    this.showClear = true;
    this.contexto[this.onChange](this.key, TypeInputEnum.SELECT, option.value);
  }
  /**
   * Función para limpiar el select
   */
  clearSelect() {
    this.inputValue = "";
    this.selectValue = "";
    this.selectOptions = this.options;
    this.hideOptions();
    this.textInput.nativeElement.blur();
    this.showClear = false;
    this.contexto[this.onChange](this.key, TypeInputEnum.SELECT, "");
  }
  /**
   * Función para cuando el input de texto pierda el foco
   */
  onBlurInputText() {
    setTimeout(() => {
      if (this.selectValue === "") {
        this.inputValue = "";
        this.selectValue = "";
        this.selectOptions = this.options;
      } else {
        this.inputValue = this.findOptionSelected().label;
        this.filterOptionsByValue(this.selectValue);
      }
      this.hideOptions();
    }, 125);
  }
  /**
   * Función para seleccionar el primer elemento al dar enter
   *
   * @param e evento del teclado
   */
  onEnterKey(e: KeyboardEvent) {
    this.inputValue = this.selectOptions[0].label;
    this.selectValue = this.selectOptions[0].value.toString();
    this.hideOptions();
    this.textInput.nativeElement.blur();
  }
  /**
   * Función que se ejecuta cuando se presiona la letra escape
   */
  onEscapeKey() {
    this.textInput.nativeElement.blur();
  }
}
