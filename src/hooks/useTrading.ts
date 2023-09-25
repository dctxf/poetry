import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  TRADING_HISTORY_KEY,
  TRADING_KEY,
  mergeStock,
  queryStocks,
  queryStocksHistory,
  updateStocks,
  updateStocksHistory,
} from '../model/Trading';

export const useStock = () => {
  // 访问 client
  const queryClient = useQueryClient();
  // 股票
  const { data, isLoading } = useQuery<Stock.Info[]>({
    queryKey: [TRADING_KEY],
    initialData: [],
    queryFn: queryStocks,
  });

  const mutation = useMutation({
    mutationFn: updateStocks,
    onSuccess: () => {
      // 错误处理和刷新
      queryClient.invalidateQueries([TRADING_KEY]);
    },
  });

  // 交易记录
  const tradingQuery = useQuery<Stock.Info[]>({
    queryKey: [TRADING_HISTORY_KEY],
    initialData: [],
    queryFn: queryStocksHistory,
  });
  const tradingMutation = useMutation({
    mutationFn: updateStocksHistory,
    onSuccess: () => {
      // 错误处理和刷新
      queryClient.invalidateQueries([TRADING_HISTORY_KEY]);
    },
  });

  // 新增一条交易记录
  const addTradingRecord = (stock: Stock.Info) => {
    const tradingHistoryList = tradingQuery.data || [];
    const newHistory: Stock.History = {
      ...stock,
      createTime: new Date(),
      fee: 0,
      stampTax: 0,
      transferFee: 0,
    };
    tradingMutation.mutate([newHistory, ...tradingHistoryList]);
  };

  return {
    stocks: data,
    isLoading,
    modifyStock: (stock: Stock.Info) => {
      addTradingRecord(stock);
      const originData = data || [];
      // 找到对应的股票
      const currentStock = originData.find((item) => item.code === stock.code);
      // 合并股票
      stock = mergeStock(stock, currentStock);
      // 更新股票
      mutation.mutate([
        ...originData.filter((item) => item.code !== stock.code),
        stock,
      ]);
    },
  };
};
