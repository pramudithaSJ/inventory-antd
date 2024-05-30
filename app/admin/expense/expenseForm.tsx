import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Row, Col } from "antd";
import { ExpenseContext, Expense } from "@/context/expenses-context";
import { useContext } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
dayjs.locale("en"); // Set English locale

interface ExpenseFormProps {
  editExpenseData: Expense | null | undefined;
  onCloseDrawer: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  editExpenseData,
  onCloseDrawer,
}) => {
  const { createExpense, updateExpense } = useContext(ExpenseContext);
  const [form] = Form.useForm();
  const [isOther, setIsOther] = React.useState(false);
  const [date, setDate] = React.useState(dayjs());

  useEffect(() => {
    if (editExpenseData) {
      const editDate = dayjs(editExpenseData.date);
      if (editExpenseData.purpose === "Other") {
        setIsOther(true);
      }
      setDate(editDate.isValid() ? editDate : dayjs());
      form.setFieldsValue({
        ...editExpenseData,
        date: editDate.isValid() ? editDate : null,
      });
    } else {
      form.resetFields();
    }
  }, [editExpenseData, form]);

  const handleFinish = (values: any) => {
    if (editExpenseData?._id != null) {
      updateExpense({ ...editExpenseData, ...values }, editExpenseData._id);
    } else {
      createExpense(values);
    }
    onCloseDrawer();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
            className="w-full"
          >
            <DatePicker
              className="w-full"
              value={date.isValid() ? date : undefined}
              onChange={(date) => setDate(date)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[{ required: true, message: "Please select a purpose" }]}
          >
            <Select
              onChange={(value: any) => {
                if (value === "Other") {
                  setIsOther(true);
                } else {
                  setIsOther(false);
                }
              }}
            >
              <Select.Option value="Electricity">Electricity</Select.Option>
              <Select.Option value="WaterBill">WaterBill</Select.Option>
              <Select.Option value="Transport">Transport</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {isOther && (
        <Form.Item
          name="other"
          label="Other Purpose"
          dependencies={["purpose"]}
          rules={[
            ({ getFieldValue }) => ({
              required: getFieldValue("purpose") === "Other",
              message: "Please specify other purpose",
            }),
          ]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: "Please input the amount" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">
          {editExpenseData?._id != null ? "Update Expense" : "Create Expense"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ExpenseForm;
