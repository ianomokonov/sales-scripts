import { ChangeDetectorRef, EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /** отображать возможность отмены */
  private hasCancelBtn: boolean = true;
  /** срабатывает при отмене загрузки */
  public onCancel: EventEmitter<boolean> = new EventEmitter();
  /** cdRef */
  private cdRef!: ChangeDetectorRef;
  /** set isLoading */
  public set isLoading(value: boolean) {
    // eslint-disable-next-line no-underscore-dangle
    this._isLoading = value;
  }
  /** get isLoading */
  public get isLoading(): boolean {
    // eslint-disable-next-line no-underscore-dangle
    return this._isLoading;
  }
  /** идет загрузка */
  // @ts-ignore
  private _isLoading: boolean;
  /** текущие подписки приложения */
  private subscriptions: Subscription = new Subscription();
  /** количество активных подписок */
  private subscriptionsCount: number = 0;
  /** установить отображение кнопки отмены по умолчанию */
  public setDefaultCancelBtn(): void {
    this.hasCancelBtn = true;
  }
  /** инициализация changeDetectorRef */
  public set changeDetectorRef(cdr: ChangeDetectorRef) {
    this.cdRef = cdr;
  }
  /** отменить текущие загрузки */
  public cancelLoading(): void {
    if (!this.hasCancelBtn) {
      return;
    }
    this.subscriptions.unsubscribe();
    this.isLoading = false;
    this.setDefaultCancelBtn();
    this.subscriptions = new Subscription();
    this.subscriptionsCount = 0;
  }
  /** добавление подписки */
  public addSubscription(subscription: Subscription): void {
    // eslint-disable-next-line no-plusplus
    this.subscriptionsCount++;
    this.subscriptions.add(subscription);
    this.isLoading = true;
    this.cdRef.detectChanges();
  }
  /** удаление подписки */
  public removeSubscription(subscription: Subscription): void {
    // eslint-disable-next-line no-plusplus
    this.subscriptionsCount--;
    this.subscriptions.remove(subscription);
    if (this.subscriptionsCount === 0) {
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }
}
