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
} from "@ant-design/icons";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
import ItemForm from "./itemForm";
import { CategoryContext } from "@/context/category-context";
import { GrnContext } from "@/context/grn-context";

export default function ItemsTable() {
  const {
    items,
    createItem,
    deleteItem,
    loading,
    updateItem,
    isDrawerVisible,
    setIsDrawerVisible,
  } = useContext(ItemContext);
  const { isGrnUpdate, grns } = useContext(GrnContext);

  const { categories } = useContext(CategoryContext);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);

  const [editItemData, setEditItemData] = useState<Item | null | undefined>();

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  useEffect(() => {
    setFilteredItems(items);
  }, [items, isGrnUpdate, grns]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredCustomers = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filteredCustomers);
  };
  const showDrawer = (item: Item) => {
    setEditItemData(item);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditItemData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (item: Item) => {
    setItemToDelete(item);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete?._id != null) {
      deleteItem(itemToDelete._id);
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: TableColumnProps<Item>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Cost",
      dataIndex: "initial_cost",
      key: "initial_cost",
      render: (text) => <a>Rs.{text}.00</a>,
    },
    {
      title: "Cash Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <a>Rs.{text.cashPrice}.00</a>,
    },
    {
      title: "Available Quantity",
      dataIndex: "available_quantity",
      key: "available_quantity",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <EyeOutlined /> */}
          <EditOutlined onClick={() => showDrawer(record)} />
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
            placeholder="Search items by name"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Item);
            }}
          >
            Create Item
          </Button>
        </div>
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
        title={editItemData?._id != null ? "Edit Item" : "Create Item"}
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <ItemForm editItemData={editItemData} onCloseDrawer={onCloseDrawer} />
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
