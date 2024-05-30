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
  Form,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { CategoryContext, Category } from "@/context/category-context";
import { Radio, Select } from "antd";

import dayjs from "dayjs";
import { CustomerContext } from "@/context/customer-context";
import { ChequeContext, Cheque } from "@/context/cheque-context";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

export default function ChequeTable() {
  const { categories, deleteCategory } = useContext(CategoryContext);
  const { cheques, isDrawerVisible, setIsDrawerVisible, chequeBanked } =
    useContext(ChequeContext);

  const { customers } = useContext(CustomerContext);
  const [searchText, setSearchText] = useState("");

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [delCategory, setDelCategory] = useState<Cheque | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [tabbedCheques, setTabbedCheques] = useState<Cheque[]>([]);
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("banked");
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const { Option } = Select;
  const [form] = Form.useForm();

  const handleDeleteConfirmation = (cheque: Cheque) => {
    setDeleteConfirmationVisible(true);
    setDelCategory(cheque);
  };

  const handleClickOk = () => {
    setDeleteConfirmationVisible(false);
  };

  const handleClickCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const showDrawer = (cheque: Cheque) => {
    if (setIsDrawerVisible && cheque.status === "pending") {
      setIsDrawerVisible(true);
      setSelectedCheque(cheque);
      form.resetFields(); 
    }
  };

  const onCloseDrawer = () => {
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (selectedCheque && selectedCheque._id) {
        console.log(selectedCheque._id);
        chequeBanked(selectedCheque._id, selectedStatus, values.remark || values.bankedBy);
        // setIsDrawerVisible(false);
      }
    });
  };

  useEffect(() => {
    const filteredCheques = cheques.filter(
      (cheque) => cheque.status === activeTab
    );
    setTabbedCheques(filteredCheques);
    console.log(filteredCheques);
  }, [activeTab]);
  const columns: TableColumnProps<Cheque>[] = [
    {
      title: "Cheque No",
      dataIndex: "cheque_no",
      key: "receipt_no",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Cheque Date",
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
      dataIndex: "amount",
      key: "amount",
      render: (text) => {
        return <span>Rs.{text}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return <span>{text}</span>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record.status === "pending" ? (
            <EyeOutlined
              onClick={() => {
                showDrawer(record);
              }}
            />
          ) : null}

          <DeleteOutlined onClick={() => handleDeleteConfirmation(record)} />
        </Space>
      ),
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
    setActiveTab(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "pending",
      label: "Pending",
    },
    {
      key: "returned",
      label: "Returned",
    },
    {
      key: "banked",
      label: "banked",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-row md:flex-row justify-between">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search Category by name"
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className=""></div>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <Table columns={columns} dataSource={tabbedCheques} />
      <Modal
        title="Delete Category"
        visible={deleteConfirmationVisible}
        onOk={handleClickOk}
        onCancel={handleClickCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

      <Drawer
        title="Cheque Details"
        onClose={onCloseDrawer}
        visible={isDrawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Banked By"
            name="bankedBy"
            rules={[
              {
                required: selectedStatus === 'banked',
                message: 'Please input the banked by!',
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              onChange={(value) => setSelectedPerson(value)}
              value={selectedPerson}
              disabled={selectedStatus !== 'banked'}
            >
              <Option value="Nuwan">Nuwan</Option>
              <Option value="Kamal">Kamal</Option>
              <Option value="Bimal">Bimal</Option>
              <Option value="Gihan">Gihan</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Remark"
            name="remark"
            rules={[
              {
                required: selectedStatus === 'returned',
                message: 'Please input the remark!',
              },
            ]}
          >
            <Input
              placeholder="Enter remark"
              disabled={selectedStatus !== 'returned'}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </Drawer>
    </div>
  );
}
