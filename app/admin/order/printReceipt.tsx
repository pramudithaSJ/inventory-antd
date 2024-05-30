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
  Space,
  Table,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
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

dayjs.locale("en"); // Set English locale

interface ReceiptFormProps {
  receiptData: Receipt | null | undefined;
}

const PrintReceiptForm: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ReceiptFormProps
> = ({ receiptData }, ref) => {
  const { receipts, loading } = useContext(ReceiptContext);

  const columns: TableColumnProps<Receipt>[] = [
   

    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text) => <a>{text.method}</a>,
    },
    {
      title: "Payment Details",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text: any) => (
        <span>
          {text.method === "cheque" ? (
            <div>
              <span>
                <strong>Cheque No:</strong> {text.details.cheque_no}{" "}
              </span>
              <br />
              <span>
                {" "}
                <strong>Bank:</strong> {text.details.bank}{" "}
              </span>
            </div>
          ) : text.method === "bank deposit" ? (
            <div>
              <span>Bank: {text.details.bank}</span>
              <span>Branch: {text.details.branch}</span>
              <span>Reference No: {text.details.ref_no}</span>
            </div>
          ) : null}
        </span>
      ),
    },

    {
      title: "Paid Amount",
      dataIndex: "receipt_amount",
      key: "receipt_amount",
      render: (text) => <a>Rs.{text}.00</a>,
    },
    {
      title: "Created At",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const formattedDate = dayjs(text).format("DD/MM/YYYY");
        const formattedTime = dayjs(text).format("h:mm A");
        return (
          <div>
            <span>
              {formattedDate} | {formattedTime}
            </span>
          </div>
        );
      },
    },
  ];
  return (
    <div ref={ref}>
      <div className="ll w-full text-center my-10">
        <p className="text-lg">Receipt No : {receiptData?.receipt_no}</p>
      </div>
      <Table
        columns={columns}
        dataSource={receiptData ? [receiptData] : receipts}
        pagination={false}
      />
    </div>
  );
};

export default React.forwardRef(PrintReceiptForm);
