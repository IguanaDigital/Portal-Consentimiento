import { Component, Input } from "@angular/core";
import { FilterTypeTableEnum, IHeaderTable } from "./table.interface";
/**
 * Componente para tabla
 *
 * @param contexto - Contexto para poder acceder a los atributos
 * @param headerTable - Cabecera de la tabla
 * @param dataTable - Contenido de la tabla
 * @param paginationActive - Valida si activo la paginacion o no
 * @param defaultPageSize - Valor por defecto para el numero de registros por página
 * @param defaultPage - Valor por defecto para el numero de la página
 * @param pageSizes - Tamaño de numero de paginas
 * @param emptyTableText - Mensaje para la tabla cuando esta vacia
 * @param elementsChecked - Incompleto
 * @param modal - Incompleto
 */
@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent {
  @Input() contexto: any;
  @Input() headerTable: IHeaderTable;
  @Input() dataTable: any[];
  @Input() paginationActive: boolean = false;
  @Input() defaultPageSize: number = 10;
  @Input() defaultPage: number = 1;
  @Input() pageSizes: number[] = [4, 10, 15, 20, 25];
  @Input() emptyTableText: string = "Tabla no contiene Información";
  @Input() elementsChecked: number[];
  @Input() modal: any;
  dataToTable: any[];
  placeholderInputSearchHeader: string = "";
  ngOnInit() {
    this.paginateDataTable(this.dataTable);
  }
  ngOnChanges() {
    this.paginateDataTable(this.dataTable);
  }
  /**
   * Funcion para cambiar el tamaño de paginación de la tabla
   *
   * @param element elemento html
   *
   */
  changePaginationSize(element: any) {
    const value = parseInt(element.target.value);
    const posicionInicial = (this.defaultPage - 1) * value;
    const positionFinal = (this.defaultPage - 1) * value + value;
    this.dataToTable = this.dataTable.slice(posicionInicial, positionFinal);
    this.defaultPageSize = value;
  }
  /**
   * Funcion para cambiar de pagina
   *
   * @param value Número de la página a cambiar
   *
   */
  changePage(value: number) {
    const posicionInicial = (value - 1) * this.defaultPageSize;
    const positionFinal =
      (value - 1) * this.defaultPageSize +
      parseInt(this.defaultPageSize.toString());
    this.dataToTable = this.dataTable.slice(posicionInicial, positionFinal);
    this.defaultPage = value;
  }
  /**
   * Función para validar si tiene paginacion y llenar la tabla
   *
   * @param data contenido para la tabla
   */
  paginateDataTable(data: any[]) {
    if (this.paginationActive) {
      const posicionInicial = (this.defaultPage - 1) * this.defaultPageSize;
      const positionFinal =
        (this.defaultPage - 1) * this.defaultPageSize + this.defaultPageSize;
      this.dataToTable = data.slice(posicionInicial, positionFinal);
    } else {
      this.dataToTable = data;
    }
  }
  /**
   * Función para filtrar el contenido de la tabla
   *
   * @param type tipo de filtro
   * @param dataIndex nombre de la columna por la cual filtrar
   * @param e
   */
  onChangeHeaderFilter(type: FilterTypeTableEnum, dataIndex: string, e: any) {
    const types = [
      { type: FilterTypeTableEnum.STRING, function: "filterDataByString" },
      { type: FilterTypeTableEnum.DATE, function: "filterDataByDate" },
    ];
    const fuctionFilter = types.find((x) => x.type === type);
    this[fuctionFilter.function](e, dataIndex);
  }
  /**
   * Funcion para filtrar la data de la tabla por texto
   *
   * @param e
   * @param dataIndex nombre de la columna por la cual filtrar
   */
  filterDataByString(e: any, dataIndex: string) {
    const value = e.target.value.toLowerCase();
    const newDataToTable = this.dataTable.filter((x) =>
      x[dataIndex].toLowerCase().includes(value)
    );
    this.paginateDataTable(newDataToTable);
  }
  /**
   * Funcion para filtrar la data de la tabla por la fecha
   *
   * @param e
   * @param dataIndex nombre de la columna por la cual filtrar
   */
  filterDataByDate(e: any, dataIndex: string) {
    const value = e.target.value;
    console.log("value", value);
    const newDataToTable = this.dataTable.filter((x) =>
      x[dataIndex].includes(value)
    );
    this.paginateDataTable(newDataToTable);
  }
  /**
   * Función para copiar el texto al portapapeles
   *
   * @param text texto a copiar
   */
  copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
}
