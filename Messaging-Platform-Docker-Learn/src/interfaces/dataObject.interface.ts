import { MessageStatusType } from '../common/enums';

export interface JwtDataMap {
  data: {
    _id: number;
    api_version: number;
    enabled_modules: any[];
    enabled_features: any[];
    token?: string;
  };
}

export interface UpdateObject {
  [key: string]: any;
}

export interface PaginationObject {
  [key: string]: any;
}

export interface QueryParams {
  query: string;
  page: string;
  limit: string;
  sort: string;
  rpaRole: string | string[];
  mvp: string;
  featured: string;
  country: string;
  jobSeeker: string;
  rank: string | string[];
}

export interface ChatRoomDetailsSearchFilters {
  query: string;
  sort: {};
  page: number;
  limit: number;
  include_chat_room: number[];
  search_message_persent: boolean;
}

export interface ChatRoomQueryParams {
  query: string;
  sort: string;
  page: string;
  limit: string;
  message: string;
}
