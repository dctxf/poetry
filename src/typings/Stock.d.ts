/**
 * 股票相关类型定义
 */
declare namespace Stock {
  // 股票信息
  export type Info = {
    // 股票代码
    code: string;
    // 股票名称
    name: string;
    // 股票价格
    price: number;
    // 股票数量
    quantity: number;
    // 成本
    cost: number;
    // 现价
    currentPrice: number;
    // 盈亏
    profit: number;
    // 盈亏率
    profitRate: number;
  };

  // 股票交易参数
  export type TradingParams = Stock & {
    isBuy: boolean;
  };
}
