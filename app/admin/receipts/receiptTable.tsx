"use client";
import React, { useContext, useState, useEffect } from "react";
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
} from "@ant-design/icons";
import { CategoryContext, Category } from "@/context/category-context";
import { ReceiptContext, Receipt } from "@/context/receipt-context";
import ReceiptForm from "./receiptForm";
import dayjs from "dayjs";
import { CustomerContext } from "@/context/customer-context";
import { InvoiceContext } from "@/context/invoice-context";

export default function ReceiptTable() {
  const { categories, deleteCategory } = useContext(CategoryContext);
  const { loading, receipts, isDrawerVisible, setDrawerVisible } =
    useContext(ReceiptContext);

  const { setInvoices, setCustomerInvoices } = useContext(InvoiceContext);

  const { customers } = useContext(CustomerContext);
  const [searchText, setSearchText] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Receipt[]>();

  const [editCategoryData, setEditCategoryData] = useState<
    Receipt | null | undefined
  >(undefined);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [delCategory, setDelCategory] = useState<Receipt | null>(null);

  useEffect(() => {
    setFilteredCategories(receipts);
  }, [receipts]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") {
      setFilteredCategories(receipts);
    } else {
      const filteredData = receipts?.filter((item) => {
        return (
          item.receipt_no.toLowerCase().includes(lowercasedValue) ||
          customers
            .find((cus) => cus._id === item.customer)
            ?.name.toLowerCase()
            .includes(lowercasedValue) ||
          item.receipt_amount
            .toString()
            .toLowerCase()
            .includes(lowercasedValue) ||
          item.payment_method.method.toLowerCase().includes(lowercasedValue) ||
          dayjs(item.receipt_date)
            .format("DD/MM/YYYY")
            .toLowerCase()
            .includes(lowercasedValue)
        );
      });
      setFilteredCategories(filteredData);
    }
  };
  const showDrawer = (receipt: Receipt) => {
    setEditCategoryData(receipt);
    if (setDrawerVisible) {
      setDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditCategoryData(null);
    if (setDrawerVisible) {
      setDrawerVisible(false);
      if (setCustomerInvoices) {
        setCustomerInvoices([]);
      }
    }
  };

  const handleDeleteConfirmation = (receipt: Receipt) => {
    setDeleteConfirmationVisible(true);
    setDelCategory(receipt);
  };

  const handleClickOk = () => {
    if (delCategory) {
      deleteCategory(delCategory._id);
    }
    setDeleteConfirmationVisible(false);
  };

  const handleClickCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: TableColumnProps<Receipt>[] = [
    {
      title: "Receipt No",
      dataIndex: "receipt_no",
      key: "receipt_no",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Receipt Date",
      dataIndex: "receipt_date",
      key: "date",
      render: (text) => {
        const formattedDate = dayjs(text).format("DD/MM/YYYY");
        const formattedTime = dayjs(text).format("h:mm A");
        return (
          <div>
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text) => {
        const customer = customers.find((cus) => cus._id === text);
        return <span>{customer?.name}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "receipt_amount",
      key: "amount",
      render: (text) => {
        return <span>Rs.{text}</span>;
      },
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "method",
      render: (text) => {
        return <span>{text?.method}</span>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EyeOutlined
            onClick={() => {
              showDrawer(record);
            }}
          />
          {/* <EditOutlined onClick={() => showDrawer(record)} /> */}
          <DeleteOutlined onClick={() => handleDeleteConfirmation(record)} />
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <div className="flex flex-row md:flex-row justify-between">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search Category by name"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setEditCategoryData(null);
              if (setDrawerVisible) {
                setDrawerVisible(true);
              }
            }}
          >
            Create Receipt
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCategories}
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ height: "100vh" }}
      />
      <Drawer
        title={
          editCategoryData?._id != null
            ? "Receipt Details"
            : "Create New Receipt"
        }
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <ReceiptForm
          editReceiptData={editCategoryData}
          onCloseDrawer={onCloseDrawer}
        />
      </Drawer>

      <Modal
        title="Delete Category"
        open={deleteConfirmationVisible}
        onOk={handleClickOk}
        onCancel={handleClickCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </div>
  );
}
