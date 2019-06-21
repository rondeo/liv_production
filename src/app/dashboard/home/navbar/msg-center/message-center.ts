export interface BasicResponse {
  status: number;
  info: Array<object>;
}

export interface NotificationListResponse extends BasicResponse {
  count: number;
  totalCount: number;
}

export interface NotificationDetailsResponse extends BasicResponse {
  type: string;
}
