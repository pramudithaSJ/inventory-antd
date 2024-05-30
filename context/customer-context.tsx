"use client";
import axios from "axios";
import React, { ReactNode, useEffect } from "react";
import { createContext, useState,useContext } from "react";
import { RouteContext } from "./route-context";
import { message } from "antd";
const BaseUrl = process.env.BASE_URL;

export interface Customer {
  _id: string;
  name: string;
  mobileNo: string;
  email: string;
  address: string;
  cPerson: string;
  cMobileNo: string;
  remarks: string;
  creditLimit: number;
  orderedAmount: number;
  paidAmount: number;
  balance: number;
  paymentType: string;
  walletBalance: number;
  route: string;
}
interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  createCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer, id: string) => void;
  deleteCustomer: (id: string) => void;
  isDrawerVisible?: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
  getAllCustomers?: () => void;

}

export const CustomerContext = createContext<CustomerContextType>(
  {} as CustomerContextType
);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { getAllRoutes } = useContext(RouteContext);

  useEffect(() => {
    getAllCustomers();
  }, []);

  const getAllCustomers = () => {
    setLoading(true);
    axios
      .get(`${BaseUrl}/customer`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setLoading(false);
          // Sorting customers alphabetically by name
          const sortedCustomers = res.data.data.data.sort((a: any, b: any) => {
            return a.name.localeCompare(b.name);
          });
          setCustomers(sortedCustomers);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const createCustomer = (customer: Customer) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/customer`, customer)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("Customer created successfully");
          getAllCustomers();
          setLoading(false);
          setIsDrawerVisible(false);
          if (getAllRoutes) {
            getAllRoutes();
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

  const updateCustomer = (customer: Customer, id: string) => {
    console.log(customer);
    console.log(customer._id);

    setLoading(true);
    axios
      .put(`${BaseUrl}/customer/${id}`, customer)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllCustomers();
          setLoading(false);
          message.success("Customer updated successfully");
          setIsDrawerVisible(false);
          if (getAllRoutes) {
            getAllRoutes();
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

  const deleteCustomer = (id: string) => {
    axios
      .delete(`${BaseUrl}/customer/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("Customer Deleted Successfully");
          setCustomers(customers.filter((customer) => customer._id !== id));
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        isDrawerVisible,
        setIsDrawerVisible,
        getAllCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
