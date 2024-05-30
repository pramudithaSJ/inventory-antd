"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { GrnContext } from "./grn-context";
import { ItemContext } from "./item-context";
import { OrderContext } from "./order-context";
import { InvoiceContext } from "./invoice-context";
const BaseUrl = process.env.BASE_URL;

export interface Job {
  _id: string;
  job_No: string;
  name: string;
  date: Date;
  customer: {
    customerId: string;
    cNumber: string;
    cName: string;
  }; // Assuming this is the ObjectId of the customer
  item: string; // Assuming this is the ObjectId of the item
  quantity: number;
  price: number;
  total: number;
  remark?: string;
  status: string;
  created_by: string;
  order_type: string;
  delivery_type: string;
  isUrgent: boolean;
  isFast: boolean;
  additional_charges: number;
  cusId: string;
  cNumber: string;
  cName: string;
  delivery_charges: number;
  discount: number;
  paid_amount: number;
  designBy: string;
  isActive: Boolean;
}
export interface Item {
  item: string;
  quantity: number;
}

export interface wastedJob {
  _id: string;
  jobId: string;
  items: Item[];
  isAccepted: boolean;
}

interface JobContextType {
  jobs: Job[];
  wastedJobs: wastedJob[];
  loading: boolean;
  createJob: (order: Job) => void;
  updateJob: (order: Job, id: string) => void;
  deleteJob: (id: string) => void;
  activateJob: (id: string, isActive: boolean) => void;
  approveWaistedJob?: (id: string) => void;
  isDrawerVisible?: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
  isReceiptDrawerVisible?: boolean;
  setIsReceiptDrawerVisible?: (value: boolean) => void;
  isChildDrawerOpen?: boolean;
  setIsChildDrawerOpen?: (value: boolean) => void;
  getAllJobs?: () => void;
  saveJobAsWasted?: (wastedJob: wastedJob) => void;
  removeJobFromWasted?: (id: string) => void;
}
export const JobContext = createContext<JobContextType>({} as JobContextType);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [wastedJobIds, setWastedJobIds] = useState<string[]>([]);
  const [wastedJobs, setWastedJobs] = useState<wastedJob[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [isReceiptDrawerVisible, setIsReceiptDrawerVisible] =
    useState<boolean>(false);
  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState<boolean>(false);

  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { getAllOrders } = useContext(OrderContext);
  const { getAllItems } = useContext(ItemContext);
  const { getAllInvoices } = useContext(InvoiceContext);

  async function getAllJobs() {
    const res = await axios.get(`${BaseUrl}/job`);

    if (res.data.error == null) {
      setLoading(false);
      setJobs(res.data.data.result);
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  }

  useEffect(() => {
    getAllJobs();
    getWastedJobs();
  }, []);

  const createJob = (job: Job) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/job`, job)
      .then((res) => {
        if (res.data.error == null) {
          message.success(res.data.message);
          setIsDrawerVisible(false);
          getAllJobs();
          if (getAllItems) {
            getAllItems();
          }
        } else {
          message.error(res.data.error);
          setLoading(false);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const updateJob = (job: Job, id: string) => {
    setLoading(true);
    axios
      .put(`${BaseUrl}/job/${id}`, job)
      .then((res) => {
        if (res.data.error == null) {
          message.success(res.data.message);
          setIsDrawerVisible(false);

          getAllJobs();
          if (getAllItems) {
            getAllItems();
          }
        } else {
          setLoading(false);
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.message);
      });
  };

  const activateJob = (id: string, isActive: boolean) => {
    setLoading(true);
    axios
      .patch(`${BaseUrl}/job/${id}`, { isActive })
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setJobs(
            jobs.map((job) => (job._id === id ? { ...job, isActive } : job))
          );
          setLoading(false);
          if (getAllOrders) {
            getAllOrders();
          }
          if (getAllInvoices) {
            getAllInvoices();
          }

          message.success("Job activated successfully");
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const deleteJob = (id: string) => {
    setLoading(true);
    axios
      .delete(`${BaseUrl}/job/${id}`)
      .then((res) => {
        if (res.data.error == null) {
          message.success(res.data.message);
          getAllJobs();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  async function getWastedJobs() {
    try {
      const res = await axios.get(`${BaseUrl}/job/wasted`);
      if (res.data.error == null) {
        setLoading(false);
        setWastedJobs(res.data.data.result);
        console.log(res.data.data.result);
        setIsDrawerVisible(false);
      } else {
        setLoading(false);
        message.error(res.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function saveJobAsWasted(wastedJob: wastedJob) {
    setLoading(true);
    console.log(wastedJob);
    try {
      const res = await axios.post(`${BaseUrl}/job/wasted`, wastedJob);
      if (res.data.error == null) {
        console.log(res.data);
        await getWastedJobs().then(() => {
          setLoading(false);
          message.success(res.data.message);
        });
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function removeJobFromWasted(id: string) {
    setLoading(true);
    try {
      const res = await axios.delete(`${BaseUrl}/job/wasted/${id}`);
      if (res.data.error == null) {
        console.log(res.data);
        await getWastedJobs().then(() => {
          setLoading(false);
          message.success(res.data.message);
        });
      } else {
        message.error(res.data.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function approveWaistedJob(id: string) {
    setLoading(true);
    axios
      .patch(`${BaseUrl}/job/approvewasted/${id}`, { isAccepted: true })
      .then((res) => {
        if (res.data.error == null) {
          setWastedJobs(
            wastedJobs.map((job) =>
              job._id === id ? { ...job, isAccepted: true } : job
            )
          );
          setLoading(false);
          message.success("Job approved successfully");
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  }

  return (
    <JobContext.Provider
      value={{
        createJob,
        updateJob,
        deleteJob,
        jobs,
        wastedJobs,
        loading,
        isDrawerVisible,
        setIsDrawerVisible,
        getAllJobs,
        isReceiptDrawerVisible,
        setIsReceiptDrawerVisible,
        isChildDrawerOpen,
        setIsChildDrawerOpen,
        activateJob,
        saveJobAsWasted,
        removeJobFromWasted,
        approveWaistedJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
