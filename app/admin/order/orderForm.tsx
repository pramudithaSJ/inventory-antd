// CustomerForm.js
import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  DatePicker,
  message,
} from "antd";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
import { CategoryContext } from "@/context/category-context";

import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
import FormItem from "antd/es/form/FormItem";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import { OrderContext, Order } from "@/context/order-context";

dayjs.locale("en"); // Set English locale

interface OrderFormProps {
  editOrderData: Order | null | undefined;
  onCloseDrawer: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  editOrderData,
  onCloseDrawer,
}) => {
  const {
    createItem,
    items,
    isDrawerVisible,
    setIsDrawerVisible,
    updateItem,
    loading,
  } = useContext(ItemContext);
  const { orders, updateOrder } = useContext(OrderContext);

  const { categories } = useContext(CategoryContext);
  const { customers } = useContext(CustomerContext);
  const [form] = Form.useForm();
  const [date, setDate] = useState<string | number | Date | undefined>(
    new Date()
  );
  const [cName, setCpName] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [cNumber, setContactPersonNumber] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [itemId, setItemId] = useState<string>("");
  const [enteredQuantity, setEnteredQuantity] = useState<number>(0);
  const [itemAmount, setItemAmount] = useState(0);
  const [isOrderNotValid, setIsOrderNotValid] = useState<boolean>(false);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isFastDelivery, setIsFastDelivery] = useState<boolean>(false);
  const [isFastDisabled, setIsFastDisabled] = useState<boolean>(false);

  const onFinish = (values: Order) => {
    console.log("gg", values);

    const { cusId, cNumber } = values;

    if (editOrderData?._id != null) {
      updateOrder(values, editOrderData._id);
    }
    // } else {
    //   if (
    //     values.additional_charges === undefined ||
    //     values.additional_charges === null
    //   ) {
    //     values.additional_charges = 0;
    //   }
    //   if (
    //     values.delivery_charges === undefined ||
    //     values.delivery_charges === null
    //   ) {
    //     values.delivery_charges = 0;
    //   }
    //   values.total =
    //     values.price + values.additional_charges + values.delivery_charges;

    //   values.order_No = `#Order${orders.length + 1}`;
    //   values.isUrgent = isUrgent;
    //   values.paid_amount = 0;
    //   values.discount = 0;
    //   values.isFast = isFastDelivery;
    //   const updatedValues = {
    //     ...values,
    //     customer: { customerId, cNumber, cName },
    //   };
    //   createJob(updatedValues);
    // }
  };
  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(
      (customer) => customer._id === customerId
    );
    if (selectedCustomer) {
      console.log(selectedCustomer.cPerson);
      setCpName(selectedCustomer.cPerson);
      form.setFieldsValue({ contactPersonName: selectedCustomer.cPerson });
      form.setFieldsValue({ paymentType: selectedCustomer.paymentType });
      setContactPersonNumber(selectedCustomer.cMobileNo);
      form.setFieldsValue({ cNumber: selectedCustomer.cMobileNo });
    }
  };
  const handleItemSelect = (itemId: string) => {
    const selectedItem = items.find((item) => item._id === itemId);
    if (selectedItem) {
      setAvailableQuantity(selectedItem.available_quantity);
      form.setFieldsValue({
        available_quantity: selectedItem.available_quantity,
      });
    }
  };
  const handleQuantityChange = (quantity: number) => {
    const selectedItem = items.find((item) => item._id === itemId);
    if (selectedItem) {
      setItemAmount(selectedItem.default_price * quantity);
      const customerPayementType = form.getFieldValue("paymentType");
      const relatedItemPrice =
        customerPayementType === "cashPrice"
          ? selectedItem.price.cashPrice
          : customerPayementType === "creditPrice"
          ? selectedItem.price.creditPrice
          : customerPayementType === "agentPrice"
          ? selectedItem.price.agentPrice
          : selectedItem.price.specialPrice;

      form.setFieldsValue({
        price: relatedItemPrice * quantity,
      });
    }
  };
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setIsUrgent(e.target.checked);
  };
  const onFastChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setIsFastDelivery(e.target.checked);
  };

  const handleDeliveryTypeChange = () => {
    const type = form.getFieldValue("delivery_type");
    if (type === "delivery") {
      setIsFastDisabled(true);
    } else {
      form.setFieldsValue({ delivery_charges: 0 });
      setIsFastDelivery(false);
      setIsFastDisabled(false);
    }
  };

  useEffect(() => {
    if (availableQuantity < enteredQuantity) {
      message.error("you don't have enough stock to create this");
      setIsOrderNotValid(true);
    } else {
      setIsOrderNotValid(false);
    }
  }, [enteredQuantity]);
  useEffect(() => {
    if (editOrderData) {
      handleItemSelect(editOrderData.item);
      setIsUrgent(editOrderData.isUrgent);
      console.log(editOrderData.isUrgent);
      form.setFieldsValue({
        urgent: editOrderData.isUrgent,
      });
      const cusid = editOrderData.customer.customerId;
      const selectCustomer = customers.find(
        (customer) => customer._id === cusid
      );
      form.setFieldsValue({ paymentType: selectCustomer?.paymentType });

      const formData = {
        ...editOrderData,
        date: dayjs(editOrderData.date),
        cNumber: editOrderData?.customer?.cNumber,
        Customer: editOrderData?.customer?.customerId,
        contactPersonName: editOrderData?.customer?.cName,
      };
      form.setFieldsValue(formData);
      const orderDate = new Date(editOrderData.date);
      setDate(orderDate);
    }
  }, [editOrderData]);

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={24}>
          <Form.Item
            label="Job Name"
            name="name"
            rules={[{ required: true, message: "Date is Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Date is Required" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(date: any) => setDate(date)}
              value={dayjs(date).isValid() ? dayjs(date) : undefined}
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Customer"
            name="Customer"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Select
              showSearch
              placeholder="Select customers"
              optionFilterProp="children"
              onSelect={(customerId: string) => {
                handleCustomerSelect(customerId);
                setCustomerId(customerId);
              }}
            >
              {customers.map((customer) => (
                <Select.Option key={customer._id} value={customer._id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Contact Person Name"
            name="contactPersonName"
            initialValue={cName}
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input
              value={cName}
              onKeyUp={(e: any) => {
                setCpName(e.target.value);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Contact Person Number"
            name="cNumber"
            initialValue={cNumber}
            rules={[
              {
                required: true,
                message: "Contact Person mobile Number is required",
              },
              {
                pattern: /^(07)\d{8}$/,
                message:
                  "Invalid Mobile Number. It should start with 07 and have 10 digits in total.",
              },
            ]}
          >
            <Input
              value={cNumber}
              onKeyUp={(e: any) => {
                setContactPersonNumber(e.target.value);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item label="Customer Payment Type" name="paymentType">
            <Input disabled={true} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Item"
            name="item"
            rules={[{ required: true, message: "item is Required" }]}
          >
            <Select
              showSearch
              placeholder="Select an Item"
              optionFilterProp="children"
              onSelect={(itemId: string) => {
                handleItemSelect(itemId);
                setItemId(itemId);
              }}
            >
              {items.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Available Quantity" name="available_quantity">
            <Input value={availableQuantity} disabled={true} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <FormItem
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: "Please enter the quantity" },
              {
                type: "number",
                min: 1,
                message: "Quantity should be greater than 0",
              },
            ]}
          >
            <InputNumber
              className="w-full"
              onKeyUp={(e: any) => {
                handleQuantityChange(e.target.value);
                setEnteredQuantity(e.target.value);
              }}
              min={1}
              max={availableQuantity}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Amount" name="price">
            <InputNumber className="w-full" disabled={true} />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <FormItem label="Order Type" name="order_type">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="credit">Credit</Select.Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Delivery Type" name="delivery_type">
            <Select
              onChange={() => {
                handleDeliveryTypeChange();
              }}
            >
              <Select.Option value="pickup">Pickup</Select.Option>
              <Select.Option value="delivery">Delivery</Select.Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={12}>
          <FormItem label="Delivery Charges" name="delivery_charges">
            <InputNumber
              className="w-full"
              prefix="Rs."
              disabled={!isFastDisabled}
            />
          </FormItem>
        </Col>

        <Col span={12}>
          <FormItem label="Additional Chargers" name="additional_charges">
            <InputNumber className="w-full" prefix="Rs." />
          </FormItem>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={6}>
          <FormItem label="Urgent Order" name="urgent">
            <Checkbox
              onChange={onChange}
              value={isUrgent}
              checked={isUrgent}
            ></Checkbox>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="Fast Delivery" name="isFast">
            <Checkbox
              onChange={onFastChange}
              value={isFastDelivery}
              checked={isFastDelivery}
              disabled={!isFastDisabled}
            ></Checkbox>
          </FormItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <FormItem label="Created By" name="created_by">
            <Input />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="Remark" name="remark">
            <Input className="w-full" />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={12}>
          <FormItem label="Designed By" name="designby">
            <Input />
          </FormItem>
        </Col>
      </Row>

      <Form.Item>
        <Button loading={loading} htmlType="submit" disabled={isOrderNotValid}>
          {editOrderData?._id != null ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
