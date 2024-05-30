"use client";
import { CustomerContext } from "@/context/customer-context";
import { Button, Col, Drawer, Form, Row, Select } from "antd";
import { useContext, useState } from "react";
import { DatePicker, Space } from "antd";
import { ReportContext } from "@/context/report-context";
import InvoiceReportTable from "./invoice-report-table";
const { RangePicker } = DatePicker;

export default function InvoiceReportByCustomer() {
  const { customers } = useContext(CustomerContext);
  const {
    getCusomterInvoices,
    invoiceLoading,
    isDrawerVisible,
    setIsDrawerVisible,
    setInvoices,
  } = useContext(ReportContext);

  const [dateType, setDateType] = useState<string>("daily");
  const [date, setDate] = useState<string | number | Date | undefined>();
  const [startDate, setStartDate] = useState<
    string | number | Date | undefined
  >();
  const [endDate, setEndDate] = useState<string | number | Date | undefined>();
  const [month, setMonth] = useState<string | number | Date | undefined>();
  const [customerId, setCustomerId] = useState<string | null | undefined>(null);

  const onFinish = (values: any) => {
    values.date = date;
    values.startDate = startDate;
    values.endDate = endDate;
    values.month = month;
    values.customerId = customerId;
    getCusomterInvoices(values);
  };

  return (
    <div className="w-full flex">
      <div className="w-1/2">
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Date Type"
                name="dateType"
                rules={[{ required: true, message: "Date Type is Required" }]}
              >
                <Select
                  placeholder="Select Date Type"
                  optionFilterProp="children"
                  onSelect={(dateType: string) => {
                    setDateType(dateType);
                    setDate(new Date());
                    setStartDate(new Date());
                    setMonth(new Date());
                    setEndDate(new Date());
                  }}
                >
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="range">Date Range</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Date"
                name="Date"
                rules={[{ required: true, message: "Date Range is Required" }]}
              >
                {dateType === "daily" && (
                  <DatePicker
                    format="YYYY-MM-DD"
                    className="w-full"
                    onChange={(date: any) => {
                      setDate(date);
                    }}
                  />
                )}
                {dateType === "range" && (
                  <RangePicker
                    format="YYYY-MM-DD"
                    className="w-full"
                    onChange={(date: any) => {
                      if (date && date.length === 2) {
                        setStartDate(date[0]);
                        setEndDate(date[1]);
                      }
                    }}
                  />
                )}
                {dateType === "monthly" && (
                  <DatePicker
                    picker="month"
                    format="YYYY-MM"
                    className="w-full"
                    onChange={(month: any) => {
                      console.log("date", month);
                      setMonth(month);
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Customer"
                name="Customer"
                rules={[{ required: true, message: "Name is Required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select customers"
                  optionFilterProp="children"
                  onSelect={(customerId: string) => {
                    console.log("customerId", customerId);
                    setCustomerId(customerId);
                  }}
                >
                  {customers.map((customer) => (
                    <Select.Option key={customer._id} value={customer._id}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button loading={invoiceLoading} htmlType="submit">
              Generate
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Drawer
        title="Invoice Report"
        placement="right"
        width={1000}
        open={isDrawerVisible}
        onClose={() => {
          if (setIsDrawerVisible) {
            setIsDrawerVisible(false);
          }
          if (setInvoices) {
            setInvoices([]);
          }
        }}
      >
        <InvoiceReportTable
          date={date}
          dateType={dateType}
          startDate={startDate}
          endDate={endDate}
          month={month}
          customerId={customerId}
        />
      </Drawer>
    </div>
  );
}
