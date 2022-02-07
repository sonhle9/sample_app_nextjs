import {Injectable} from '@angular/core';
import {notificationEventBus, NotificationOptions} from 'src/react/hooks/use-notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  showMessage(options: NotificationOptions): void {
    notificationEventBus.emit(options);
  }
}
