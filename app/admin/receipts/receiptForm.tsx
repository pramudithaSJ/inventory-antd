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
  Card,
  Divider,
  Table,
} from "antd";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
import { CategoryContext } from "@/context/category-context";
import { Order, OrderContext } from "@/context/order-context";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
import FormItem from "antd/es/form/FormItem";
import { Checkbox } from "antd";
import type { CheckboxProps, TableColumnProps } from "antd";
import { Receipt, ReceiptContext } from "@/context/receipt-context";
import { useColStyle } from "antd/es/grid/style";
import { InvoiceContext, Invoice } from "@/context/invoice-context";

dayjs.locale("en"); // Set English locale

interface OrderFormProps {
  editReceiptData: Receipt | null | undefined;
  onCloseDrawer: () => void;
}

const ReceiptForm: React.FC<OrderFormProps> = ({
  editReceiptData,
  onCloseDrawer,
}) => {
  const [form] = Form.useForm();
  const [method, setMethod] = useState<string>("cash");
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [date, setDate] = useState<string | number | Date | undefined>(
    new Date()
  );
  const [chequeDate, setChequeDate] = useState<
    string | number | Date | undefined
  >(new Date());
  const [orderedAmount, setOrderedAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [cusId, setCusId] = useState<string>("");
  const [olderInvoice, setOlderInvoice] = useState<Invoice[]>([]);

  const { createReceipt, receipts, loading, getReceiptsByOrderId } =
    useContext(ReceiptContext);
  const { customers } = useContext(CustomerContext);
  const {
    invoices,
    customerInvoices,
    setCustomerId,
    invoiceLoading,
    setInvoices,
    payFortheInvoice,
    setCustomerInvoices,
  } = useContext(InvoiceContext);

  const onFinish = (values: Receipt) => {
    values.receipt_no = `DS${receipts.length + 1}`;
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

    if (customerInvoices) {
      const updatedInvoices = customerInvoices.map((invoice) => ({
        inv_id: invoice._id,
        paidAmount: invoice.paidAmount ?? 0, // Use 0 if paidAmount is undefined
      }));
      console.log(updatedInvoices);
      values.invoice = updatedInvoices;
    }

    createReceipt(values);
  };
  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(
      (customer) => customer._id === customerId
    );
    if (selectedCustomer) {
      setBalanceAmount(selectedCustomer.balance);
      setOrderedAmount(selectedCustomer.orderedAmount);
      setPaidAmount(selectedCustomer.paidAmount);
    }
  };

  useEffect(() => {
    const customer = customers.find((customer) => customer._id === cusId);
    if (customer) {
      form.setFieldsValue({ walletBalance: customer.walletBalance });
    }
  }, [cusId]);
  useEffect(() => {
    if (editReceiptData != null) {
      let oldInvoiceList = [];
      for (let i = 0; i < editReceiptData.invoice.length; i++) {
        const invoice = invoices.find(
          (inv) => inv._id === editReceiptData.invoice[i].inv_id
        );
        if (invoice) {
          oldInvoiceList.push(invoice);
        }
      }
      setOlderInvoice(oldInvoiceList);

      if (setCustomerId) {
        setCustomerId(editReceiptData.customer);
      }
      if (editReceiptData.payment_method?.method === "cheque") {
        setMethod("cheque");
      }
      if (editReceiptData.payment_method?.method === "bank") {
        setMethod("bank");
      }

      const formData = {
        ...editReceiptData,
        date: dayjs(editReceiptData?.receipt_date),
        paymentMethod: editReceiptData?.payment_method?.method,
        // @ts-ignore
        chequeDate: dayjs(editReceiptData.payment_method?.details?.date),
        // @ts-ignore
        bank: editReceiptData.payment_method?.details?.bank,
        // @ts-ignore
        chequeNo: editReceiptData.payment_method?.details?.cheque_no,
        // @ts-ignore
        depositBank: editReceiptData?.payment_method?.details?.bank,
        // @ts-ignore
        branch: editReceiptData.payment_method?.details?.bank_branch,
        // @ts-ignore
        ref_no: editReceiptData.payment_method?.details?.ref_no,
      };
      form.setFieldsValue(formData);
    }
  }, [editReceiptData, form]);
  const columns: TableColumnProps<Invoice>[] = [
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
      key: "invoice_no",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Original Amount",
      dataIndex: "total",
      key: "total",
      render: (text) => <a>Rs.{text}</a>,
    },
    {
      title: "Paid Amount",
      dataIndex: "_id",
      key: "paidAmount",
      render: (text) => {
        const invoice =
          customerInvoices && customerInvoices.find((inv) => inv._id === text);
        return <a>Rs.{(invoice?.total ?? 0) - (invoice?.balance ?? 0)}</a>;
      },
    },

    {
      title: "Open Balance",
      dataIndex: "balance",
      key: "balance",
      render: (text) => {
        return <a>Rs.{text}</a>;
      },
    },
    {
      title: "Payment",
      dataIndex: "_id",
      key: "paidAmount",
      render: (text) => {
        const invoice =
          customerInvoices && customerInvoices.find((inv) => inv._id === text);
        return <a>Rs.{invoice?.paidAmount ?? 0}</a>;
      },
    },
  ];

  const oldColumns: TableColumnProps<Invoice>[] = [
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
      key: "invoice_no",
      render: (text) => {
        return <a>{text}</a>;
      },
    },
    {
      title: "Original Amount",
      dataIndex: "total",
      key: "total",
      render: (text) => {
        return <a>{text}</a>;
      },
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (text) => {
        return <a>{text}</a>;
      },
    },
  ];
  const rowSelection = {
    // onChange: (selectedRowKeys: React.Key[], selectedRows: Invoice[]) => {
    //   console.log(
    //     `selectedRowKeys: ${selectedRowKeys}`,
    //     "selectedRows: ",
    //     selectedRows
    //   );
    // },
  };

  async function devideAmount() {
    let payingAmount = form.getFieldValue("receipt_amount");
    if (customerInvoices) {
      let updatedInvoices = [...customerInvoices];
      let remainingBalance = 0; // To track remaining balance after paying all invoices
      for (let i = 0; i < updatedInvoices.length; i++) {
        const invoice = updatedInvoices[i];
        const openBalance = (invoice?.total ?? 0) - (invoice?.paidAmount ?? 0);
        if (payingAmount >= (updatedInvoices[i]?.balance ?? 0)) {
          updatedInvoices[i].paidAmount = updatedInvoices[i].balance;
          payingAmount -= updatedInvoices[i]?.balance ?? 0;
        } else {
          updatedInvoices[i].paidAmount = payingAmount;
          payingAmount = 0;
        }
      }
      if (payingAmount > 0) {
        // If there is remaining balance after paying all invoices
        remainingBalance += payingAmount;
      }
      if (remainingBalance >= 0) {
        form.setFieldsValue({ walletBalance: remainingBalance });
      }

      if (setCustomerInvoices) {
        setCustomerInvoices(updatedInvoices);
      }
    } // Create a copy of invoices array
  }

  useEffect(() => {
    devideAmount();
  }, [payingAmount]);
  return (
    <div className="">
      <div className="w-full text-center my-2">
        {editReceiptData ? (
          <h2 className="text-black text-lg font-semibold mb-10">
            Edit Receipt No : {editReceiptData.receipt_no}
          </h2>
        ) : (
          <h2 className="text-black text-lg font-semibold mb-5">
            Receipt No : {receipts.length + 1}
          </h2>
        )}
      </div>
      <Form form={form} onFinish={onFinish} className="mt-2">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Customer"
              name="customer"
              rules={[{ required: true, message: "Customer is Required" }]}
            >
              <Select
                showSearch
                placeholder="Select customers"
                optionFilterProp="children"
                onSelect={(customerId: string) => {
                  handleCustomerSelect(customerId);
                  if (setCustomerId) {
                    setCustomerId(customerId);
                    setCusId(customerId);
                  }
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
          <Col span={12}>
            <FormItem label="Wallet Amount" name="walletBalance">
              <InputNumber
                className="w-full"
                style={{ width: "100%" }}
                prefix="Rs."
                value={orderedAmount}
                disabled
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Divider orientation="left"> Payment Details</Divider>

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
                name="ref_no"
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
              rules={[{ required: true, message: "please enter a value" }]}
            >
              <InputNumber
                className="w-full"
                style={{ width: "100%" }}
                prefix="Rs."
                min={0}
                onKeyUp={() => {
                  setPayingAmount(form.getFieldValue("receipt_amount"));
                }}
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
                <Select.Option value="cashier">Cashier</Select.Option>

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
        {editReceiptData == null ? (
          <Row gutter={24}>
            <Divider orientation="left"> Invoice List</Divider>
            <Table
              dataSource={customerInvoices}
              columns={columns}
              className="w-full"
              loading={invoiceLoading}
            />
          </Row>
        ) : (
          <Row gutter={24}>
            <Divider orientation="left"> Invoice List</Divider>
            <Table
              dataSource={olderInvoice}
              columns={oldColumns}
              className="w-full"
              loading={invoiceLoading}
            />
          </Row>
        )}

        {editReceiptData == null ? (
          <Row gutter={24}>
            <Col span={24}>
              <Divider orientation="left">Balance Amount</Divider>
              <FormItem label="Customer wallet balance" name="walletBalance">
                <InputNumber
                  className="w-full"
                  style={{ width: "100%" }}
                  prefix="Rs."
                  value={balanceAmount}
                  disabled
                />
              </FormItem>
            </Col>
          </Row>
        ) : null}

        <Row gutter={24}>
          <Col span={24}>
            <FormItem>
              {editReceiptData ? null : (
                <Button
                  htmlType="submit"
                  className="w-1/2 "
                  loading={loading}
                  disabled={customerInvoices?.length === 0}
                >
                  Submit
                </Button>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default ReceiptForm;
