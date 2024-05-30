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
  DollarOutlined,
} from "@ant-design/icons";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
// import ItemForm from "./itemForm";
import { CategoryContext } from "@/context/category-context";
import { GrnContext } from "@/context/grn-context";
import { OrderContext, Order } from "@/context/order-context";

import dayjs from "dayjs";
import ReceiptForm from "./receiptForm";
import PaymentHistory from "./paymentHistory";
import { ReceiptContext } from "@/context/receipt-context";
import OrderForm from "./orderForm"

export default function OrderTable() {
  const { items } = useContext(ItemContext);
  const {
    orders,
    loading,
    deleteOrder,
    isDrawerVisible,
    setIsDrawerVisible,
    isReceiptDrawerVisible,
    setIsReceiptDrawerVisible,
    isChildDrawerOpen,
    setIsChildDrawerOpen,
  } = useContext(OrderContext);
  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { categories } = useContext(CategoryContext);
  const { customers } = useContext(CustomerContext);
  const { receipts, setOrderId } = useContext(ReceiptContext);

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Order[]>(orders);

  const [editOrderData, setEditOrderData] = useState<
    Order | null | undefined
  >();

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  useEffect(() => {
    setFilteredItems(orders);
  }, [orders]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);

    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );
    const customerIds = filteredCustomers.map((customer) => customer._id);

    const filteredOrders = orders.filter((order) =>
      customerIds.includes(order.customer.customerId)
    );
    setFilteredItems(filteredOrders);
  };
  const showDrawer = (order: Order) => {
    console.log("orders are",order);
    
    setEditOrderData(order);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const showReceiptDrawer = (order: Order) => {
    setEditOrderData(order);

    if (setIsReceiptDrawerVisible) {
      if (setOrderId) {
        setOrderId(order._id);
      }
      setIsReceiptDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditOrderData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
    if (setIsReceiptDrawerVisible) {
      setIsReceiptDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (order: Order) => {
    setOrderToDelete(order);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete?._id != null) {
      deleteOrder(orderToDelete._id);
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: TableColumnProps<Order>[] = [
    {
      title: "Order No",
      dataIndex: "order_No",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => {
        const customerData = customers.find(
          (c) => c._id === customer.customerId
        );
        return <span>{customerData ? customerData.name : "N/A"}</span>;
      },
    },

    {
      title: "Order Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Grand Total",
      dataIndex: "_id",
      key: "total",
      render: (text) => {
        const order = orders.find((order) => order._id === text);
        const total = (order?.total ?? 0) - (order?.discount ?? 0);
        return <a>Rs.{total}.00</a>;
      },
    },

    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
      render: (text) => <a>{text}</a>,
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
          {/* <DollarOutlined
            onClick={() => {
              showReceiptDrawer(record);
            }}
          /> */}
          {/* <EyeOutlined /> */}
          <EditOutlined
            onClick={() => {
              showDrawer(record);
            }}
          />
          <DeleteOutlined onClick={() => showDeleteConfirmation(record)} />
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <div className="flex flex-row md:flex-row justify-between">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search items by customer"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        {/* <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Order);
            }}
          >
            Create Order
          </Button>
        </div> */}
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
          editOrderData?._id != null
            ? "Edit Order"
            : `New Order  #${orders.length + 1}`
        }
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <OrderForm
          editOrderData={editOrderData}
          onCloseDrawer={onCloseDrawer}
        />
      </Drawer>
      <Drawer
        title="Payment History"
        width={700}
        onClose={onCloseDrawer}
        open={isReceiptDrawerVisible}
        destroyOnClose={true}
        extra={
          <Button
            onClick={() => {
              if (setIsChildDrawerOpen) {
                setIsChildDrawerOpen(true);
              }
            }}
          >
            New Receipt
          </Button>
        }
      >
        <PaymentHistory
          editOrderData={editOrderData}
          onCloseDrawer={onCloseDrawer}
        />
        <Drawer
          title="Make Payment"
          width={700}
          onClose={() => {
            if (setIsChildDrawerOpen) {
              setIsChildDrawerOpen(false);
            }
          }}
          open={isChildDrawerOpen}
          destroyOnClose={true}
        >
          <ReceiptForm
            editOrderData={editOrderData}
            onCloseDrawer={onCloseDrawer}
          />
        </Drawer>
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
