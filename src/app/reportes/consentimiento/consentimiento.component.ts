import { Component } from "@angular/core";
import {
  IInputs,
  IOPtion,
  IOPtions,
  TypeInputEnum,
} from "src/app/component/input/input.interface";
import { segmentedOptions } from "src/app/component/segmented/segmented.interface";
import {
  AlignTableEnum,
  FilterTypeTableEnum,
  IHeaderTable,
  TypeColTableEnum,
} from "src/app/component/table/table.interface";
import { IConsentimientosTable } from "./consentimiento.interface";
import { ZonaService } from "src/app/permisos/permisos/zona.service";
import { EncuestaService } from "src/app/configuracion/encuesta/encuesta.service";
import { HaciendaService } from "src/app/permisos/permisos/hacienda.service";
import { ConsentimientoService } from "./consentimiento.service";

@Component({
  selector: "app-consentimiento",
  templateUrl: "./consentimiento.component.html",
})
export class ConsentimientoComponent {
  tipoConsentimientoCombo: segmentedOptions = [
    {
      label: "Externo",
      value: "externo",
    },
    {
      label: "Interno",
      value: "interno",
    },
  ];
  tipoConsentimientoSelected: string = this.tipoConsentimientoCombo[0].value;
  titulosTabla: IHeaderTable = [];
  dataTabla: IConsentimientosTable = [];
  comboZona: IOPtions;
  comboEncuesta: IOPtions;
  comboHacienda: IOPtions;
  formularioInput: IInputs = [
    {
      label: "Encuesta",
      key: "encuesta",
      type: TypeInputEnum.SELECT,
      colWidth: 3,
      options: [],
    },
    {
      label: "Zona",
      key: "zona",
      type: TypeInputEnum.SELECT,
      options: [],
    },
    {
      label: "Hacienda",
      key: "hacienda",
      type: TypeInputEnum.SELECT,
      options: [],
    },
  ];
  titulosTablaExport: string[];
  dataTablaExport: string[][];
  formValue: any;
  constructor(
    public zonaService: ZonaService,
    public encuestaService: EncuestaService,
    public haciendaService: HaciendaService,
    public consentimientoService: ConsentimientoService
  ) {
    this.dataTablaExport = this.generateBodyExport();
    this.getCombosTofilters();
    this.validarCabeceraTabla("externo");
  }
  /**
   * Función para cambiar el valor del tipo de consentimiento
   *
   * @param tipoConsentimiento
   */
  onChangeTipoConsentimiento(tipoConsentimiento: string) {
    this.tipoConsentimientoSelected = tipoConsentimiento;
    this.validarCabeceraTabla(tipoConsentimiento);
    this.dataTablaExport = this.generateBodyExport();
  }
  /**
   * Función que se ejecuta cada que cambia el valor de un elemento en el formulario
   *
   * @param key identificador del elemento
   * @param value valor del elemento
   */
  onChangeForm(key: string, value: any) {
    this.formValue = { ...this.formValue, [key]: value };
    if (key === "zona") {
      this.haciendaService
        .consultarHaciendaZonaId(parseInt(value))
        .subscribe((response) => {
          this.comboHacienda = this.formatOptions(response);
          this.formularioInput[2].options = this.comboHacienda;
        });
    }
    if (
      this.formValue.encuesta !== "" &&
      this.formValue.encuesta !== undefined &&
      this.formValue.hacienda !== "" &&
      this.formValue.hacienda !== undefined &&
      this.formValue.zona !== "" &&
      this.formValue.zona !== undefined
    ) {
      this.getDataTable(this.formValue.encuesta, this.formValue.hacienda);
    }
  }
  /**
   * Formatea la cabecera de la tabla
   *
   * @returns la cabecera de la tabla
   */
  generateHeaderExport(titles: IHeaderTable): string[] {
    return titles.map((x) => x.title);
  }
  /**
   * Formateo el codigo para el contenido de la tabla
   *
   * @returns el contenido de la tabla
   */
  generateBodyExport(): string[][] {
    return this.dataTabla.map((x) =>
      this.titulosTabla.map((y) => x[y.dataIndex])
    );
  }
  /**
   * Funcion para formatear la informacion para los combos de los selects
   *
   * @param opciones - Array con las opciones para el select
   * @returns data formateada
   */
  formatOptions(opciones: any[]): IOPtions {
    return opciones.map(
      (x): IOPtion => ({ label: x.nombre, value: x.id.toString() })
    );
  }
  /**
   * Funcion para obtener la informacion para los selects
   */
  getCombosTofilters() {
    this.encuestaService.getConsultaEncuesta().subscribe((response) => {
      this.comboEncuesta = this.formatOptions(response);
      this.formularioInput[0].options = this.comboEncuesta;
    });
    this.zonaService.consultarZona().subscribe((response) => {
      this.comboZona = this.formatOptions(response);
      this.formularioInput[1].options = this.comboZona;
    });
  }
  /**
   * Funcion para validar la cabecera de la tabla
   *
   * @param tipoCabecera
   */
  validarCabeceraTabla(tipoCabecera: string) {
    const cabecera_interno: IHeaderTable = [
      {
        title: "Empresa",
        dataIndex: "empresa",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Hacienda",
        dataIndex: "hacienda",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Cédula",
        dataIndex: "cedula",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Acepto",
        dataIndex: "acepto",
        align: AlignTableEnum.CENTER,
        type: TypeColTableEnum.BOOLEAN,
      },
      {
        title: "Fecha",
        dataIndex: "fecha",
        align: AlignTableEnum.CENTER,
        /* filterType: FilterTypeTableEnum.DATE, */
      },
      {
        title: "Hora",
        dataIndex: "hora",
        align: AlignTableEnum.CENTER,
      },
      {
        title: "Usuario",
        dataIndex: "usuario",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Dispositivo",
        dataIndex: "dispositivo",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Ubicación",
        dataIndex: "ubicacion",
        filterType: FilterTypeTableEnum.STRING,
      },
      { title: "Estado", dataIndex: "estado" },
    ];
    const cabecera_externo: IHeaderTable = [
      {
        title: "Empresa",
        dataIndex: "empresa",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Cédula",
        dataIndex: "cedula",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Nombre",
        dataIndex: "nombre",
        filterType: FilterTypeTableEnum.STRING,
      },
      {
        title: "Acepto",
        dataIndex: "acepto",
        align: AlignTableEnum.CENTER,
        type: TypeColTableEnum.BOOLEAN,
      },
      {
        title: "Fecha",
        dataIndex: "fecha",
        align: AlignTableEnum.CENTER,
        /* filterType: FilterTypeTableEnum.DATE, */
      },
      {
        title: "Hora",
        dataIndex: "hora",
        align: AlignTableEnum.CENTER,
      },
      {
        title: "Usuario",
        dataIndex: "usuario",
        filterType: FilterTypeTableEnum.STRING,
      },
      { title: "IP", dataIndex: "ip" },
      {
        title: "Realizado",
        dataIndex: "realizado",
        type: TypeColTableEnum.BOOLEAN,
      },
      { title: "Estado", dataIndex: "estado", align: AlignTableEnum.CENTER },
    ];
    switch (tipoCabecera) {
      case "externo":
        this.titulosTabla = cabecera_externo;
        this.titulosTablaExport = this.generateHeaderExport(cabecera_externo);
        break;
      case "interno":
        this.titulosTabla = cabecera_interno;
        this.titulosTablaExport = this.generateHeaderExport(cabecera_interno);
        break;

      default:
        break;
    }
  }
  getDataTable(id_encuesta: string, id_hacienda: string) {
    this.consentimientoService
      .getReporteConsentimiento(id_encuesta, id_hacienda)
      .subscribe((response) => {
        this.dataTabla = response;
        this.dataTablaExport = this.generateBodyExport();
      });
  }
}
