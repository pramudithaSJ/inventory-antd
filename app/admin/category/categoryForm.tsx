
import React, { useEffect,useContext } from "react";
import { Form, Input, Button,Row,Col } from "antd";
import { Category, CategoryContext } from "@/context/category-context";

interface CategoryFormProps {
  editCategoryData: Category | null | undefined;
  onCloseDrawer: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editCategoryData,
  onCloseDrawer,
}) => {
  const [form] = Form.useForm();
  const {createCategory,updateCategory,loading } = useContext(CategoryContext);
  


  useEffect(() => {
    // console.log("editCustomerData", editCustomerData);
    if (editCategoryData) {
      form.setFieldsValue(editCategoryData);
      // console.log("editCustomerData", editCustomerData);
    }
  }, [editCategoryData, form]);

  const onFinish = (values: Category) => {
    
    if (editCategoryData?._id != null) {
      updateCategory(values,editCategoryData._id);
    } else {
      createCategory(values);
    }
    onCloseDrawer(); // Close the drawer after submission
  };

  return (
    <Form form={form} onFinish={onFinish}>
      
          <Form.Item label="Name" name="name" rules={[{ required: true,message:'name is required' }]}>
          <Input />
          </Form.Item>
        
          <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Description is required' },
                {
                  pattern: /^[^\d]+$/,
                  message: 'Name cannot contain numbers',
                },
          ]}
          >
          <Input />
          </Form.Item>
      <Form.Item>
        <Button htmlType="submit">
          {editCategoryData?._id != null ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
