"use client";
import axios from "axios";
import React, { ReactNode, useEffect } from "react";
import { createContext, useState } from "react";
import { message } from "antd";
const BaseUrl = process.env.BASE_URL;

export interface Category {
  _id: string;
  name: string;
  description: string;
}
interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  createCategory: (category: Category) => void;
  updateCategory: (category: Category, id: string) => void;
  deleteCategory: (id:string) => void;
}

export const CategoryContext = createContext<CategoryContextType>(
  {} as CategoryContextType
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    setLoading(true);
    axios
      .get(`${BaseUrl}/category`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setLoading(false);
          setCategories(res.data.data.data);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const createCategory = (category: Category) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/category`, category)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllCategories();
          message.success("Category created successfully");
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const updateCategory = (category: Category,id:string) => {
   
    setLoading(true);
    axios
      .put(`${BaseUrl}/category/${id}`, category)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllCategories();
          message.success("Category updated successfully");
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const deleteCategory = (id:string) => {
    console.log(id);
    axios.delete(`${BaseUrl}/category/${id}`).then((res)=>{
      if(res.data.error == null){
        getAllCategories();
        message.success("Category Deleted Successfully")
      }else{
        message.error(res.data.error)
      }
    }).catch((err)=>{
      message.error(err.message);
    })
    
  }

  return (
    <CategoryContext.Provider value={{ categories, loading, createCategory , updateCategory,deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
