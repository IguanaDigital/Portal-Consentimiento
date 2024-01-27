import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ActionsTableEnum,
  AlignTableEnum,
  IHeaderTable,
  TypeColTableEnum,
} from "src/app/component/table/table.interface";
import { ICompaniaTable, ICompaniasTable } from "./compania.interface";
@Component({
  selector: "app-compania",
  templateUrl: "./compania.component.html",
  styleUrls: ["./compania.component.css"],
})
export class CompaniaComponent {
  titulosTabla: IHeaderTable = [
    { title: "N°", dataIndex: "n", align: AlignTableEnum.CENTER, width: 45 },
    { title: "Compañia", dataIndex: "nombre" },
    { title: "Logo", dataIndex: "logo" },
    {
      title: "Color Background",
      dataIndex: "color_bg",
      width: 125,
      type: TypeColTableEnum.COLOR,
    },
    {
      title: "Color Frontground",
      dataIndex: "color_fg",
      width: 125,
      type: TypeColTableEnum.COLOR,
    },
    { title: "Tipo", dataIndex: "tipo", width: 50 },
    { title: "Correo notificación", dataIndex: "mail_notificacion" },
    { title: "Correo administrador", dataIndex: "mail_administrador" },
    {
      type: TypeColTableEnum.ACTIONS,
      actions: [
        { action: ActionsTableEnum.EDIT, function: "onEdit" },
        /* {
          action: ActionsTableEnum.DELETE,
          function: "onDelete",
        }, */
      ],
      width: 50,
    },
  ];
  dataTabla: ICompaniasTable = [
    {
      n: 1,
      key: 123,
      id_compania: "1",
      nombre: "Compañía A",
      tipo: "Tipo X",
      logo: "ruta/al/logo1.png",
      color_bg: "#0F673F",
      color_fg: "#D1E7DD",
      mail_notificacion: "ejemplo1@compania.com",
      mail_administrador: "ejemplo1@compania.com",
    },
    {
      n: 2,
      key: 456,
      id_compania: "2",
      nombre: "Compañía B",
      tipo: "Tipo Y",
      logo: "ruta/al/logo2.png",
      color_bg: "#0F6710",
      color_fg: "#8AE88B",
      mail_notificacion: "ejemplo2@compania.com",
      mail_administrador: "ejemplo2admin@compania.com",
    },
    {
      n: 3,
      key: 789,
      id_compania: "3",
      nombre: "Compañía C",
      tipo: "Tipo Z",
      logo: "ruta/al/logo3.png",
      color_bg: "#360E78",
      color_fg: "#AC8CE0",
      mail_notificacion: "ejemplo3@compania.com",
      mail_administrador: "ejemplo3admin@compania.com",
    },
    {
      n: 4,
      key: 101,
      id_compania: "4",
      nombre: "Compañía D",
      tipo: "Tipo X",
      logo: "ruta/al/logo4.png",
      color_bg: "#6E0F53",
      color_fg: "#E88ACD",
      mail_notificacion: "ejemplo4@compania.com",
      mail_administrador: "ejemplo4admin@compania.com",
    },
    {
      n: 5,
      key: 112,
      id_compania: "5",
      nombre: "Compañía E",
      tipo: "Tipo Y",
      logo: "ruta/al/logo5.png",
      color_bg: "#6E1F0F",
      color_fg: "#E09A8C",
      mail_notificacion: "ejemplo5@compania.com",
      mail_administrador: "ejemplo5admin@compania.com",
    },
  ];
  companiaEditar: ICompaniaTable;
  formModificarCompania: any;
  constructor(private modalService: NgbModal) {}
  onEdit(key: number, modal: any) {
    this.companiaEditar = this.dataTabla.find((x: any) => x.key === key);
    console.log("this.companiaEditar", this.companiaEditar);
    this.modalService.open(modal, { size: "lg" });
  }
  onDelete(key: number) {
    console.log("input onDelete", key);
  }
}
