"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { GrnContext } from "./grn-context";
import { ItemContext } from "./item-context";
import { InvoiceContext } from "./invoice-context";
import { JobContext } from "./job-context";
const BaseUrl = process.env.BASE_URL;

export interface Order {
  total_amount: number;
  _id: string;
  order_No: string;
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
  job_id: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (order: Order) => void;
  updateOrder: (order: Order, id: string) => void;
  deleteOrder: (id: string) => void;
  isDrawerVisible?: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
  isReceiptDrawerVisible?: boolean;
  setIsReceiptDrawerVisible?: (value: boolean) => void;
  isChildDrawerOpen?: boolean;
  setIsChildDrawerOpen?: (value: boolean) => void;
  getAllOrders?: () => void;
  salesData?: any[];
}
export const OrderContext = createContext<OrderContextType>(
  {} as OrderContextType
);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [isReceiptDrawerVisible, setIsReceiptDrawerVisible] =
    useState<boolean>(false);
  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<any[]>([]);

  const { isGrnUpdate, grns } = useContext(GrnContext);
  const { getAllItems } = useContext(ItemContext);
  const { getAllInvoices } = useContext(InvoiceContext);
  const {jobs} = useContext(JobContext)
  

  function generateSalesData(orders: Order[]) {
    // Initialize an object to store sales data for each month
    const monthlySales: { [key: string]: number } = {};

    // Loop through orders and aggregate sales data for each month
    orders && orders.forEach((order) => {
      // Rest of the code remains the same
      const date = new Date(order.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      // Generate a key in the format "YYYY-MM" to represent the month and year
      const key = `${year}-${month < 9 ? "0" : ""}${month + 1}`;

      // Initialize sales for the month if it doesn't exist
      if (!monthlySales[key]) {
        monthlySales[key] = 0;
      }

      // Add order sales amount to the corresponding month
      monthlySales[key] += order.total;
    });

    // Convert monthly sales object to an array of objects
    const salesData = Object.keys(monthlySales).map((key) => ({
      name: key, // Use month and year as name
      sales: monthlySales[key as keyof typeof monthlySales], // Total sales amount for the month
    }));

    // Sort sales data by name (month and year)
    salesData.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return salesData;
  }

  async function getAllOrders() {
    setLoading(true);
    const res = await axios.get(`${BaseUrl}/order`);
    if (res.data.error == null) {
      setLoading(false);
      console.log("res.data.data.data", res.data.data.result);
      setOrders(res.data.data.result);
      const salesData = generateSalesData(res.data.data.result);
      setSalesData(salesData);
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  const createOrder = (order: Order) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/order`, order)
      .then((res) => {
        if (res.data.error == null) {
          message.success(res.data.message);
          setIsDrawerVisible(false);
          getAllOrders();
          if (getAllItems) {
            getAllItems();
          }
          if (getAllInvoices) {
            getAllInvoices();
          }
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const updateOrder = (order: Order, id: string) => {
    console.log("order id is :",id);
    
    setLoading(true);
    axios
      .put(`${BaseUrl}/order/${id}`, order)
      .then((res) => {
        if (res.data.error == null) {
          message.success(res.data.message);
          setIsDrawerVisible(false);
          getAllOrders();
          if (getAllItems) {
            getAllItems();
          }
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const deleteOrder = (id: string) => {
    setLoading(true);
    axios
      .delete(`${BaseUrl}/order/${id}`)
      .then((res) => {
        if (res.data.error == null) {
          message.success(res.data.message);
          getAllOrders();
          if (getAllItems) {
            getAllItems();
          }
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <OrderContext.Provider
      value={{
        createOrder,
        updateOrder,
        deleteOrder,
        orders,
        loading,
        isDrawerVisible,
        setIsDrawerVisible,
        getAllOrders,
        isReceiptDrawerVisible,
        setIsReceiptDrawerVisible,
        isChildDrawerOpen,
        setIsChildDrawerOpen,
        salesData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
