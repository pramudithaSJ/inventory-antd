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

import { CategoryContext } from "@/context/category-context";
import { GrnContext, Grn } from "@/context/grn-context";
import GrnForm from "./grnForm";
import dayjs from "dayjs";

export default function GrnsTable() {
  const { grns, loading, isDrawerVisible, setIsDrawerVisible, deleteGrn } =
    useContext(GrnContext);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Grn[]>(grns);

  const [editItemData, setEditItemData] = useState<Grn | null | undefined>();

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<Grn | null>(null);

  useEffect(() => {
    setFilteredItems(grns);
  }, [grns]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredCustomers = grns.filter((grn) =>
      grn.grn_no.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filteredCustomers);
  };
  const showDrawer = (grn: Grn) => {
    setEditItemData(grn);
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

  const showDeleteConfirmation = (grn: Grn) => {
    setItemToDelete(grn);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete?._id != null) {
      deleteGrn(itemToDelete._id);
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: TableColumnProps<Grn>[] = [
    {
      title: "GRN No",
      dataIndex: "grn_no",
      key: "grn_no",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "",
      render: (text) => <p>{text?.length}</p>,
    },
    {
      title: "Date",
      dataIndex: "grn_date",
      key: "grn_date",
      render: (text) => <a>{dayjs(text).format("YYYY/MM/DD")}</a>,
    },
    {
      title: "Received By",
      dataIndex: "receivedBy",
      key: "receivedBy",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (text) => <p className="text-red-600">Rs.{text}.00</p>,
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EyeOutlined />
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
              showDrawer({} as Grn);
            }}
          >
            Create GRN
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
        title={editItemData?._id != null ? "Edit GRN" : "New GRN    "}
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        {/* <ItemForm editItemData={editItemData} onCloseDrawer={onCloseDrawer} /> */}
        <GrnForm editGrnData={editItemData} onCloseDrawer={onCloseDrawer} />
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
