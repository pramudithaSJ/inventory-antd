// CustomerForm.js
import React, { useEffect, useContext,useState } from "react";
import { Form, Input, Button, Row, Col, InputNumber, Select } from "antd";
import { CustomerContext, Customer } from "@/context/customer-context";
import { RouteContext,Route} from "@/context/route-context";
interface CustomerFormProps {
  editCustomerData: Customer | null | undefined;
  onCloseDrawer: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  editCustomerData,
  onCloseDrawer,
}) => {
  const [form] = Form.useForm();
  const {routes} = useContext(RouteContext);
  const {
    createCustomer,
    updateCustomer,
    loading,
    isDrawerVisible,
    setIsDrawerVisible,
  } = useContext(CustomerContext);
  const [routeId, setRouteId] = useState<string>("");

  useEffect(() => {
    console.log("editCustomerData", editCustomerData);
    if (editCustomerData) {

      form.setFieldsValue(editCustomerData);
      // console.log("editCustomerData", editCustomerData);
    }
  }, [editCustomerData, form]);

  const onFinish = (values: Customer) => {
    // Add the selected routeId to the values object
    values.route = routeId;
  
    if (editCustomerData?._id != null) {
      updateCustomer(values, editCustomerData._id);
    } else {
      values.orderedAmount = 0;
      values.paidAmount = 0;
      values.balance = 0;
      values.walletBalance = 0;
      createCustomer(values);
    }
    // onCloseDrawer(); // Close the drawer after submission
  };

  const handleRouteSelect = (routeId: string) => {
    console.log("Selected Route ID:", routeId);
    setRouteId(routeId);
  
    // Set the selected route ID in the form field named "route"
    form.setFieldsValue({ route: routeId });
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
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Mobile No"
            name="mobileNo"
            rules={[
              { required: true, message: "Mobile Number is required" },
              {
                pattern: /^[0-9]{10}$/,
                message:
                  "Invalid Mobile Number. It should contain exactly 10 digits.",
              },
            ]}
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
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Contact Person"
            name="cPerson"
            rules={[
              { required: true, message: "Contact Person Name is required" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Contact Person Mobile"
            name="cMobileNo"
            rules={[
              { required: true, message: "Contact Person Mobile is required" },
              {
                pattern: /^(07)\d{8}$/,
                message:
                  "Invalid Mobile Number. It should start with 07 and have 10 digits in total.",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Credit Limit" name="creditLimit">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Payment Type"
            name="paymentType"
            rules={[{ required: true, message: "Payment Type is required" }]}
          >
            <Select>
              <Select.Option value="cashPrice">cash</Select.Option>
              <Select.Option value="creditPrice">credit</Select.Option>
              <Select.Option value="agentPrice">agent</Select.Option>
              <Select.Option value="specialPrice">special</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Form.Item label="Remark" name="remark">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
  <Col xs={24} sm={24} md={12} lg={12}>
  <Form.Item
            label="Route"
            name="route"
            rules={[{ required: true, message: "route is Required" }]}
          >
            <Select
              showSearch
              placeholder="Select a Route"
              optionFilterProp="children"
              onSelect={(routeId: string) => {
                handleRouteSelect(routeId);
                setRouteId(routeId);
              }}
            >
              {routes.map((route) => (
                <Select.Option key={route._id} value={route._id}>
                  {route.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
  </Col>
</Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: "left" }}>
          <Button loading={loading} htmlType="submit">
            {editCustomerData?._id != null ? "Update" : "Create"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CustomerForm;
