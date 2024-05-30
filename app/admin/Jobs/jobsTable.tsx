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
  TabsProps,
  Tabs,
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
import { CategoryContext } from "@/context/category-context";
import { GrnContext } from "@/context/grn-context";
import { OrderContext, Order } from "@/context/order-context";
import JobForm from "./jobsForm";
import dayjs from "dayjs";
import ReceiptForm from "../order/receiptForm";
import PaymentHistory from "../order/paymentHistory";
import { ReceiptContext } from "@/context/receipt-context";
import { Job, JobContext } from "@/context/job-context";

export default function OrderTable() {
  const { items } = useContext(ItemContext);
  const {
    jobs,
    loading,
    deleteJob,
    isDrawerVisible,
    setIsDrawerVisible,
    isReceiptDrawerVisible,
    setIsReceiptDrawerVisible,
    isChildDrawerOpen,
    setIsChildDrawerOpen,
    activateJob,
  } = useContext(JobContext);
  const { orders } = useContext(OrderContext);
  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { categories } = useContext(CategoryContext);
  const { customers } = useContext(CustomerContext);
  const { receipts, setOrderId } = useContext(ReceiptContext);

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Job[]>(jobs);
  const [editJobData, setEditJobData] = useState<Job | null | undefined>();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Job | null>(null);
  const [confirmActivationVisible, setConfirmActivationVisible] =
    useState(false);
  const [jobToActivate, setJobToActivate] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState("inactive");

  const tabs: TabsProps["items"] = [
    {
      key: "inactive",
      label: "Inactive",
    },
    {
      key: "active",
      label: "Active",
    },
  ];

  useEffect(() => {
    const isActive = activeTab === "active";
    const lowercasedSearchText = searchText.toLowerCase();

    const filteredJobs = jobs.filter((job) => {
      const jobMatches = job.job_No.toLowerCase().includes(lowercasedSearchText) ||
                         job.name.toLowerCase().includes(lowercasedSearchText);
      const customer = customers.find(customer => customer._id === job.customer.customerId);
      const customerMatches = customer && customer.name.toLowerCase().includes(lowercasedSearchText);

      return job.isActive === isActive && (jobMatches || customerMatches);
    });

    setFilteredItems(filteredJobs);
  }, [jobs, activeTab, searchText, customers]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const showDrawer = (job: Job) => {
    setEditJobData(job);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const showReceiptDrawer = (job: Job) => {
    setEditJobData(job);

    if (setIsReceiptDrawerVisible) {
      if (setOrderId) {
        setOrderId(job._id);
      }
      setIsReceiptDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditJobData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
    if (setIsReceiptDrawerVisible) {
      setIsReceiptDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (job: Job) => {
    setOrderToDelete(job);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete?._id != null) {
      deleteJob(orderToDelete._id);
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const showConfirmActivationModal = (job: Job) => {
    setJobToActivate(job);
    setConfirmActivationVisible(true);
  };

  const handleConfirmActivation = () => {
    if (jobToActivate) {
      activateJob(jobToActivate._id, !jobToActivate.isActive);
      setConfirmActivationVisible(false);
    }
  };

  const handleCancelActivation = () => {
    setConfirmActivationVisible(false);
  };

  const handleActivateToggle = (job: Job) => {
    setJobToActivate(job);
    showConfirmActivationModal(job);
  };
  function getNextJobNumber(jobs: Job[]) {
    const maxJobNo = Math.max(
      ...jobs.map((job) => parseInt(job.job_No.replace("#JB", ""), 10))
    );

    // Increment the maximum job number
    const newJobNo = maxJobNo + 1;

    // Format the new job number back to the desired format
    return `#JB${newJobNo.toString().padStart(3, "0")}`;
  }
  const columns: TableColumnProps<Job>[] = [
    {
      title: "Job No",
      dataIndex: "job_No",
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
      title: "Job Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Item Name",
      dataIndex: "item",
      key: "item",
      render: (item) => (
        <span>{items.find((i) => i._id === item)?.name || "N/A"}</span>
      ),
    },
    {
      title: "No. Of Items",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Created By",
      dataIndex: "designBy",
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
      title: "Activate",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Job) => (
        <Switch
          checked={isActive}
          onChange={() => handleActivateToggle(record)}
          disabled={record.isActive === true}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "isActive",
      render: (text, record) => (
        <Space size="middle">
          {/* <DollarOutlined
            onClick={() => {
              showReceiptDrawer(record);
            }}
          /> */}
          {/* <EyeOutlined /> */}
          {!record.isActive && (
            <EditOutlined
              onClick={() => {
                showDrawer(record);
              }}
            />
          )}
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
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Job);
            }}
          >
            Create Job
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Tabs
          defaultActiveKey="1"
          items={tabs}
          onChange={(key) => {
            setActiveTab(key);
            console.log(key);
          }}
        />
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
          editJobData?._id != null
            ? "Edit Job"
            : `New Job #JB_NO-${getNextJobNumber(jobs)}`
        }
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <JobForm editJobData={editJobData} onCloseDrawer={onCloseDrawer} />
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
        {/* <PaymentHistory
          editOrderData={editJobData}
          onCloseDrawer={onCloseDrawer}
        /> */}
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
          {/* <ReceiptForm
            editOrderData={editJobData}
            onCloseDrawer={onCloseDrawer}
          /> */}
        </Drawer>
      </Drawer>

      <Modal
        title="Delete Job"
        open={deleteConfirmationVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this job?</p>
      </Modal>

      <Modal
        title="Confirm Job Activation"
        open={confirmActivationVisible}
        onOk={handleConfirmActivation}
        onCancel={handleCancelActivation}
        okButtonProps={{ style: { background: "green" } }}
      >
        <p>Are you sure you want to activate this job?</p>
      </Modal>
    </div>
  );
}
