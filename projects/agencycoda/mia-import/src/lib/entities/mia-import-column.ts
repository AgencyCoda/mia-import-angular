export class MiaImportColumn {

    static TYPE_STRING = 0;
    static TYPE_DOUBLE = 1;
    static TYPE_INT = 2;
    static TYPE_DATE = 3;
    static TYPE_EMAIL = 4;

    title: string = '';
    field_key: string = '';
    type: number = 0;

    moreFields?: Array<MiaImportExtraField>;

    unique?: boolean; // Determina Si el tipo se permite seleccionar en mas de una columna para hacer merge o no.
}

export class MiaImportExtraField {
    static TYPE_FORMAT = 0;
    static TYPE_ADD = 1;

    static FIELD_TYPE_SELECT = 0;
    static FIELD_TYPE_INPUT = 1;

    title: string = '';
    field_key?: string = '';
    type: number = 0;
    field_type: number = 0;
    options?: Array<any>;
    value?: any;
}

export class MiaImportDataColumn {
    index: number = 0;
    column?: MiaImportColumn
}