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
  loading?: boolean;
  balance?: number;
}

interface ReportContextType {
  invoices: Invoice[];
  setInvoices?: (value: Invoice[]) => void;
  invoiceLoading: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
  isDrawerVisible?: boolean;
  setCustomerId?: (id: string) => void;
  customerId?: string;
  payFortheInvoice?: (values: any) => void;
  customerInvoices?: Invoice[];
  setCustomerInvoices: (value: Invoice[]) => void;
  loading?: boolean;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  getCusomterInvoices: (values: any) => void;
}
export const ReportContext = createContext<ReportContextType>(
  {} as ReportContextType
);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>([]);
  const [invoiceLoading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string | null | undefined>(null);
  const [activeTab, setActiveTab] = useState("customer");

  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { getAllItems } = useContext(ItemContext);
  const { orders, getAllOrders } = useContext(OrderContext);

  async function getCusomterInvoices(values: any) {
    try {
      console.log(values);
      setLoading(true);
      await axios
        .post(`${BaseUrl}/report`, {
          customerId: values.customerId,
          startDate: values.startDate,
          endDate: values.endDate,
          dateType: values.dateType,
          month: values.month,
          date: values.date,
        })
        .then((response) => {
          if (response.data.data.invoices.length === 0) {
            message.error("No invoices found");
          }
          setInvoices(response.data.data.invoices);
        })
        .finally(() => {
          setLoading(false);
        });

      // setCustomerInvoices(response.data);
    } catch (error) {
      message.error("Failed to get invoices");
      setLoading(false);
    }
  }
  useEffect(() => {
    if (invoices.length > 0) {
      setIsDrawerVisible(true);
    }
  }, [invoices]);

  return (
    <ReportContext.Provider
      value={{
        invoices,
        invoiceLoading,
        isDrawerVisible,
        setIsDrawerVisible,
        setCustomerId,
        setInvoices,
        customerInvoices,
        setCustomerInvoices,
        activeTab,
        setActiveTab,
        getCusomterInvoices,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
