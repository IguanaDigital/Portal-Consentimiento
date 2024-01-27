export interface IHeaderTableElement {
  title?: string;
  dataIndex?: string;
  width?: number;
  align?: AlignTableEnum;
  type?: TypeColTableEnum;
  actions?: IActionsTable;
  filterType?: FilterTypeTableEnum;
}

export interface IActionTable {
  action: ActionsTableEnum;
  function?: string;
}

export interface IAttributesTable {
  n?: number;
  key?: number;
}

export type IActionsTable = IActionTable[];

export type IHeaderTable = IHeaderTableElement[];

export enum AlignTableEnum {
  RIGHT = "right",
  LEFT = "left",
  CENTER = "center",
}

export enum TypeColTableEnum {
  CHECK = "check",
  ACTIONS = "actions",
  BOOLEAN = "boolean",
  COLOR = "color",
}

export enum ActionsTableEnum {
  EDIT = "edit",
  DELETE = "delete",
}

export enum FilterTypeTableEnum {
  STRING = "string",
  DATE = "date",
  TIME = "time",
}
