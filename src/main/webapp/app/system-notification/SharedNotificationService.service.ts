import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedNotificationService {
  private subject = new Subject<any>();
  private logoutSubject = new Subject<any>();

  sendLoginEvent(): void {
    this.subject.next();
  }
  getLoginEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  sendLogoutEvent(): void {
    this.logoutSubject.next();
  }
  getLogoutEvent(): Observable<any> {
    return this.logoutSubject.asObservable();
  }
}
