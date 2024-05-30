"use client";
import React, { useContext, useEffect } from "react";
import CountUp from "react-countup";
import { Col, Row, Statistic } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import { OrderContext } from "@/context/order-context";
import { ReceiptContext } from "@/context/receipt-context";
import TotalStatistics from "./totalStatics";

export default function AdminDashboard() {
  const { orders, salesData } = useContext(OrderContext);
  const { receipts } = useContext(ReceiptContext);
  const formatter = (value: any) => <CountUp end={value} separator="," />;

  const totalIncome = receipts.reduce(
    (acc, rec) => acc + rec.receipt_amount,
    0
  );
  const availableIncome =
    orders && Array.isArray(orders)
      ? orders.reduce((acc, rec) => acc + rec.total, 0)
      : 0;

  return (
    <div className="lg:mx-10 mx-0 mt-10">
      <Row gutter={[16, 16]} className="my-5">
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Orders"
              value={orders && orders.length}
              valueStyle={{ color: "#13156e" }}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Income"
              value={totalIncome}
              precision={2}
              prefix={"Rs "}
              formatter={formatter}
              valueStyle={{ color: "#13156e" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Completed Orders"
              value={0}
              precision={2}
              formatter={formatter}
              valueStyle={{ color: "#13156e" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <TotalStatistics
            totalSale={availableIncome}
            totalIncome={totalIncome}
            salesData={salesData}
          />
        </Col>
      </Row>
    </div>
  );
}
