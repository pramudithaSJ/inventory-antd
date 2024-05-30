import React, { useEffect, useContext, useState, useRef } from "react";
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
  Table,
  TableColumnProps,
} from "antd";
import { CustomerContext } from "@/context/customer-context";
import { ItemContext } from "@/context/item-context";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import English locale
import { Invoice } from "@/context/invoice-context";
import { Divider } from "antd";

dayjs.locale("en"); // Set English locale

interface InvoiceFormProps {
  editInvoiceData: Invoice | null | undefined;
  onCloseDrawer: () => void;
}

const PrintInvoiceForm: React.ForwardRefRenderFunction<
  HTMLDivElement,
  InvoiceFormProps
> = ({ editInvoiceData, onCloseDrawer }, ref) => {
  const { customers } = useContext(CustomerContext);
  const { items } = useContext(ItemContext);

  const columns: TableColumnProps<Invoice>[] = [
    {
      title: "Order No",
      dataIndex: "order_id",
      key: "orderNo",
      render: (text) => {
        const order = text;
        return <span className="font-bold">{order.order_No}</span>;
      },
    },
    {
      title: "Job Name",
      dataIndex: "order_id",
      key: "name",
      render: (text) => {
        const order = text;
        return <span className="font-bold">{order.name}</span>;
      },
    },
    {
      title: "Item",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        const item = items.find((item) => item._id === text.item);
        return <span className="font-bold">{item?.name}</span>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "order_id",
      key: "order_id",
      render: (text) => {
        return <span className="font-bold">{text.quantity}</span>;
      },
    },
    {
      title: "Price",
      dataIndex: "order_id",
      key: "item_price",
      render: (text) => {
        const order = text;
        return (
          <span className="font-bold">
            Rs {(order.price / order.quantity).toFixed(2)}
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "order_id",
      key: "order_id",
      align: "right",
      render: (text) => {
        return <span className="font-bold">Rs {text?.price?.toFixed(2)}</span>;
      },
    },
  ];

  return (
    <div
      className=" my-0 mx-auto rounded-lg"
      ref={ref}
      style={{ width: "22.5cm", height: "14cm" }}
    >
      <div className="flex justify-between">
        <div className="flex">
          {/* <div
            className="logo"
            style={{
              height: "50px",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          > */}
          {/* Your logo content goes here */}
          {/* <img
              src="null.jpg"
              alt="Logo"
              style={{ height: "100%", width: "100%" }}
            /> */}
          {/* </div> */}

          <table>
            <tbody>
              <tr>
                <td className="text-left font-bold">
                  Pramuditha Jayawardhana (pvt) Ltd
                </td>
              </tr>
              <tr>
                <td className="text-left text-xs">No 73/A,</td>
              </tr>
              <tr>
                <td className="text-left text-xs ">Pelanwatta</td>
              </tr>
              <tr>
                <td className="text-left text-xs ">Pannipitiya</td>
              </tr>
              <tr>
                <td className="text-left text-xs ">071 3363678</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Invoice</h1>
        </div>
      </div>
      <Divider className="my-2" />
      {editInvoiceData && (
        <div className="mx-auto ">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold ">Customer Details</h2>
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4">
                      <span className="font-semibold">Name:</span>
                    </td>
                    <td className="pl-4">
                      {
                        customers.find(
                          (customer) =>
                            customer._id ===
                            editInvoiceData.order_id.customer.customerId
                        )?.name
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <span className="font-semibold">Address:</span>
                    </td>
                    <td className="pl-4">
                      {
                        customers.find(
                          (customer) =>
                            customer._id ===
                            editInvoiceData.order_id.customer.customerId
                        )?.address
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <span className="font-semibold">Email:</span>
                    </td>
                    <td className="pl-4">
                      {
                        customers.find(
                          (customer) =>
                            customer._id ===
                            editInvoiceData.order_id.customer.customerId
                        )?.email
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <span className="font-semibold">Phone:</span>
                    </td>
                    <td className="pl-4">
                      {editInvoiceData.order_id.customer.cNumber}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="font-semibold">Invoice Details</h2>
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4">
                      <span className="font-semibold">Invoice No:</span>
                    </td>
                    <td className="pl-4">{editInvoiceData.invoice_no}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <span className="font-semibold">Date:</span>
                    </td>
                    <td className="pl-4">
                      {dayjs(editInvoiceData.date).format("DD-MM-YYYY")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <Divider className="my-2" />
          <div className="">
            <Table
              columns={columns}
              dataSource={[editInvoiceData]}
              pagination={false}
            />
          </div>
          <div className="flex justify-end">
            <table>
              <tbody>
                <tr>
                  <td className="text-right pr-4">
                    <span className="font-semibold">Delivery Charges:</span>
                  </td>
                  <td className="text-left pl-4">
                    Rs. {editInvoiceData?.order_id?.delivery_charges.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-4">
                    <span className="font-semibold">Additional Charges:</span>
                  </td>
                  <td className="text-left pl-4">
                    Rs.{" "}
                    {editInvoiceData?.order_id?.additional_charges.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-4">
                    <span className="font-semibold">Discount:</span>
                  </td>
                  <td className="text-left pl-4">
                    Rs. {editInvoiceData?.order_id?.discount?.toFixed(2)}
                  </td>
                </tr>
                <Divider className="my-2" />
                <tr>
                  <td className="text-right pr-4">
                    <span className="font-semibold">Grand Total:</span>
                  </td>
                  <td className="text-left pl-4">
                    Rs.{" "}
                    {Number(editInvoiceData?.order_id?.total) +
                      Number(editInvoiceData?.order_id?.delivery_charges) +
                      Number(editInvoiceData?.order_id?.additional_charges) -
                      Number(editInvoiceData?.order_id?.discount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(PrintInvoiceForm);
