// UserForm.js
import React, { useEffect, useContext } from "react";
import { Form, Input, Button, Row, Col, InputNumber, Select } from "antd";
import { UserContext, User } from "@/context/user-context";
import { Route, RouteContext } from "@/context/route-context";
interface UserFormProps {
  editRouteData: Route | null | undefined;
  onCloseDrawer: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  editRouteData,
  onCloseDrawer,
}) => {
  const [form] = Form.useForm();
  const { createRoute, updateRoute ,loading } = useContext(RouteContext);

  useEffect(() => {
    if (editRouteData != null) {
      form.setFieldsValue({
        name: editRouteData.name,
        description: editRouteData.description,
      });
    }
  }, [editRouteData]);

  const onFinish = (values: any) => {
    if (editRouteData?._id != null) {
      updateRoute(values, editRouteData._id);
    } else {
      console.log(values);
      createRoute(values);
    }
    onCloseDrawer();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{ touchAction: "manipulation" }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: "left" }}>
          <Button loading={loading} htmlType="submit">
            {editRouteData?._id != null ? "Update" : "Create"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
