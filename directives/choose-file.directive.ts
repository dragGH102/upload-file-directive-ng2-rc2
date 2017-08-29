import {EventEmitter, Directive, OnInit, ElementRef, HostListener} from '@angular/core';
import {UploadFile} from "./../services/upload-file.service";

@Directive({
    selector: '[chooseFile]',
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

export class ChooseFileDirective implements OnInit {
    /** class properties */
    uploaded: EventEmitter<any> = new EventEmitter();
    events: EventEmitter<any> = new EventEmitter();
    files: any[] = [];
    options: {url: string; data: any};
    authToken: string;

    // store multiple instances of the file
    fileMultiplier: number = 1;
    uploadIndex: number;

    constructor(private _element: ElementRef, private _uploadService: UploadFile) { }

    /** lifecycle events */
    ngOnInit() {
        // subscribe to directive's events
        this.events.subscribe((action: string) => {
            // upload the previously uploaded file when requested manually
            if (action === 'startUpload-select') {
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
    }

    /** class' methods */
    // ...same for this._element.nativeElement.addEventListener('drop' @ drag-file directive)
    // listen to child's events (change is triggered when a file is uploaded)
    @HostListener('change') onChange(): void {
        // set options
        this._uploadService.setOptions(this.options);

        // store and upload file
        for (let i = 0; i < this.fileMultiplier; i++)
            this.files.push(this._element.nativeElement.files[0]);
        this._uploadService.uploadFile(this.files[this.uploadIndex], this.authToken);
    }
}
