export class MiaImportColumn {

    static TYPE_STRING = 0;
    static TYPE_DOUBLE = 1;
    static TYPE_INT = 2;
    static TYPE_DATE = 3;
    static TYPE_EMAIL = 4;

    title: string = '';
    field_key: string = '';
    type: number = 0;
    columnIndex?: number = -1;
    field_option?: string = ''; // Key donde se guarda el valor del tipo de dato
    options?: Array<any>;
    columnOptionId?: any;
}
