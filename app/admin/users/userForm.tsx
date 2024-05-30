// UserForm.js
import React, { useEffect, useContext } from "react";
import { Form, Input, Button, Row, Col, InputNumber, Select } from "antd";
import { UserContext, User } from "@/context/user-context";
interface UserFormProps {
  editUserData: User | null | undefined;
  onCloseDrawer: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ editUserData, onCloseDrawer }) => {
  const [form] = Form.useForm();
  const {
    createUser,
    updateUser,
    loading,
    isDrawerVisible,
    setIsDrawerVisible,
  } = useContext(UserContext);

  useEffect(() => {
    console.log("editUserData", editUserData);
    if (editUserData) {
      const { password, ...userDataWithoutPassword } = editUserData;
      form.setFieldsValue(userDataWithoutPassword);
      // form.setFieldsValue(editUserData);
      // console.log("editCustomerData", editCustomerData);
    }
  }, [editUserData, form]);

  const onFinish = (values: User) => {
    if (editUserData?._id != null) {
      updateUser(values, editUserData._id);
    } else {
      createUser(values);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{ touchAction: "manipulation" }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Name"
            name="username"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="collector">Cash Collector</Select.Option>
              <Select.Option value="designer">Designers</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: "left" }}>
          <Button loading={loading} htmlType="submit">
            {editUserData?._id != null ? "Update" : "Create"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
