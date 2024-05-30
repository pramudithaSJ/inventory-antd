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
  Space,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { CustomerContext, Customer } from "@/context/customer-context";
import { ItemContext, Item } from "@/context/item-context";
import { CategoryContext } from "@/context/category-context";
import { Job, JobContext, wastedJob } from "@/context/job-context";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
import FormItem from "antd/es/form/FormItem";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

dayjs.locale("en"); // Set English locale

interface JobFormProps {
  editJobData: wastedJob | null | undefined;
  onCloseDrawer: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ editJobData, onCloseDrawer }) => {
  const { createItem, items, isDrawerVisible, setIsDrawerVisible, updateItem } =
    useContext(ItemContext);
  const { jobs, createJob, updateJob, saveJobAsWasted, loading, wastedJobs } =
    useContext(JobContext);
  const [itemAmounts, setItemAmounts] = useState<number[]>([]);
  const { categories } = useContext(CategoryContext);

  const { customers } = useContext(CustomerContext);
  const [form] = Form.useForm();
  const [date, setDate] = useState<string | number | Date | undefined>(
    new Date()
  );
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(true);

  const [itemId, setItemId] = useState<string>("");

  const onFinish = (values: wastedJob) => {
    const result = isValid(values);
    if (result) {
      console.log(values);
      if (saveJobAsWasted) {
        saveJobAsWasted(values);
      }
    }
  };

  const isValid = (values: any) => {
    if (!values.items || values.items.length === 0) {
      message.error("please add one item");
      return false;
    } else {
      if (isTesting) {
        if (!values.reason) {
          message.error("please enter a reason");
          return false;
        } else {
          return true;
        }
      } else {
        if (!values.jobId) {
          message.error("please select a job");
          return false;
        } else {
          return true;
        }
      }
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={20}>
        <Col span={24}>
          <Form.Item
            label="Select The Type"
            name="type"
            rules={[
              {
                required: true,
                message: "please select a type",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onSelect={(value: string) => {
                setIsTesting(value === "Test");
              }}
            >
              <Select.Option value="Test">Testing</Select.Option>
              <Select.Option value="Job wasted">Job wasting</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {
        // If the selected type is testing, then show the testing form
        isTesting ? (
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item label="Reason" name="reason">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item label="Select The Job" name="jobId">
                <Select
                  showSearch
                  placeholder="Select an Item"
                  optionFilterProp="children"
                  onSelect={(itemId: string) => {
                    setItemId(itemId);
                  }}
                >
                  {jobs
                    .filter((item) => item.isActive) // Filter jobs where isActive is true
                    .map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.job_No}
                        <span className="mx-3">|</span>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )
      }

      <Divider orientation="left">Wasted Items</Divider>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Row gutter={20} key={index}>
                <Col span={10}>
                  <Form.Item
                    name={[field.name, "item"]}
                    className="w-full"
                    label="Item"
                    rules={[
                      {
                        required: true,
                        message: "Quantity must be a number",
                      },
                    ]}
                  >
                    <Select placeholder="Item">
                      {items.map((item) => (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={[field.name, "quantity"]}
                    rules={[
                      {
                        required: true,
                        message: "Quantity must be a number",
                      },
                    ]}
                    label="Quantity"
                  >
                    <InputNumber
                      placeholder="quantity"
                      className="w-full"
                      onChange={(value: any) =>
                        // onItemQuantityChange(value, index)
                        console.log("value", value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      remove(field.name);
                    }}
                    icon={<DeleteOutlined />}
                  />
                </Col>
              </Row>
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

      <Form.Item>
        <Button loading={loading} htmlType="submit">
          Save As Wasted
        </Button>
      </Form.Item>
    </Form>
  );
};

export default JobForm;
