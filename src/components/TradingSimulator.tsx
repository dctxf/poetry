import {
  ModalForm,
  ProColumnType,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Col, Form, Row, Space, Statistic } from 'antd';
import { useState } from 'react';
import { useStock } from '../hooks/useTrading';
import { MIN_TRADING_QUANTITY } from '../model/Trading';

export const TradingSimulator = () => {
  // 股票列表
  const { stocks, modifyStock } = useStock();
  // 股票买卖模态框
  const [buyVisible, setBuyVisible] = useState(false);
  // 股票买卖form数据
  const [buyForm] = Form.useForm();

  // 购买股票按钮点击
  const buyStockHandler = (stock: Stock.Info) => {
    setBuyVisible(true);
    buyForm.setFieldsValue({
      ...stock,
      isBuy: true,
    });
  };
  // 卖出股票按钮点击
  const sellStockHandler = (stock: Stock.Info) => {
    buyForm.setFieldsValue({
      ...stock,
      isBuy: false,
    });
  };

  const columns: ProColumnType<Stock.Info>[] = [
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <Space direction='vertical'>
            <b>{record.name}</b>
            <span>{record.code}</span>
          </Space>
        );
      },
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '成本价/当前价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (_, record) => {
        return (
          <Space direction='vertical'>
            <span>{record.cost}</span>
            <span>{record.currentPrice}</span>
          </Space>
        );
      },
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      key: 'profit',
    },
    {
      title: '盈亏比例',
      dataIndex: 'profitRatio',
      key: 'profitRatio',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => {
        return (
          <Space>
            <Button
              type='primary'
              onClick={() => buyStockHandler({ ...record })}
            >
              Buy
            </Button>
            <Button danger onClick={() => sellStockHandler({ ...record })}>
              Sell
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Trading Simulator</h1>
      <Space direction='vertical'>
        <Card
          title='Earnings panel'
          extra={
            <Button.Group>
              <Button type='primary'>Transfer in</Button>
              <Button danger>Transfer out</Button>
            </Button.Group>
          }
        >
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title='本金' value={112893} />
            </Col>
            <Col span={6}>
              <Statistic title='总资产' value={112893} />
            </Col>
            <Col span={6}>
              <Statistic title='总盈亏' value={112893} />
            </Col>
            <Col span={6}>
              <Statistic title='当日盈亏' value={112893} />
            </Col>
            <Col span={6}>
              <Statistic title='总市值' value={112893} />
            </Col>
            <Col span={6}>
              <Statistic title='可用资金' value={112893} />
            </Col>
            <Col span={6}>
              <Statistic title='收益率' value={112893} />
            </Col>
          </Row>
        </Card>
        <ProTable<Stock.Info>
          rowKey='code'
          headerTitle='List of stocks'
          toolBarRender={() => [
            <Button
              type='primary'
              onClick={() => {
                buyStockHandler({
                  name: '腾讯控股',
                  code: '00700',
                  cost: 0,
                  currentPrice: 0,
                  profit: 0,
                  profitRate: 0,
                  price: 0,
                  quantity: 0,
                });
              }}
            >
              Add Stock
            </Button>,
          ]}
          dataSource={stocks}
          columns={columns}
        ></ProTable>
        <ModalForm
          open={buyVisible}
          onOpenChange={setBuyVisible}
          title='Buy Stock'
          form={buyForm}
          onFinish={async (values) => {
            await modifyStock(values);
            setBuyVisible(false);
          }}
        >
          <ProFormText label='股票代码' name='code' readonly></ProFormText>
          <ProFormText label='股票名称' name={'name'} readonly></ProFormText>
          <ProFormSwitch
            label='买入/卖出'
            name='isBuy'
            initialValue={true}
            fieldProps={{
              checkedChildren: '买入',
              unCheckedChildren: '卖出',
            }}
          ></ProFormSwitch>
          <ProFormDigit
            label='股票价格'
            name={'price'}
            fieldProps={{
              min: 0,
            }}
          ></ProFormDigit>
          <ProFormDigit
            label='股数'
            name={'quantity'}
            initialValue={MIN_TRADING_QUANTITY}
            fieldProps={{
              step: MIN_TRADING_QUANTITY,
              min: MIN_TRADING_QUANTITY,
            }}
          ></ProFormDigit>
        </ModalForm>
      </Space>
    </div>
  );
};
