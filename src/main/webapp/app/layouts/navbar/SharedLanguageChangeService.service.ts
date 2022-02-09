import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedLanguageChangeService {
  private subject = new Subject<any>();

  sendChangeEvent(): void {
    this.subject.next();
  }
  getChangeEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
