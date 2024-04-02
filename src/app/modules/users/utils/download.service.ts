import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private downloadingSubject = new BehaviorSubject<boolean>(false);
  downloading$ = this.downloadingSubject.asObservable();

  startDownload() {
    this.downloadingSubject.next(true);
  }

  stopDownload() {
    this.downloadingSubject.next(false);
  }
}
