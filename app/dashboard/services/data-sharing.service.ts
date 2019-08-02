import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuCountInt, MenuItemsInfo} from "../services/data-sharing.model"

@Injectable({
  providedIn: 'root'  
})
export class DataSharingService {
  private element:MenuCountInt;
  private itemsCountSource = new BehaviorSubject(this.element);
  currentItemsCount = this.itemsCountSource.asObservable();

  constructor() { }

  changeItemsCount(itemsCount: any) {
    this.itemsCountSource.next(itemsCount)
  }
}
