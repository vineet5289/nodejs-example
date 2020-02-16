import ESClient from '../../db/elasticsearch';

export default class ElasticSearchIndexUtil {
  public static indexCreate = async (indexName: string) => {
    const esClient = ESClient.getESInstance();
    return esClient.indices.create({
      index: indexName,
    });
  };

  public static indexExits = async (indexName: string) => {
    const esClient = ESClient.getESInstance();
    return esClient.indices.exits({
      index: indexName,
    });
  };
}
