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
import { Job, JobContext, wastedJob } from "@/context/job-context";

export default function WastedJobs() {
  const { items } = useContext(ItemContext);
  const {
    jobs,
    wastedJobs,
    loading,
    deleteJob,
    isDrawerVisible,
    setIsDrawerVisible,
    isReceiptDrawerVisible,
    setIsReceiptDrawerVisible,
    isChildDrawerOpen,
    setIsChildDrawerOpen,
    activateJob,
    removeJobFromWasted,
    approveWaistedJob,
  } = useContext(JobContext);
  const { orders } = useContext(OrderContext);
  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { categories } = useContext(CategoryContext);
  const { customers } = useContext(CustomerContext);
  const { receipts, setOrderId } = useContext(ReceiptContext);

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<wastedJob[]>(wastedJobs);
  const [editJobData, setEditJobData] = useState<
    wastedJob | null | undefined
  >();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [orderToDelete, setOrderToDelete] = useState<wastedJob | null>(null);
  const [confirmActivationVisible, setConfirmActivationVisible] =
    useState(false);
  const [jobToActivate, setJobToActivate] = useState<wastedJob | null>(null);
  const [activeTab, setActiveTab] = useState("inactive");

  useEffect(() => {
    setFilteredItems(wastedJobs);
  }, [wastedJobs]);

  const handleFilter = (e: any) => {};

  const showDrawer = (job: wastedJob) => {
    setEditJobData(job);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
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

  const showDeleteConfirmation = (job: wastedJob) => {
    setOrderToDelete(job);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete?._id != null) {
      if (removeJobFromWasted) {
        removeJobFromWasted(orderToDelete._id);
      }
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const showConfirmActivationModal = (job: wastedJob) => {
    setJobToActivate(job);
    setConfirmActivationVisible(true);
  };

  const handleConfirmActivation = () => {
    if (jobToActivate) {
      if (approveWaistedJob) {
        approveWaistedJob(jobToActivate._id);
      }
      setConfirmActivationVisible(false);
    }
  };

  const handleCancelActivation = () => {
    setConfirmActivationVisible(false);
  };

  const handleActivateToggle = (job: wastedJob) => {
    setJobToActivate(job);
    showConfirmActivationModal(job);
  };
  const getItemNameById = (itemId: string) => {
    const item = items.find((item) => item._id === itemId);
    return item ? item.name : "Unknown Item";
  };

  const columns: TableColumnProps<wastedJob>[] = [
    {
      title: "Wated Type",
      dataIndex: "type",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Job Name",
      dataIndex: "jobId",
      key: "name",
      render: (jobId) => {
        const job = jobs.find((job) => job._id === jobId);
        return job ? job.name : "-";
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "name",
      render: (items) => (
        <ul>
          {items.map((item: any, index: any) => (
            <li key={index}>
              <a>{`${getItemNameById(item.item)} (Quantity: ${
                item.quantity
              })`}</a>
            </li>
          ))}
        </ul>
      ),
    },

    {
      title: "Approved",
      dataIndex: "isAccepted",
      key: "isAccepted",
      render: (isAccepted: boolean, record: wastedJob) => (
        <Switch
          checked={isAccepted}
          disabled={isAccepted}
          onChange={() => handleActivateToggle(record)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "isAccepted",
      render: (text, record) => (
        <Space size="middle">
          {/* <DollarOutlined
            onClick={() => {
              showReceiptDrawer(record);
            }}
          /> */}
          {/* <EyeOutlined /> */}
          {/* {!record.isActive && (
            <EditOutlined
              onClick={() => {
                showDrawer(record);
              }}
            />
          )} */}
          <Button
            icon={<DeleteOutlined />}
            disabled={record.isAccepted == true}
            onClick={() => showDeleteConfirmation(record)}
          ></Button>
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
              showDrawer({} as wastedJob);
            }}
          >
            New Wasted Job
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
        title={"Save job as wasted"}
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
        <p>Are you sure you want to remove this job from wasted?</p>
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
