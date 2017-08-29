import {EventEmitter, Directive, OnInit, ElementRef} from '@angular/core';
import {UploadFile} from "./../services/upload-file.service";

@Directive({
    selector: '[dragFile]',
    inputs: [
        'events',
        'options',
        'fileMultiplier',
        'authToken',
        'uploadIndex'
    ],
    outputs: [
        'uploaded'
    ]
})

export class DragFileDirective implements OnInit {
    /** class properties */
    uploaded: EventEmitter<any> = new EventEmitter();
    events: EventEmitter<any> = new EventEmitter();
    files: any[] = [];
    options: {url: string; data: any};
    authToken: string;

    // store multiple instances of the same file
    fileMultiplier: number = 1;
    uploadIndex: number;

    constructor(private _element: ElementRef, private _uploadService: UploadFile) { }

    /** lifecycle events */
    ngOnInit() {
        let classRef = this;

        // subscribe to directive's events
        this.events.subscribe((action: string) => {
            // upload the previously uploaded file when requested manually
            if (action === 'startUpload-drop') {
                // set / update options
                this._uploadService.setOptions(this.options);

                // upload file (manual)
                this._uploadService.uploadFile(this.files[this.uploadIndex], this.authToken);
            }
        });

        // subscribe to upload service's events
        this._uploadService.responseEmitter.subscribe((data: any) => {
            this.uploaded.emit(data);
        });

        // listen to DOM events (parent)
        this._element.nativeElement.addEventListener('drop', (e: any) => {
            // upload when file is chosen
            e.stopPropagation();
            e.preventDefault();

            // set options
            this._uploadService.setOptions(this.options);

            // store and upload file
            for (let i = 0; i < this.fileMultiplier; i++)
                this.files.push(e.dataTransfer.files[0]);

            this._uploadService.uploadFile(this.files[this.uploadIndex], this.authToken);
        }, false);

        // disable default behavior (i.e. open "choose file" dialog)
        this._element.nativeElement.addEventListener('dragenter', (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);

        this._element.nativeElement.addEventListener('dragover', (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }

    /** class' methods */
    // none yet
}
