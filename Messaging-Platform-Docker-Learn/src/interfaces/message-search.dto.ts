export class MessageSearchDocumentDto {
  public readonly _source: string[] = ['chat_room_id'];
  public size: number;
  public from: number;
  public sort: SearchMessageSortField[] = [{ created_at: 'desc' }];
  public aggs: SearchMessageChatRoomBucketField = {
    chat_room_bucket: {
      terms: {
        field: 'chat_room_id',
      },
      aggs: {
        group_docs: {
          top_hits: {
            size: 1,
            _source: ['chat_room_id'],
            sort: {
              created_at: 'desc',
            },
          },
        },
      },
    },
  };

  public readonly query: SearchMessageBoolField;

  constructor(
    searchMessage: string,
    userId: number,
    size: number,
    from: number
  ) {
    this.size = size;
    this.from = from;
    this.query = {
      bool: {
        must: [
          { match: { message: { query: searchMessage, operator: 'and' } } },
          { match: { user_ids: userId } },
        ],
      },
    };
  }
}

interface SearchMessageChatRoomBucketField {
  chat_room_bucket: SearchMessageBucketField;
}

interface SearchMessageSortField {
  created_at: string;
}

interface SearchMessageBucketField {
  terms: SearchMessageField;
  aggs: SearchMessageAggregateField;
}

interface SearchMessageField {
  field: string;
}

interface SearchMessageAggregateField {
  group_docs: SearchMessageGroupDocField;
}

interface SearchMessageGroupDocField {
  top_hits: SearchMessageTopHitsField;
}

interface SearchMessageTopHitsField {
  size: number;
  _source: string[];
  sort: SearchMessageSortField;
}

interface SearchMessageBoolField {
  bool: SearchMessageMustField;
}

interface SearchMessageMustField {
  must: SearchMessageMatchField[];
}

interface SearchMessageMatchField {
  match: {};
}
