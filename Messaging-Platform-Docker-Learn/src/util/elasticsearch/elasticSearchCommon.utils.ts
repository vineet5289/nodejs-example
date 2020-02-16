import { timestampWithFormat } from '../index.util';

export default class ElasticSearchCommonUtil {
  public static constructMessagingIndexName = (indexNamePrefix: string) => {
    const currentTimeStamp = timestampWithFormat('YYYY-MM');
    return `${indexNamePrefix}-${currentTimeStamp}`;
  };
}
