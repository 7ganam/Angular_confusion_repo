import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import {  HttpHeaders } from '@angular/common/http';
import { Feedback, ContactType } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

    postFeedback(feedback: Feedback): Observable<Feedback>
    {
         console.log(feedback);
        const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
        return this.http.post<Feedback>(baseURL + 'feedback/' , feedback , httpOptions)
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }

}
