"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Input,
  Space,
  Switch,
  TableColumnProps,
  Button,
  Drawer,
  Modal,
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
// import ItemForm from "./itemForm";
import { CategoryContext } from "@/context/category-context";
import { GrnContext } from "@/context/grn-context";
import { OrderContext, Order } from "@/context/order-context";
import OrderForm from "./invoiceForm";
import dayjs from "dayjs";
import { InvoiceContext, Invoice } from "@/context/invoice-context";
import PrintInvoiceForm from "./printInvoice";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { JobContext } from "@/context/job-context";

export default function InvoiceTable() {
  const { items } = useContext(ItemContext);
  const { orders } = useContext(OrderContext);
  const { jobs } = useContext(JobContext);
  const { invoices, loading, isDrawerVisible, setIsDrawerVisible } =
    useContext(InvoiceContext);

  console.log("invoices", invoices);

  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { categories } = useContext(CategoryContext);
  const { customers } = useContext(CustomerContext);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Invoice[]>(invoices);
  const [isPrintDrawerVisible, setIsPrintDrawerVisible] = useState(false);

  const [editInvoiceData, setEditInvoiceData] = useState<
    Invoice | null | undefined
  >();

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  useEffect(() => {
    setFilteredItems(invoices);
    console.log("invoices", invoices);
  }, [invoices]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") {
      setFilteredItems(invoices);
    } else {
      const filteredData = invoices?.filter((item) => {
        return (
          item.invoice_no.toLowerCase().includes(lowercasedValue) ||
          customers
            .find((cus) => cus._id === item.order_id?.customer?.customerId)
            ?.name.toLowerCase()
            .includes(lowercasedValue)
        );
      });
      setFilteredItems(filteredData);
    }
  };
  const showDrawer = (invoice: Invoice) => {
    setEditInvoiceData(invoice);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditInvoiceData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (invoiceToDelete?._id != null) {
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };
  const invoiceFormRef = useRef<HTMLDivElement>(null);

  const columns: TableColumnProps<Invoice>[] = [
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
      key: "invoice_no",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Customer Name",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        const customer = customers.find(
          (customer) => customer?._id === text?.customer?.customerId
        );
        return <a>{customer?.name}</a>;
      },
    },
    {
      title: "Job No",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        const order = orders.find((order) => order?._id === text?._id);
        const job = jobs.find((job) => job?._id === order?.job_id);

        return <a>{job?.job_No}</a>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "order_id",
      key: "total_amount",
      render: (text) => {
        return (
          <a>
            Rs.
            {(text?.total ?? 0) -
              (text?.discount ?? 0) +
              (text?.delivery_charges ?? 0)}
            .00
          </a>
        );
      },
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
          <EyeOutlined
            onClick={() => {
              setIsPrintDrawerVisible(true);
              setEditInvoiceData(record);
            }}
          />
          <EditOutlined
            onClick={() => {
              showDrawer(record);
            }}
          />
          {/* <DeleteOutlined onClick={() => showDeleteConfirmation(record)} /> */}
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <div className="flex flex-row md:flex-row justify-between">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search items by name"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className=""></div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredItems}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </div>
      <Drawer
        title={
          editInvoiceData?._id != null
            ? "Update Invoice"
            : `New Order  #${invoices.length + 1}`
        }
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <OrderForm
          editInvoiceData={editInvoiceData}
          onCloseDrawer={onCloseDrawer}
        />
      </Drawer>
      <Drawer
        title="Print Invoice"
        open={isPrintDrawerVisible}
        placement="bottom"
        height="90vh"
        onClose={() => {
          setIsPrintDrawerVisible(false);
        }}
        extra={
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => invoiceFormRef.current}
            trigger={() => <Button icon={<PrinterOutlined />}>Print</Button>}
            pageStyle={
              "@page {size: 22.5cm 14cm; margin: 0mm;} @media print {body {transform: scale(0.85);page-break-after: avoid;}}"
            }
          />
        }
      >
        <PrintInvoiceForm
          onCloseDrawer={() => {
            setIsPrintDrawerVisible(false);
          }}
          editInvoiceData={editInvoiceData}
          ref={invoiceFormRef}
        />
      </Drawer>

      <Modal
        title="Delete Customer"
        open={deleteConfirmationVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
    </div>
  );
}
