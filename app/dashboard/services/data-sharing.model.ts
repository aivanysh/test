export class MenuCountInt {
  actualRows: string;
  filteredRows: string;
  inbounds: MenuItemsInfo[];
  outbounds: MenuItemsInfo[];
  sourceID: number;    
  success: boolean;
  totalRows: number;
  totalSourceRows: number;
} 

export class MenuItemsInfo {
  Count: string;
  ResultName: string;
  Title: string;
  icon: string;
  router: string;
}