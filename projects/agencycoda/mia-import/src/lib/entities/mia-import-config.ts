import { Subject } from "rxjs";
import { MiaImportColumn } from "./mia-import-column";

export class MiaImportConfig {
    title = '';
    columns: Array<MiaImportColumn> = [];
}
