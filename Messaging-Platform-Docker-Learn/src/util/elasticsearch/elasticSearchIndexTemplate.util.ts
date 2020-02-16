import messageTemplateJson from '../../config/messageindex.json';
import ESClient from '../../db/elasticsearch';
const messageSearchIndex = require('../../config/config').messageSearchIndex;

export default class ElasticSearchIndexTemplateUtil {
  public static addTemplate = async (
    templateName: string,
    mapping: any,
    order: number
  ) => {
    const esClient = await ESClient.getESInstance();
    return esClient.indices.putTemplate({
      name: templateName,
      order,
      body: mapping,
    });
  };

  public static loadTemplateFromFile = async (
    templateName: string,
    filePath: string,
    order: number
  ) => {
    return await ElasticSearchIndexTemplateUtil.addTemplate(
      templateName,
      messageTemplateJson,
      order
    );
  };

  public static createChatMessageTemplate = async () => {
    ElasticSearchIndexTemplateUtil.loadTemplateFromFile(
      messageSearchIndex.indexTemplateName,
      messageSearchIndex.indexTemplateFileName,
      0
    );
  };
}
