"use client";
import React, { useContext, useState,useEffect } from "react";
import {
  Table,
  Input,
  Space,
  Switch,
  TableColumnProps,
  Button,
  Drawer,
  Modal
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { CategoryContext,Category } from "@/context/category-context";
import CategoryForm from "./categoryForm";


export default function CategoryTable() {
  const { categories, loading,deleteCategory} = useContext(CategoryContext);
  const [searchText, setSearchText] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<
    Category | null | undefined
  >();
  const [deleteConfirmationVisible,setDeleteConfirmationVisible] = useState(false);
  const [delCategory,setDelCategory] = useState<Category|null>(null);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleFilter = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filteredCategories);
  };
  const showDrawer = (category: Category) => {
    setEditCategoryData(category);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setEditCategoryData(null);
    setDrawerVisible(false);
  };

  const handleDeleteConfirmation = (category:Category) => {
    setDeleteConfirmationVisible(true);
    setDelCategory(category);
  }

  const handleClickOk = () => {
    if(delCategory){
      deleteCategory(delCategory._id);
    }
    setDeleteConfirmationVisible(false);
  }

  const handleClickCancel = () => {
    setDeleteConfirmationVisible(false);
  }

  const columns: TableColumnProps<Category>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
   
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <EyeOutlined /> */}
          <EditOutlined onClick={() => showDrawer(record)} />
          <DeleteOutlined onClick={()=> handleDeleteConfirmation(record)} />
        </Space>
      ),
    },
  ];
  return (
    <div className="p-4">
      <div className="flex flex-row md:flex-row justify-between">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search Category by name"
            onChange={handleFilter}
            style={{ margin: "10px 0" }}
            className="w-1/4"
          />
        </div>
        <div className="">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              showDrawer({} as Category);
            }}
          >
            Create Category
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCategories}
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ height: "100vh" }}
      />
      <Drawer
        title={
          editCategoryData?._id != null ? "Edit Category" : "Create Category"
        }
        width={700}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        destroyOnClose={true}
      >
        <CategoryForm
          editCategoryData={editCategoryData}
          onCloseDrawer={onCloseDrawer}
        />
      </Drawer>

      <Modal
        title="Delete Category"
        open={deleteConfirmationVisible}
        onOk={handleClickOk}
        onCancel={handleClickCancel}
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

      
    </div>
  );
}
