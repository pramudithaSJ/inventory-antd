"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { GrnContext } from "./grn-context";
import { ItemContext } from "./item-context";
import { Order, OrderContext } from "./order-context";
const BaseUrl = process.env.BASE_URL;

export interface Invoice {
  _id: string;
  invoice_no: string;
  date: Date;
  order_id: Order;
  discount?: number;
  total: number;
  isCompleted?: boolean;
  paidAmount?: number;
  delivery_charges?: number;
  loading?: boolean;
  balance?: number;
}

interface InvoiceContextType {
  invoices: Invoice[];
  setInvoices?: (value: Invoice[]) => void;
  invoiceLoading: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
  isDrawerVisible?: boolean;
  getAllInvoices?: () => void;
  updateInvoice?: (values: any, id: string) => void;
  setCustomerId?: (id: string) => void;
  customerId?: string;
  payFortheInvoice?: (values: any) => void;
  customerInvoices?: Invoice[];
  setCustomerInvoices: (value: Invoice[]) => void;
  loading?: boolean;
}
export const InvoiceContext = createContext<InvoiceContextType>(
  {} as InvoiceContextType
);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>([]);
  const [invoiceLoading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { getAllItems } = useContext(ItemContext);
  const { orders, getAllOrders } = useContext(OrderContext);

  async function getAllInvoices() {
    const res = await axios.get(`${BaseUrl}/invoice`);
    if (res.data.error == null) {
      setLoading(false);
      console.log("invoices", res.data.data.result);
      setInvoices(res.data.data.result);
      if (getAllOrders) {
        getAllOrders();
      }
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  }

  useEffect(() => {
    getAllInvoices();
  }, []);

  useEffect(() => {
    if (customerId != null) {
      getInvoiceByCusId(customerId);
    }
  }, [customerId]);

  async function updateInvoice(values: any, id: string) {
    setLoading(true);
    const res = await axios.patch(`${BaseUrl}/invoice/charges/${id}`, values);
    if (res.data.error == null) {
      getAllInvoices().then(() => {
        setLoading(false);
        setIsDrawerVisible(false);
        message.success("Invoice updated successfully");
      });
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  }
  const getInvoiceByCusId = async (id: string) => {
    setLoading(true);
    const res = await axios.get(`${BaseUrl}/invoice/customer/${id}`);
    if (res.data.error == null) {
      setLoading(false);
      console.log("invoices", res.data.data.invoiceList);
      setCustomerInvoices(res.data.data.invoiceList);
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  };

  const payFortheInvoice = async (values: any) => {
    setLoading(true);
    const res = await axios.patch(`${BaseUrl}/invoice`, values);
    if (res.data.error == null) {
      message.success("Invoice paid successfully");
      getAllInvoices();
      setLoading(false);
      setIsDrawerVisible(false);
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        invoiceLoading,
        isDrawerVisible,
        setIsDrawerVisible,
        updateInvoice,
        getAllInvoices,
        setCustomerId,
        setInvoices,
        payFortheInvoice,
        customerInvoices,
        setCustomerInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
