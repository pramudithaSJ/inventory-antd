// CustomerForm.js
import React, { useEffect, useContext, useState, useRef } from "react";
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
  Drawer,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  DollarOutlined,
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
import PrintReceiptForm from "./printReceipt";
import ReactToPrint from "react-to-print";

dayjs.locale("en"); // Set English locale

interface OrderFormProps {
  editOrderData: Order | null | undefined;
  onCloseDrawer: () => void;
}

const PaymentHistory: React.FC<OrderFormProps> = ({
  editOrderData,
  onCloseDrawer,
}) => {
  const { receipts, loading } = useContext(ReceiptContext);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [printViewOpen, setPrintViewOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<Receipt | null | undefined>();

  useEffect(() => {
    const filtered = receipts.filter(
      (receipt) => receipt.order === editOrderData?._id
    );
    setFilteredReceipts(filtered);
  }, [receipts]);

  const columns: TableColumnProps<Receipt>[] = [
    {
      title: "Receipt No",
      dataIndex: "receipt_no",
      key: "receipt_no",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text) => <a>{text.method}</a>,
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
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {
            <EyeOutlined
              onClick={() => {
                setClickedItem(record);
                setPrintViewOpen(true);
              }}
            />
          }
        </Space>
      ),
    },
  ];
  const receiptFormRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredReceipts}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
      <Drawer
        title="Print Receipt"
        open={printViewOpen}
        onClose={() => {
          setPrintViewOpen(false);
        }}
        placement="bottom"
        height="90vh"
        extra={
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => receiptFormRef.current}
            trigger={() => <Button icon={<PrinterOutlined />}>Print</Button>}
          />
        }
      >
        <PrintReceiptForm receiptData={clickedItem} ref={receiptFormRef} />
      </Drawer>
    </div>
  );
};

export default PaymentHistory;
