import { Component, Input } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as moment from "moment";
/**
 * Componente para generar el boton del reporte Excel de una tabla
 *
 * @param headerTable - Cabecera de la tabla
 * @param sheetName - nombre de la hoja
 * @param dataTable - contenido de la tabla
 * @param fileName - nombre del documento
 *
 */
@Component({
  selector: "app-export-button",
  templateUrl: "./export-button.component.html",
  styleUrls: ["./export-button.component.css"],
})
export class ExportButtonComponent {
  @Input() headerTable: string[] = [];
  @Input() sheetName: string = "";
  @Input() dataTable: string[][] = [];
  @Input() fileName: string = "";

  async generarExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(this.sheetName);
    const headerRow = worksheet.addRow(this.headerTable);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "rgb(227, 199, 22)" },
      };
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    this.dataTable.forEach((element) => {
      const bodyRow = worksheet.addRow(element);
      bodyRow.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const now = moment().format("YYYY_MM_DD_HH:mm:ss");
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${this.fileName}_${now}.xlsx`;
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
  }
}
