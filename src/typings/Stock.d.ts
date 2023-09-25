/**
 * 股票相关类型定义
 */
declare namespace Stock {
  // 基础信息
  export type Info = {
    // 股票代码
    code: string;
    // 股票名称
    name: string;
    // 股票价格（每股价格）
    price: number;
    // 股票数量
    quantity: number;
  };

  // 股票交易记录
  export type History = Info & {
    createTime: Date;
    // 券商佣金
    fee: number;
    // 印花税
    stampTax: number;
    // 过户费
    transferFee: number;
  };
}
