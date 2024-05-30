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
import { Invoice, InvoiceContext } from "@/context/invoice-context";

dayjs.locale("en"); // Set English locale

interface InvoiceFormProps {
  editInvoiceData: Invoice | null | undefined;
  onCloseDrawer: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  editInvoiceData,
  onCloseDrawer,
}) => {
  const { items } = useContext(ItemContext);
  const { orders, createOrder, updateOrder } = useContext(OrderContext);
  const { invoices, loading, updateInvoice , invoiceLoading} = useContext(InvoiceContext);
  const [date, setDate] = useState<string | number | Date | undefined>(
    new Date()
  );

  const { categories } = useContext(CategoryContext);
  const { customers } = useContext(CustomerContext);
  const [form] = Form.useForm();

  const [netTotal, setNetTotal] = useState<number | undefined>(
    editInvoiceData?.order_id?.total
  );

  const onDiscountChange = (e: any) => {
    if (editInvoiceData) {
      const GrandTotal = editInvoiceData?.order_id?.total - e.target.value;
      form.setFieldValue("net_total", GrandTotal);
      setNetTotal(GrandTotal);
    }
  };

  const onDeliveryChargesChange = (e: any) => {
    if (editInvoiceData) {
      e.preventDefault();
      e.target.value = e.target.value === "" ? 0 : e.target.value;
      const GrandTotal =
        editInvoiceData?.order_id?.total + parseInt(e.target.value);

      form.setFieldValue("net_total", GrandTotal);
      setNetTotal(GrandTotal);
    }
  };

  useEffect(() => {
    console.log("editInvoiceData", editInvoiceData);
    if (editInvoiceData) {
      form.setFieldsValue(editInvoiceData);
      console.log(editInvoiceData.order_id);

      const customer = customers.find(
        (customer) =>
          customer._id === editInvoiceData.order_id.customer.customerId
      );

      const formData = {
        ...editInvoiceData,
        date: dayjs(editInvoiceData.date),
        net_total: editInvoiceData.order_id.total?? 0 - editInvoiceData.order_id.discount?? 0 + editInvoiceData.order_id.delivery_charges?? 0 + editInvoiceData.order_id.additional_charges?? 0,
        customer: customer?.name,
        delivery_charges: editInvoiceData.order_id.delivery_charges,
        additional_charges: editInvoiceData.order_id.additional_charges,
      };
      form.setFieldsValue(formData);
      const orderDate = new Date(editInvoiceData.date);
      setDate(orderDate);
    }
  }, [editInvoiceData]);
  const columns: TableColumnProps<Invoice>[] = [
    {
      title: "Order No",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        return <a>{text.order_No}</a>;
      },
    },
    {
      title: "Item Name",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        const item = items.find((item) => item._id === text.item);
        return <a>{item?.name}</a>;
      },
    },
    {
      title: "Item Quantity",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        return <a>{text.quantity}</a>;
      },
    },
    {
      title: "Price",
      dataIndex: "order_id",
      key: "item_price",
      render: (text) => {
        return <a>{text.total / text.quantity}</a>;
      },
    },
    {
      title: "Amount",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        return <a>Rs.{text.price}.00</a>;
      },
    },
  ];

  const onFinish = (values: any) => {
    console.log("Success:", values, editInvoiceData?._id);
    if (editInvoiceData?._id != null) {
      if (values && updateInvoice) {
        updateInvoice(values, editInvoiceData._id);
      }
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Invoice No"
            name="invoice_no"
            rules={[{ required: true, message: "Order No is required" }]}
          >
            <Input disabled={true} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
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
              disabled={true}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <FormItem label="Customer Name" name="customer">
            <Input disabled={true} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={24}>
          <Table
            dataSource={editInvoiceData ? [editInvoiceData] : []}
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item
            label="Delivery Charges"
            className="my-2"
            name="delivery_charges"
          >
            <Input
              prefix="Rs."
              onKeyUp={(e: any) => {
                onDeliveryChargesChange(e);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item
            label="Additional Charges"
            className="my-2"
            name="additional_charges"
          >
            <Input prefix="Rs." disabled={true} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item label="Discount" className="my-2" name="discount">
            <Input prefix="Rs." />
          </Form.Item>
        </Col>
      </Row>

      {/* <Row gutter={20}>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item label="Grand Total" className="my-2" name="net_total">
            <Input prefix="Rs." disabled={true} />
          </Form.Item>
        </Col>
      </Row> */}
      <Row>
        <Col span={24}>
          <Form.Item>
            <Button
              loading={invoiceLoading}
              htmlType="submit"
              className="w-full my-2"
              disabled={!!netTotal && netTotal <= 0}
            >
              {editInvoiceData?._id != null ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
