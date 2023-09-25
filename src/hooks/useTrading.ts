import { useMutation, useQuery, useQueryClient } from 'react-query';
import { TRADING_KEY, queryStocks, updateStocks } from '../model/Trading';

export const useStock = () => {
  // 访问 client
  const queryClient = useQueryClient();
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

  return {
    stocks: data,
    isLoading,
    modifyStock: (stock: Stock.TradingParams) => {
      let originData = data || [];
      // 计算费用
      // 找到对应的股票
      const currentStock = originData.find((item) => item.code === stock.code);
      if (stock.buyOrSell) {
        originData = [...originData, stock];
      } else {
        originData = [...originData, stock];
      }
      mutation.mutate([...originData]);
    },
  };
};
