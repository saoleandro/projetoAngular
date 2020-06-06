import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Author } from '../services/auhtor.interface';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  
  constructor(private http: HttpClient) { }

  private static _handleError(err: HttpErrorResponse | any) {
    return Observable.throw(err.messgae || 'Error: Unable to complete request.');
}

  save(author: Author) : Observable<any>{
    if(author.id == 0 || author.id == undefined){
      return this.http.post(`${environment.appApiUrl}/authors`, author, this.getHeaderOption())
                          .pipe(tap(data => { data }))
                          .pipe(catchError(AuthorService._handleError))
    }
    else{
      return this.http.put(`${environment.appApiUrl}/authors/${author.id}`, author, this.getHeaderOption())
                        .pipe(tap(data => { data }))
                        .pipe(catchError(AuthorService._handleError))
    }
  }

  get(id: number) {
    return this.http.get<Author>(`${environment.appApiUrl}/authors/${id}`,  this.getHeaderOption())
    .pipe(tap((data) => { data }))
    .pipe(catchError(AuthorService._handleError))
  } 

  getAll(){
    return this.http.get<Array<Author>>(`${environment.appApiUrl}/authors`,  this.getHeaderOption())
    .pipe(tap((data) => { data }))
    .pipe(catchError(AuthorService._handleError))
  }       
    
  delete(id: number){
    
    return this.http.delete(`${environment.appApiUrl}/authors/${id}`, this.getHeaderOption())
    .pipe(catchError(AuthorService._handleError))

}

  getHeaderOption() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${window.localStorage.getItem('az-token')}`
      })
    }
  }
}
