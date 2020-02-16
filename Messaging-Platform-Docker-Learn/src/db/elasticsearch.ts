const es = require('elasticsearch');
const esConfig = require('../config/config').elasticsearch;

export default class ElasticsearchClient {
  public static getESInstance = () => {
    if (!ElasticsearchClient.esClient) {
      ElasticsearchClient.esClient = ElasticsearchClient.esClientInstance();
    }
    return ElasticsearchClient.esClient;
  };
  private static esClient: any;

  private static esClientInstance = () => {
    return new es.Client({
      hosts: [esConfig.host],
    });
  };
}
