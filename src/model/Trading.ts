import store from 'store2';

// 券商佣金
export const TRADING_FEE_RATE = 0.0003;
// 券商佣金最低
export const MIN_TRADING_FEE = 5;
// 印花税
export const STAMP_TAX_RATE = 0.0005;
// 过户费
export const TRANSFER_FEE_RATE = 0.00001;
// 最小交易股数
export const MIN_TRADING_QUANTITY = 100;
// 缓存 key
export const TRADING_KEY = 'trading_stocks';

// 舍去保留2位小数
export const round = (num: number) => Math.round(num * 100) / 100;

// 计算费用
export const calculateFee = (stock: Stock.TradingParams) => {
  // 股票总价
  const totalCost = stock.quantity * stock.price;
  // 券商佣金
  let tradingFee = totalCost * TRADING_FEE_RATE;
  tradingFee = tradingFee < MIN_TRADING_FEE ? MIN_TRADING_FEE : tradingFee;
  // 印花税
  const stampTax = totalCost * STAMP_TAX_RATE;
  // 过户费
  const transferFee = totalCost * TRANSFER_FEE_RATE;
  // 计算总费用
  const totalFee = tradingFee + stampTax + transferFee;
  return round(totalFee);
};

// 计算成本
export const calculateCost = (stock: Stock.TradingParams) => {
  // 股票总价
  const totalCost = stock.quantity * stock.price + calculateFee(stock);
  return round(totalCost);
};

// 计算盈亏
export const calculateProfit = (stock: Stock.TradingParams) => {
  // 股票总成本
  const totalCost = calculateCost(stock);
  // 股票现值
  const currentPrice = stock.currentPrice * stock.quantity;
  // 计算盈亏
  return round(currentPrice - totalCost);
};

// 计算盈亏率
export const calculateProfitRate = (stock: Stock.TradingParams) => {
  // 股票盈亏
  const profit = calculateProfit(stock);
  // 股票总成本
  const totalCost = calculateCost(stock);
  // 计算盈亏率
  return round(profit / totalCost);
};

// 计算股票均价
export const calculateAveragePrice = (stock: Stock.TradingParams) => {
  // 股票总价
  const totalCost = calculateCost(stock);
  // 股票总数量
  const totalQuantity = stock.quantity;
  // 计算均价
  return round(totalCost / totalQuantity);
};

// 合并股票
export const mergeStock = (
  stock1: Stock.TradingParams,
  stock2: Stock.TradingParams
) => {
  // 合并总股数
  const totalQuantity =
    stock1.quantity + (stock2.isBuy ? stock2.quantity : -stock2.quantity);
  // stock1的总价
  const totalCost1 = stock1.quantity * stock1.price;
  // stock2的总价
  const totalCost2 = calculateCost(stock2);
  // 合并总价
  const totalCost = totalCost1 + stock2.isBuy ? totalCost2 : -totalCost2;
};

// 转入资金
export const transferInFund = (stock: Stock.TradingParams) => {
  console.log(stock);
};
// 转出资金
export const transferOutFund = (stock: Stock.TradingParams) => {
  console.log(stock);
};
// 查询股票
export const queryStocks = async () => {
  return store.get(TRADING_KEY);
};

export const updateStocks = async (stocks: Stock.Info[]) => {
  store.set(TRADING_KEY, stocks);
};
