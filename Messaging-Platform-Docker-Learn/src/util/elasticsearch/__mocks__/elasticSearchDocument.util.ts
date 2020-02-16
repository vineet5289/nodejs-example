export default class ElasticSearchDocumentUtil {
  public static searchDocument = async (indexName: string, data: any) => {
    if (indexName === "chat-message-*") {
      if (ElasticSearchDocumentUtil.isDataUndefined(data)) {
        return undefined;
      } else if (ElasticSearchDocumentUtil.isDataForEmptyRecord(data)) {
        return {};
      } else if (ElasticSearchDocumentUtil.isDataForEmptyAggRecord(data)) {
        return ElasticSearchDocumentUtil.createDataWithEmptyAggRecord();
      } else if (ElasticSearchDocumentUtil.isDataForEmptyBucketRecord(data)) {
        return ElasticSearchDocumentUtil.createDataWithEmptyBucketRecord();
      } else if (ElasticSearchDocumentUtil.isDataForEmptyGroupHitRecord(data)) {
        return ElasticSearchDocumentUtil.createDataWithEmptyGroupHitRecord();
      } else if (ElasticSearchDocumentUtil.isDataForOneRecord(data)) {
        return ElasticSearchDocumentUtil.createDataWithOneRecord();
      } else if (ElasticSearchDocumentUtil.isDataForMultipleRecord(data)) {
        return ElasticSearchDocumentUtil.createDataWithMultipleRecord();
      }
    }
    return {};
  };

  private static isDataForOneRecord = (d: any) => {
    return (
      ElasticSearchDocumentUtil.getUserId(d) === 1 &&
      ElasticSearchDocumentUtil.getSearchData(d) === "match with one record" &&
      ElasticSearchDocumentUtil.getSearchDataOperator(d) === "and"
    );
  };

  private static createDataWithOneRecord = () => {
    return {
      aggregations: {
        chat_room_bucket: {
          buckets: [
            {
              group_docs: {
                hits: {
                  hits: [
                    {
                      _index: "chat-message-2019-12",
                      _source: { chat_room_id: 1 }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    };
  };

  private static isDataForMultipleRecord = (d: any) => {
    return (
      ElasticSearchDocumentUtil.getUserId(d) === 1 &&
      ElasticSearchDocumentUtil.getSearchData(d) ===
        "match with multiple record" &&
      ElasticSearchDocumentUtil.getSearchDataOperator(d) === "and"
    );
  };

  private static createDataWithMultipleRecord = () => {
    return {
      aggregations: {
        chat_room_bucket: {
          buckets: [
            {
              key: 1,
              group_docs: {
                hits: {
                  hits: [
                    {
                      _index: "chat-message-2019-12",
                      _source: { chat_room_id: 1 }
                    }
                  ]
                }
              }
            },
            {
              key: 2,
              group_docs: {
                hits: {
                  hits: [
                    {
                      _index: "chat-message-2019-12",
                      _source: { chat_room_id: 2 }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    };
  };

  private static isDataForEmptyGroupHitRecord = (d: any) => {
    return (
      ElasticSearchDocumentUtil.getUserId(d) === 1 &&
      ElasticSearchDocumentUtil.getSearchData(d) ===
        "empty group hit message" &&
      ElasticSearchDocumentUtil.getSearchDataOperator(d) === "and"
    );
  };

  private static createDataWithEmptyGroupHitRecord = () => {
    return {
      aggregations: {
        chat_room_bucket: { buckets: [{ group_docs: { hits: { hits: [] } } }] }
      }
    };
  };

  private static isDataForEmptyBucketRecord = (d: any) => {
    return (
      ElasticSearchDocumentUtil.getUserId(d) === 1 &&
      ElasticSearchDocumentUtil.getSearchData(d) === "empty bucket message" &&
      ElasticSearchDocumentUtil.getSearchDataOperator(d) === "and"
    );
  };

  private static createDataWithEmptyBucketRecord = () => {
    return { aggregations: { chat_room_bucket: { buckets: [] } } };
  };

  private static isDataForEmptyAggRecord = (d: any) => {
    return (
      ElasticSearchDocumentUtil.getUserId(d) === 1 &&
      ElasticSearchDocumentUtil.getSearchData(d) === "empty agg message" &&
      ElasticSearchDocumentUtil.getSearchDataOperator(d) === "and"
    );
  };

  private static createDataWithEmptyAggRecord = () => {
    return { aggregations: {} };
  };

  private static isDataForEmptyRecord = (d: any) => {
    return (
      ElasticSearchDocumentUtil.getUserId(d) === 1 &&
      ElasticSearchDocumentUtil.getSearchData(d) === "unknown search message" &&
      ElasticSearchDocumentUtil.getSearchDataOperator(d) === "and"
    );
  };

  private static isDataUndefined = (data: any) => {
    return data === undefined;
  };

  private static getSearchData(data: any) {
    return data.query.bool.must[0].match.message.query;
  }
  private static getSearchDataOperator(data: any) {
    return data.query.bool.must[0].match.message.operator;
  }

  private static getUserId(data: any) {
    return data.query.bool.must[1].match.user_ids;
  }
}
