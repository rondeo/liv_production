import { Injectable, ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { environment } from '../environments/environment';

Sentry.init({
    dsn: environment.sentryKey
});

@Injectable({
    providedIn: 'root'
})
export class ExceptionHandlerService implements ErrorHandler {

    constructor() { }

    handleError(error) {
        console.log('Capture Exception and send to Sentry successfully',error);
        Sentry.captureException(error.originalError || error);
        throw error;
    }
}
