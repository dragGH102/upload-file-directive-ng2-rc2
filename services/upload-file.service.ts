import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class UploadFile {
    /** class properties */
    public responseEmitter: EventEmitter<any> = new EventEmitter();
    data: any;
    url: string;

    /** lifecycle events */
    // none yet

    /** class's methods */
    uploadFile(file: any, authToken: string) {

        // set fields
        let xhr = new XMLHttpRequest();
        let form = new FormData();

        // override mime type of the file set to "application/octastream" instead of "text/csv" for most browsers / platforms
        file = new Blob([file], {type: 'text/csv'});

        form.append('file', file, file.name);
        form.append('payload', JSON.stringify(this.data));

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let res: any;
                if (!xhr.response || xhr.response == '')
                    res = {error: 'error'};
                else
                    try {
                        res = JSON.parse(xhr.response);
                    }
                    catch(error) {
                        res = {error: 'error'};
                    }

                // return response
                this.responseEmitter.emit(res);
            }
        };

        xhr.upload.onerror = () => {
            // report error
            this.responseEmitter.emit({error: 'error'});
        };

        // upload file at index i
        xhr.open('POST', this.url, true);

        /** cross-browser compatibility */
        // inject Accept header for Firefox (error 406) - not required in Chrome / IE Edge
        xhr.setRequestHeader('Accept', 'application/json');

        // inject auth headers
        if (authToken) xhr.setRequestHeader('authorization', authToken);

        xhr.send(form);
    }

    setOptions(options: any) {
        this.url = options.url != null ? options.url : this.url;
        this.data = options.data != null ? options.data : this.data;
    }
}