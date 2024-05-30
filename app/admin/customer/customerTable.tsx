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
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { CustomerContext, Customer } from "@/context/customer-context";
import CustomerForm from "./customerForm";

export default function CustomerTable() {
  const {
    customers,
    loading,
    deleteCustomer,
    isDrawerVisible,
    setIsDrawerVisible,
  } = useContext(CustomerContext);
  const [searchText, setSearchText] = useState("");
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(customers);

  const [editCustomerData, setEditCustomerData] = useState<
    Customer | null | undefined
  >();

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredCustomers = customers.filter((customer) =>
      customer.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filteredCustomers);
  };
  const showDrawer = (customer: Customer) => {
    setEditCustomerData(customer);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditCustomerData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete._id); // Assuming _id is the unique identifier for the customer
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: TableColumnProps<Customer>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Contact Person",
      dataIndex: "cPerson",
      key: "cPerson",
    },
    {
      title: "Contact Person Mobile No",
      dataIndex: "cMobileNo",
      key: "cMobileNo",
    },

    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
      key: "creditLimit",
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
            placeholder="Search customer by name"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Customer);
            }}
          >
            Create Customer
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </div>
      <Drawer
        title={
          editCustomerData?._id != null ? "Edit Customer" : "Create Customer"
        }
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <CustomerForm
          editCustomerData={editCustomerData}
          onCloseDrawer={onCloseDrawer}
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
