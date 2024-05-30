"use client"; //UserForm.js
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
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { UserContext, User } from "@/context/user-context";
import UserForm from "./routeForm";
import { Route, RouteContext } from "@/context/route-context";

export default function RouteTable() {
  const {
    routes,
    createRoute,
    updateRoute,
    loading,
    isDrawerVisible,
    setIsDrawerVisible,
    deleteRoute,
  } = useContext(RouteContext);

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Route[]>(routes);
  const [editRouteData, setEditRouteData] = useState<Route | null>(null);

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

  useEffect(() => {
    setFilteredItems(routes);
  }, [routes]);

  const showDrawer = (route: Route) => {
    setEditRouteData(route);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditRouteData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (route: Route) => {
    setRouteToDelete(route);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (routeToDelete) {
      deleteRoute(routeToDelete._id); // Assuming _id is the unique identifier for the customer
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: TableColumnProps<Route>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "email",
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
            placeholder="Search by name"
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Route);
            }}
          >
            Create Route
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
        title={editRouteData?._id != null ? "Edit Route" : "Create Route"}
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <UserForm editRouteData={editRouteData} onCloseDrawer={onCloseDrawer} />
      </Drawer>

      <Modal
        title="Delete User"
        open={deleteConfirmationVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
}
