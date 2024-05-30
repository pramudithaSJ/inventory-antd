"use client";
import React, { useContext, useEffect, useState } from "react";
import { Table, Input, Space, Button, Drawer, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ExpenseContext, Expense } from "@/context/expenses-context";
import ExpenseForm from "./expenseForm";
import { ColumnProps } from "antd/es/table";
export default function ExpenseTable() {
  const {
    expenses,
    loading,
    deleteExpense,
    isDrawerVisible,
    setIsDrawerVisible,
  } = useContext(ExpenseContext);
  const [searchText, setSearchText] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);

  const [editExpenseData, setEditExpenseData] = useState<
    Expense | null | undefined
  >();

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredExpenses = expenses.filter((expense) =>
      expense.purpose.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExpenses(filteredExpenses);
  };
  const showDrawer = (expense: Expense) => {
    setEditExpenseData(expense);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(true);
    }
  };

  const onCloseDrawer = () => {
    setEditExpenseData(null);
    if (setIsDrawerVisible) {
      setIsDrawerVisible(false);
    }
  };

  const showDeleteConfirmation = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete._id); // Assuming _id is the unique identifier for the expense
    }
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  const columns: ColumnProps<Expense>[] = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => <a>{new Date(text).toLocaleDateString()}</a>,
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Expense) => (
        <Space size="middle">
          <EditOutlined onClick={() => showDrawer(record)} />
          <DeleteOutlined onClick={() => showDeleteConfirmation(record)} />
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <div className="flex flex-row md:flex-row justify-between">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search by purpose"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Expense);
            }}
          >
            Create Expense
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredExpenses}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </div>
      <Drawer
        title={editExpenseData?._id != null ? "Edit Expense" : "Create Expense"}
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <ExpenseForm
          editExpenseData={editExpenseData}
          onCloseDrawer={onCloseDrawer}
        />
      </Drawer>

      <Modal
        title="Delete Expense"
        open={deleteConfirmationVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this expense?</p>
      </Modal>
    </div>
  );
}
