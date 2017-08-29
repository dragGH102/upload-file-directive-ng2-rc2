import {ChooseFileDirective} from "./directives/choose-file.directive";
import {DragFileDirective} from "./directives/drag-file.directive";

export * from './services/upload-file.service';
export * from './directives/choose-file.directive';
export * from './directives/drag-file.directive';

export const FILE_UPLOAD_DIRECTIVES: any[] = [
    ChooseFileDirective,
    DragFileDirective
];