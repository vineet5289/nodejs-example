import ESClient from '../../db/elasticsearch';

export default class ElasticSearchDocumentUtil {
  public static addDocument = async (
    docId: any,
    indexName: string,
    data: any
  ) => {
    const esClient = ESClient.getESInstance();
    return esClient.index({
      index: indexName,
      id: docId,
      body: data,
    });
  };

  public static updateDocument = async (
    docId: any,
    indexName: string,
    data: any
  ) => {
    const esClient = ESClient.getESInstance();
    return esClient.update({
      index: indexName,
      id: docId,
      body: data,
    });
  };

  public static searchDocument = async (indexName: string, data: any) => {
    const esClient = ESClient.getESInstance();
    return esClient.search({
      index: indexName,
      body: data,
    });
  };
}
