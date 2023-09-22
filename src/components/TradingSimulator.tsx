import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Statistic,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

// 交易费率
const TRADING_FEE = 0.0003;
// 印花税
const STAMP_TAX = 0.001;
// 最低交易费用
const MIN_TRADING_FEE = 5;
// 最小交易股数
const MIN_TRADING_QUANTITY = 100;

export const TradingForm = () => {
  return (
    <Card title='交易'>
      <Form layout='vertical'>
        <Form.Item label='股票信息'>
          <Input readOnly></Input>
        </Form.Item>
        <Form.Item label='买入/卖出'>
          <Input></Input>
        </Form.Item>
        <Form.Item label='金额'>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item label='股数'>
          <InputNumber
            min={MIN_TRADING_QUANTITY}
            step={MIN_TRADING_QUANTITY}
            defaultValue={MIN_TRADING_QUANTITY}
          ></InputNumber>
        </Form.Item>
        <Form.Item>
          <Button>提交</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export const TradingSimulator = () => {
  // 股票列表
  const [stockList, setStockList] = useState<Stock.Info[]>([
    {
      name: '腾讯控股',
      code: '00700',
      quantity: 100,
      cost: 100,
      currentPrice: 100,
      profit: 100,
      profitRate: 100,
    },
  ]);

  const columns: ColumnsType<Stock.Info> = [
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
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
      render: (text, record) => {
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
      render: (text, record) => {
        return (
          <Space>
            <Button type='primary'>Buy</Button>
            <Button danger>Sell</Button>
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

        <Table<Stock.Info> dataSource={stockList} columns={columns}></Table>
      </Space>
    </div>
  );
};
