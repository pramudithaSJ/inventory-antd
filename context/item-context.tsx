"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { GrnContext } from "./grn-context";
import { OrderContext } from "./order-context";
const BaseUrl = process.env.BASE_URL;

export interface Item {
  _id: string;
  name: string;
  brand: string;
  category: string;
  dimension: {
    length: number;
    width: number;
    height: number;
  };
  length: number;
  width: number;
  height: number;
  starting_quantity: number;
  available_quantity: number;
  minimum_quantity: number;
  remark?: string;
  initial_cost: number;
  default_price: number;
  price: {
    agentPrice: number;
    specialPrice: number;
    cashPrice: number;
    creditPrice: number;
  };
  agentPrice: number;
  specialPrice: number;
  cashPrice: number;
  creditPrice: number;
}
interface ItemContextType {
  items: Item[];
  loading: boolean;
  createItem: (item: Item) => void;
  updateItem: (item: Item, id: string) => void;
  deleteItem: (id: string) => void;
  isDrawerVisible?: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
  getAllItems?: () => void;
}

export const ItemContext = createContext<ItemContextType>(
  {} as ItemContextType
);
export const ItemProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  useEffect(() => {
    getAllItems();
  }, []);

  const getAllItems = () => {
    console.log("getAllItems");
    setLoading(true);
    axios
      .get(`${BaseUrl}/item`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setLoading(false);
          setItems(res.data.data.result);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const createItem = (item: Item) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/item`, item)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllItems();
          message.success("Item created successfully");
          setIsDrawerVisible(false);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        if (err.response.data.error.code == 11000) {
          message.error("item name already exist");
          setLoading(false);
        } else {
          message.error(err);
          setLoading(false);
        }
      });
  };
  const updateItem = (item: Item, id: string) => {
    setLoading(true);
    axios
      .put(`${BaseUrl}/item/${id}`, item)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllItems();
          message.success("Item updated successfully");
          setIsDrawerVisible(false);
        } else {
          console.log(res.data.error.code);
          if (res.data.error.code == 11000) {
            message.error("name already exist");
          }
        }
      })
      .catch((err) => {
        console.log(err.response.data.error.code);
        if (err.response.data.error.code == 11000) {
          message.error("item name already exist");
          setLoading(false);
        } else {
          message.error(err);
          setLoading(false);
        }
      });
  };

  const deleteItem = (id: string) => {
    setLoading(true);
    axios
      .delete(`${BaseUrl}/item/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllItems();
          message.success("Item deleted successfully");
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
    <ItemContext.Provider
      value={{
        items,
        loading,
        updateItem,
        deleteItem,
        createItem,
        isDrawerVisible,
        setIsDrawerVisible,
        getAllItems,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
