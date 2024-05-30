"use client";
import axios from "axios";
import React, { ReactNode, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
import { Moment } from "moment";
import { ItemContext } from "./item-context";
const BaseUrl = process.env.BASE_URL;

export interface GrnItem {
  item: string;
  quantity: number;
  cost: number;
  amount: number;
}

export interface Grn {
  _id: string;
  grn_no: string;
  grn_date: string | number | Date;
  receivedBy: string;
  items: GrnItem[];
  total_cost: number;
  remark?: string;
}

interface GrnContextType {
  grns: Grn[];
  loading: boolean;
  createGrn: (grn: Grn) => void;
  updateGrn: (grn: Grn, id: string) => void;
  deleteGrn: (id: string) => void;
  isDrawerVisible?: boolean;
  isGrnUpdate?: boolean;
  setIsDrawerVisible?: (value: boolean) => void;
}

export const GrnContext = createContext<GrnContextType>({} as GrnContextType);

export const GrnProvider = ({ children }: { children: ReactNode }) => {
  const [grns, setGrns] = useState<Grn[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [isGrnUpdate, setIsGrnUpdate] = useState<boolean>(false);

  const { getAllItems } = useContext(ItemContext);

  async function getAllGrns() {
    const res = await axios.get(`${BaseUrl}/grn`);
    if (res.data.error == null) {
      setLoading(false);
      setGrns(res.data.data.result);
    } else {
      setLoading(false);
      message.error(res.data.error);
    }
  }

  useEffect(() => {
    getAllGrns();
  }, []);

  async function createGrn(grn: Grn) {
    setLoading(true);
    try {
      const res = await axios.post(`${BaseUrl}/grn`, grn);
      if (res.data.error == null) {
        setLoading(false);
        setIsDrawerVisible(false);
        setGrns([...grns, res.data.data.result]);
        message.success("Grn created successfully");
        if (getAllItems) {
          getAllItems();
        }
      } else {
        message.error(res.data.error);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      message.error("An error occurred");
      setLoading(false);
    }
  }
  async function updateGrn(grn: Grn, id: string) {
    setLoading(true);
    const res = await axios.put(`${BaseUrl}/grn/${id}`, grn);
    if (res.data.error == null) {
      setLoading(false);

      setIsDrawerVisible(false);
      const updatedGrns = grns.map((item) =>
        item._id === id ? { ...item, ...grn } : item
      );
      setGrns(updatedGrns);
      message.success("Grn updated successfully");
    } else {
      message.error(res.data.error);
    }
  }

  async function deleteGrn(id: string) {
    setLoading(true);
    const res = await axios.delete(`${BaseUrl}/grn/${id}`);
    if (res.data.error == null) {
      setLoading(false);
      const filteredGrns = grns.filter((item) => item._id !== id);
      setGrns(filteredGrns);
      message.success("Grn deleted successfully");
      if (getAllItems) {
        getAllItems();
      }
    } else {
      message.error(res.data.error);
    }
  }

  return (
    <GrnContext.Provider
      value={{
        createGrn,
        deleteGrn,
        updateGrn,
        grns,
        loading,
        isDrawerVisible,
        setIsDrawerVisible,
        isGrnUpdate,
      }}
    >
      {children}
    </GrnContext.Provider>
  );
};
