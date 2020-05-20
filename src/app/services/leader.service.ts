import { Injectable } from '@angular/core';
import { Leader } from '../shared/Leader';
import { LEADERS } from '../shared/Leaders';
import { delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import {  HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  getLeaders(): Observable<Leader[]> {
    return of(LEADERS).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leaders')
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }

  getFeaturedLeader(): Observable<Leader> {
    return of(LEADERS.filter((Leader) => Leader.featured)[0]).pipe(delay(2000));
  }


  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }
}
