// CustomerForm.js
import React, { useEffect, useContext } from "react";
import { Form, Input, Button, Row, Col, Select, InputNumber } from "antd";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
import { CategoryContext } from "@/context/category-context";

interface ItemFormProps {
  editItemData: Item | null | undefined;
  onCloseDrawer: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ editItemData, onCloseDrawer }) => {
  const [form] = Form.useForm();

  const {
    createItem,
    items,
    isDrawerVisible,
    setIsDrawerVisible,
    updateItem,
    loading,
  } = useContext(ItemContext);

  const { categories } = useContext(CategoryContext);

  useEffect(() => {
    // console.log("editCustomerData", editCustomerData);
    if (editItemData) {
      form.setFieldsValue({
        ...editItemData,
        length: editItemData.dimension?.length,
        width: editItemData.dimension?.width,
        height: editItemData.dimension?.height,
        cashPrice: editItemData.price?.cashPrice,
        creditPrice: editItemData.price?.creditPrice,
        agentPrice: editItemData.price?.agentPrice,
        specialPrice: editItemData.price?.specialPrice,
      });
    }
  }, [editItemData, form]);

  const onFinish = (values: Item) => {
    const {
      length,
      height,
      width,
      agentPrice,
      cashPrice,
      creditPrice,
      specialPrice,
    } = values;

    if (editItemData?._id != null) {
      const updatedValues = {
        ...values,
        dimension: { length, width, height },
        price: {
          cashPrice,
          creditPrice,
          agentPrice,
          specialPrice,
        },
      };
      updateItem(updatedValues, editItemData._id);
    } else {
      const updatedValues = {
        ...values,
        dimension: { length, width, height },
        price: {
          cashPrice,
          creditPrice,
          agentPrice,
          specialPrice,
        },
      };
      createItem(updatedValues);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Item Cost"
            name="initial_cost"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber prefix="Rs" className="w-full" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Cash Price"
            name="cashPrice"
            rules={[{ required: true, message: "Please enter a value" }]}
          >
            <InputNumber className="w-full" min={0} prefix="Rs" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Credit Price"
            name="creditPrice"
            rules={[{ required: true, message: "Please enter a value" }]}
          >
            <InputNumber className="w-full" min={0} prefix="Rs" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Agent Price"
            name="agentPrice"
            rules={[{ required: true, message: "Please enter a value" }]}
          >
            <InputNumber className="w-full" min={0} prefix="Rs" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Special Price"
            name="specialPrice"
            rules={[{ required: true, message: "Please enter a value" }]}
          >
            <InputNumber className="w-full" min={0} prefix="Rs" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={24}>
          <Form.Item label="Dimension">
            <Row gutter={1}>
              <Col span={6}>
                <Form.Item name="length">
                  <InputNumber placeholder="Length" min={0} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="width">
                  <InputNumber placeholder="Width" min={0} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="height">
                  <InputNumber placeholder="Height" min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={24}>
          <Form.Item label="Remark" name="remark">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={24}>
          <Form.Item>
            <Button loading={loading} htmlType="submit">
              {editItemData?._id != null ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ItemForm;
