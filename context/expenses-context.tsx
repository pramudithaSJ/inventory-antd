// context/ExpenseContext.tsx
"use client";
import { useEffect, useState, ReactNode, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/navigation";

export interface Expense {
  _id: string;
  date: Date;
  purpose: String;
  other?: string;
  amount: number;
}

const BaseUrl = process.env.BASE_URL;

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  getAllExpenses: () => void;
  createExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense, id: string) => void;
  deleteExpense: (id: string) => void;
  isDrawerVisible: boolean;
  setIsDrawerVisible: (isVisible: boolean) => void;
}

export const ExpenseContext = createContext<ExpenseContextType>(
  {} as ExpenseContextType
);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getAllExpenses();
  }, []);

  const getAllExpenses = () => {
    setLoading(true);
    axios
      .get(`${BaseUrl}/expense`)
      .then((res) => {
        if (res.data.error == null) {
          setLoading(false);
          setExpenses(res.data.data.expenses);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const createExpense = (expense: Expense) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/expense`, expense)
      .then((res) => {
        if (res.data.error == null) {
          message.success("Expense created successfully");
          getAllExpenses();
          setLoading(false);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const updateExpense = (expense: Expense, id: string) => {
    setLoading(true);
    axios
      .put(`${BaseUrl}/expense/${id}`, expense)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllExpenses();
          setLoading(false);
          message.success("Expense updated successfully");
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const deleteExpense = (id: string) => {
    axios
      .delete(`${BaseUrl}/expense/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("Expense Deleted Successfully");
          getAllExpenses();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        getAllExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
        isDrawerVisible,
        setIsDrawerVisible,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
