export interface IInput {
  label: string;
  key: string;
  type?: TypeInputEnum;
  options?: IOPtions;
  colWidth?: ColWidthType;
  placeholder?: string;
}

export interface IOPtion {
  label: string;
  value: string | number;
}

export type IInputs = IInput[];

export type IOPtions = IOPtion[];

export type ColWidthType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export enum TypeInputEnum {
  TEXT = "text",
  SELECT = "select",
}
