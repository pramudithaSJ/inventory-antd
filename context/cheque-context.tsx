"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { CustomerContext } from "./customer-context";
const BaseUrl = process.env.BASE_URL;

export interface Cheque {
  _id?: string; // Optional if you want to include the document ID
  cheque_no: string;
  date: Date;
  amount: number;
  bank: string;
  customer: string; // Assuming customer ID is a string
  status: string;
  remarks?: string; // Optional
  createdAt?: Date; // Optional, if you want to include timestamps
  updatedAt?: Date; // Optional, if you want to include timestamps
  banked_by?: string;
}
interface ChequeContextType {
  cheques: Cheque[];
  isDrawerVisible?: boolean;
  getAllCheques?: () => void;
  setIsDrawerVisible?: (value: boolean) => void;
  chequeBanked: (id: string, status: string, banked_by: string) => void;
}

export const ChequeContext = createContext<ChequeContextType>(
  {} as ChequeContextType
);

export const ChequeProvider = ({ children }: { children: ReactNode }) => {
  const [cheques, setAllCheques] = useState<Cheque[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const { getAllCustomers } = useContext(CustomerContext);

  const getAllCheques = () => {
    setLoading(true);
    axios
      .get(`${BaseUrl}/cheque`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setLoading(false);
          setAllCheques(res.data.data.data);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    getAllCheques();
  }, []);

  const chequeBanked = (id: string, status: string, banked_by: string) => {
    console.log("iiiid", id);

    setLoading(true);
    axios
      .patch(`${BaseUrl}/cheque/${id}`, { status, banked_by })
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setAllCheques(
            cheques.map((cheque) =>
              cheque._id === id ? { ...cheque, status, banked_by } : cheque
            )
          );
          // setLoading(false);
          // if (getAllOrders) {
          //   getAllOrders();
          // }
          message.success("cheque banked successfully");
          setIsDrawerVisible(false);
          if (getAllCustomers) {
            getAllCustomers();
          }
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  return (
    <ChequeContext.Provider
      value={{
        cheques,
        isDrawerVisible,
        setIsDrawerVisible,
        chequeBanked,
        getAllCheques,
      }}
    >
      {children}
    </ChequeContext.Provider>
  );
};
