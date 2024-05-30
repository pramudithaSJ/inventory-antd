"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { GrnContext } from "./grn-context";
import { ItemContext } from "./item-context";
import { OrderContext } from "./order-context";
import { ChequeContext } from "./cheque-context";
import { CustomerContext } from "./customer-context";
const BaseUrl = process.env.BASE_URL;

export interface Receipt {
  _id: string;
  receipt_no: string;
  receipt_date: Date;
  receipt_amount: number;
  payment_method: PaymentMethod;
  order: string;
  remark?: string;
  created_by: string;
  chequeNo?: string;
  bank?: string;
  depositBank?: string;
  branch?: string;
  ref_no?: string;
  customer: string;
  isCompleted?: boolean;
  invoice: {
    inv_id: string;
    paidAmount: number;
  }[];
  invoice_id?: string;
  paidAmount?: number;
  walletBalance?: number;
}

interface PaymentMethod {
  method: string;
  details: CashDetails | ChequeDetails | BankDepositDetails;
}
interface CashDetails {}

interface ChequeDetails {
  cheque_no: string;
  bank: string;
  date: Date;
}

interface BankDepositDetails {
  bank: string;
  bank_branch: string;
  ref_no: string;
}

interface ReceiptContextType {
  receipts: Receipt[];
  loading: boolean;
  createReceipt: (receipt: Receipt) => void;
  getAllReceipts?: () => void;
  filteredReceipts?: Receipt[];
  getReceiptsByOrderId?: (orderId: string) => void;
  setOrderId?: (orderId: string) => void;
  isDrawerVisible?: boolean;
  setDrawerVisible?: (visible: boolean) => void;
}
export const ReceiptContext = createContext<ReceiptContextType>(
  {} as ReceiptContextType
);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [orderId, setOrderId] = useState<string>("");
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const {
    deleteOrder,

    isReceiptDrawerVisible,
    setIsReceiptDrawerVisible,
    isChildDrawerOpen,
    setIsChildDrawerOpen,
  } = useContext(OrderContext);
  const { getAllCheques } = useContext(ChequeContext);
  const { getAllCustomers } = useContext(CustomerContext);

  const createReceipt = (receipt: Receipt) => {
    setLoading(true);
    const result = axios
      .post(`${BaseUrl}/receipt`, receipt)
      .then((res) => {
        console.log("res", res.data.error);
        if (res.data.error == null) {
          getAllReceipts();
          if (getAllCheques) {
            getAllCheques();
          }
          if (getAllCustomers) {
            getAllCustomers();
          }
          message.success("Receipt created successfully");
          setDrawerVisible(false);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          getReceiptsByOrderId(receipt.order);
        }, 0);
      });
  };

  async function getAllReceipts() {
    setLoading(true);
    axios
      .get(`${BaseUrl}/receipt`)
      .then((res) => {
        setReceipts(res.data.data.result);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getAllReceipts();
  }, []);

  async function getReceiptsByOrderId(orderId: string) {
    setLoading(true);
    setTimeout(() => {
      const filteredReceipts = receipts.filter(
        (receipt) => receipt.order === orderId
      );
      console.log("filteredReceipts", filteredReceipts);
      setFilteredReceipts(filteredReceipts);
      setLoading(false);
    }, 0);
  }

  useEffect(() => {
    console.log("orderId", orderId);
    getReceiptsByOrderId(orderId);
  }, [orderId]);

  return (
    <ReceiptContext.Provider
      value={{
        receipts,
        loading,
        createReceipt,
        setOrderId,
        getAllReceipts,
        filteredReceipts,
        getReceiptsByOrderId,
        isDrawerVisible,
        setDrawerVisible,
      }}
    >
      {children}
    </ReceiptContext.Provider>
  );
};
