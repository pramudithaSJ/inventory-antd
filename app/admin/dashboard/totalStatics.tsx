import React from "react";
import { Statistic, Row, Col, Card, Typography } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
interface TotalStatisticsProps {
  totalSale: number;
  totalIncome: number;
  salesData: any;
}
const TotalStatistics: React.FC<TotalStatisticsProps> = ({
  totalSale,
  totalIncome,
  salesData,
}) => {
  return (
    <Card>
      <Typography.Title level={3}>Sales Over Month</Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <LineChart
            width={600}
            height={300}
            data={salesData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#f5f5f5" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#13156e"
              yAxisId={0}
            />
          </LineChart>
        </Col>
      </Row>
    </Card>
  );
};

export default TotalStatistics;
