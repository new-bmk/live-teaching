import { Injectable } from "@angular/core";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class ExportExcelService {
  constructor() {}

  async generateExcel(datas, header, workSheetName?, name?) {
    //USING EXPORT EXCEL
    //Header format
    // let header = [
    //   { header: 'ID', key: 'id', width: 10 },
    //   { header: 'TITLE', key: 'title', width: 10 },
    // ]
    //Data format
    // let datas = [
    //   {id: 1, title: "te1212"},
    //   {id: 2, title: "te1213"},
    //   {id: 3, title: "te1214"},
    // ]
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getDate() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getFullYear();
    let sheetName = workSheetName ? workSheetName : "Report";
    let fileName = name
      ? `${formatted_date}-${name}.xlsx`
      : `report_${formatted_date}.xlsx`;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = header;
    datas.forEach(data => {
      worksheet.addRow(_.assignIn(data));
    });
    let buf = await workbook.xlsx.writeBuffer();
    let blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, fileName);
  }
}
