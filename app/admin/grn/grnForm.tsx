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
  Space,
  DatePickerProps,
} from "antd";
import { Grn, GrnContext } from "@/context/grn-context";
import { ItemContext } from "@/context/item-context";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale

dayjs.locale("en"); // Set English locale

interface GrnFormProps {
  editGrnData: Grn | null | undefined;
  onCloseDrawer: () => void;
}

const GrnForm: React.FC<GrnFormProps> = ({ editGrnData, onCloseDrawer }) => {
  const [form] = Form.useForm();
  const [itemAmounts, setItemAmounts] = useState<number[]>([]);
  const { createGrn, updateGrn, loading, grns } = useContext(GrnContext);
  const [date, setDate] = useState<string | number | Date | undefined>(
    new Date()
  );
  const { items } = useContext(ItemContext);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    if (editGrnData) {
      const formData = {
        ...editGrnData,
        grn_date: dayjs(editGrnData.grn_date),
      };
      form.setFieldsValue(formData);
      const grnDate = new Date(editGrnData.grn_date);
      setDate(grnDate);
    }
    if (editGrnData?.items) {
      const amounts =
        editGrnData?.items.map((item) => item.quantity * item.cost) || [];
      setItemAmounts(amounts);
    }
  }, [editGrnData]);

  const onItemQuantityChange = (value: number, index: number) => {
    const newAmounts = [...itemAmounts];
    newAmounts[index] = value * form.getFieldValue(["items", index, "cost"]);
    setItemAmounts(newAmounts);
    form.setFieldsValue({
      items: newAmounts.map((amount, i) => ({
        ...form.getFieldValue(["items", i]),
        amount,
      })),
    });
  };

  const onItemCostChange = (value: number, index: number) => {
    const newAmounts = [...itemAmounts];
    newAmounts[index] =
      value * form.getFieldValue(["items", index, "quantity"]);
    setItemAmounts(newAmounts);
    form.setFieldsValue({
      items: newAmounts.map((amount, i) => ({
        ...form.getFieldValue(["items", i]),
        amount,
      })),
    });
  };
  const onItemRemove = (indexToRemove: number) => {
    // Remove the item from itemAmounts array
    const newAmounts = itemAmounts.filter(
      (_, index) => index !== indexToRemove
    );
    setItemAmounts(newAmounts);

    // Remove the item from form values
    form.setFieldsValue({
      items: form
        .getFieldValue("items")
        .filter((_: any, index: number) => index !== indexToRemove),
    });

    // Recalculate total cost
    const newTotalCost = newAmounts.reduce((a, b) => a + b, 0);
    form.setFieldsValue({ total_cost: newTotalCost });
  };

  const onFinish = (values: Grn) => {
    ``;
    console.log(itemAmounts);
    values.total_cost = itemAmounts.reduce((a, b) => a + b, 0);
    if (editGrnData?._id != null) {
      updateGrn(values, editGrnData._id);
    } else {
      const GrnNo = grns.length + 1;
      values.grn_no = `GRN-${GrnNo}`;
      createGrn(values);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Received Date"
            name="grn_date"
            rules={[{ required: true, message: "Date is Required" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(date: any) => setDate(date)}
              value={dayjs(date).isValid() ? dayjs(date) : undefined}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Received By"
            name="receivedBy"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={20} className="my-2">
        <Col span={24}>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[field.name, "item"]}
                      rules={[{ required: true, message: "Missing item" }]}
                    >
                      <Select placeholder="Item">
                        {items.map((item) => (
                          <Select.Option key={item._id} value={item._id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "cost"]}
                      rules={[
                        {
                          required: true,
                          message: "Price must be a number",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="unit price"
                        onChange={(value: any) =>
                          onItemCostChange(value, index)
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Quantity must be a number",
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="quantity"
                        onChange={(value: any) =>
                          onItemQuantityChange(value, index)
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "amount"]}
                      initialValue={itemAmounts[index]}
                    >
                      <InputNumber placeholder="amount" disabled />
                    </Form.Item>

                    <Button
                      type="dashed"
                      onClick={() => {
                        remove(field.name);
                        onItemRemove(index);
                      }}
                      icon={<DeleteOutlined />}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusCircleOutlined />}
                  >
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Form.Item label="Remark" name="remark">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button loading={loading} htmlType="submit">
          {editGrnData?._id != null ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GrnForm;
