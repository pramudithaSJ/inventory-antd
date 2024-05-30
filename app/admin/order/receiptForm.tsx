// CustomerForm.js
import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  DatePicker,
  message,
} from "antd";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
import { CategoryContext } from "@/context/category-context";
import { Order, OrderContext } from "@/context/order-context";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
import FormItem from "antd/es/form/FormItem";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import { Receipt, ReceiptContext } from "@/context/receipt-context";

dayjs.locale("en"); // Set English locale

interface OrderFormProps {
  editOrderData: Order | null | undefined;
  onCloseDrawer: () => void;
}

const ReceiptForm: React.FC<OrderFormProps> = ({
  editOrderData,
  onCloseDrawer,
}) => {
  const [form] = Form.useForm();
  const [method, setMethod] = useState<string>("cash");
  const [date, setDate] = useState<string | number | Date | undefined>(
    new Date()
  );
  const [chequeDate, setChequeDate] = useState<
    string | number | Date | undefined
  >(new Date());

  const { createReceipt, receipts, loading, getReceiptsByOrderId } =
    useContext(ReceiptContext);

  const onFinish = (values: Receipt) => {
    if (editOrderData) {
      values.order = editOrderData._id;
      values.receipt_no = `R${receipts.length ?? 0 + 1}`;
      values.receipt_date = dayjs(date).toDate();
      if (method === "cheque") {
        values.payment_method = {
          method: "cheque",
          details: {
            cheque_no: values.chequeNo,
            bank: values.bank,
            date: dayjs(chequeDate).toDate(),
          },
        };
      } else if (method === "bank") {
        values.payment_method = {
          method: "bank",
          details: {
            bank: values.depositBank,
            bank_branch: values.branch,
            ref_no: values.ref_no,
          },
        };
      } else {
        values.payment_method = {
          method: "cash",
          details: {},
        };
      }

      console.log(values);
      const result = createReceipt(values);
      console.log("cercece", result);
      if (getReceiptsByOrderId) {
        getReceiptsByOrderId(editOrderData._id);
      }
    }
  };
  return (
    <div className="">
      <div className="w-full text-center my-5">
        <h2 className="text-black text-lg font-semibold">
          Receipt No : {receipts.length + 1}
        </h2>
      </div>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Date is Required" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date: any) => setDate(date)}
                value={dayjs(date).isValid() ? dayjs(date) : undefined}
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[
                { required: true, message: "Payment Method is Required" },
              ]}
            >
              <Select
                className="w-full"
                onChange={() => {
                  const method = form.getFieldValue("paymentMethod");
                  setMethod(method);
                }}
              >
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="cheque">Cheque</Select.Option>
                <Select.Option value="bank">Bank Deposit</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {method === "cheque" && (
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item
                label="Cheque No"
                name="chequeNo"
                rules={[
                  { required: true, message: "Payment Method is Required" },
                ]}
              >
                <Input className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Date"
                name="chequeDate"
                rules={[
                  { required: true, message: "Payment Method is Required" },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  onChange={(date: any) => setChequeDate(date)}
                  value={
                    dayjs(chequeDate).isValid() ? dayjs(chequeDate) : undefined
                  }
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Bank" name="bank">
                <Input className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        )}
        {method === "bank" && (
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="Bank"
                name="depositBank"
                rules={[
                  { required: true, message: "Payment Method is Required" },
                ]}
              >
                <Input className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Branch"
                name="branch"
                rules={[{ required: true, message: "Branch is Required" }]}
              >
                <Input className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ref No"
                name="branch"
                rules={[{ required: true, message: "Branch is Required" }]}
              >
                <Input className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          <Col span={12}>
            <FormItem
              label="Amount"
              name="receipt_amount"
              rules={[{ required: true, message: "Branch is Required" }]}
            >
              <InputNumber
                className="w-full"
                style={{ width: "100%" }}
                prefix="Rs."
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="Collected By"
              name="collected_by"
              rules={[{ required: true, message: "Person is Required" }]}
            >
              <Select className="w-full">
                <Select.Option value="nuwan">Nuwan</Select.Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem label="Remarks" name="remarks">
              <Input.TextArea className="w-full" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem>
              <Button htmlType="submit" className="w-full" loading={loading}>
                Submit
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default ReceiptForm;
