import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Badge } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { ReportContext } from "@/context/report-context";
import { OrderContext } from "@/context/order-context";
import { CustomerContext } from "@/context/customer-context";
import { ignore } from "antd/es/theme/useToken";

interface InvoiceData {
  date: string;
  invoice_no: string;
  orderName: string | undefined;
  total: number;
  paidAmount: number;
  balance: number;
  isCompleted: boolean;
}

interface InvoiceReportTableProps {
  dateType: string;
  date: string | number | Date | undefined;
  startDate: string | number | Date | undefined;
  endDate: string | number | Date | undefined;
  month: string | number | Date | undefined;
  customerId?: string | null | undefined;
}

export default function InvoiceReportTable({
  dateType,
  date,
  startDate,
  endDate,
  month,
  customerId,
}: InvoiceReportTableProps) {
  const { orders } = useContext(OrderContext);
  const { invoices } = useContext(ReportContext);
  const { customers } = useContext(CustomerContext);

  const [customerName, setCustomerName] = useState<string>("");

  useEffect(() => {
    if (customers && customerId) {
      const customer = customers.find(
        (customer) => customer._id === customerId
      );
      setCustomerName(customer?.name || "");
    }
  }, [customerId, customers]);

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: "#my-table" });

    doc.setFontSize(12);

    const tableData = getTableData();

    doc.text(
      "Pramuditha Jayawardhana(Pvt) Ltd",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );
    doc.setFontSize(10);
    // Add address aligned to the center
    doc.text(
      "No 65, Kottawa",
      doc.internal.pageSize.getWidth() / 2,
      30,
      { align: "center" }
    );
    doc.setFontSize(10);
    // Add contact information aligned to the center
    doc.text(
      "Tel: 071 33636378 | E-mail: pramu.dev5@gmail.com~",
      doc.internal.pageSize.getWidth() / 2,
      35,
      { align: "center" }
    );
    doc.setFontSize(10);
    // Add contact information aligned to the center
    doc.text(
      "_______________________________________________________________________",
      doc.internal.pageSize.getWidth() / 2,
      37,
      { align: "center" }
    );
    doc.text(
      "Customer Name : " + customerName,
      doc.internal.pageSize.getWidth() / 2,
      43,
      { align: "center" }
    );
    doc.text(
      "_______________________________________________________________________",
      doc.internal.pageSize.getWidth() / 2,
      45,
      { align: "center" }
    );

    if (dateType === "daily") {
      doc.text(
        `Date: ${dayjs(date).format("DD/MM/YYYY")}`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
      );
    } else if (dateType === "range") {
      doc.text(
        `Date Range: ${dayjs(startDate).format("DD/MM/YYYY")} - ${dayjs(
          endDate
        ).format("DD/MM/YYYY")}`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
      );
    } else if (dateType === "monthly") {
      doc.text(
        `Month: ${dayjs(month).format("MMMM YYYY")}`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
      );
    }

    const header = [
      { title: "Date", dataKey: "date" },
      { title: "Invoice No", dataKey: "invoice_no" },
      { title: "Order Name", dataKey: "orderName" },
      { title: "Total Amount", dataKey: "total" },
      { title: "Paid Amount", dataKey: "paidAmount" },
      { title: "Balance", dataKey: "balance" },
      { title: "Completed", dataKey: "isCompleted" },
    ];
    const tableWidth = doc.internal.pageSize.getWidth() - 30;

    autoTable(doc, {

      startY: 55,
      head: [header.map((column) => column.title)],
      body: tableData.map((row) => Object.values(row)),
      headStyles: { fillColor: [100, 100, 100] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
      },

      margin: { right: 15 },
      tableWidth: tableWidth,
    });

    // Add summary table

    const summaryData = getSummaryData();
    autoTable(doc, {
      body: summaryData.map((data) => [data.title, data.value]),
      // @ts-ignore
      startY: doc.autoTable.previous.finalY + 10,
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: "bold" } },
      margin: { left: doc.internal.pageSize.getWidth() / 2, right: 15 },
      tableWidth: doc.internal.pageSize.getWidth() / 2 - 15,
    });

    doc.save("invoice_report.pdf");
  };

  const getSummaryData = (): { title: string; value: string | number }[] => {
    let totalAmount = 0;
    let totalPaidAmount = 0;
    let totalBalance = 0;

    invoices.forEach((invoice) => {
      totalAmount += invoice.total;
      totalPaidAmount += invoice.paidAmount || 0;
      totalBalance += invoice.balance || 0;
    });

    const formatValue = (value: number): string => {
      return `Rs ${value.toFixed(2)}`;
    };

    return [
      { title: "Total Amount", value: formatValue(totalAmount) },
      { title: "Total Paid Amount", value: formatValue(totalPaidAmount) },
      { title: "Total Balance", value: formatValue(totalBalance) },
    ];
  };

  const getTableData = (): InvoiceData[] => {
    return invoices.map((invoice) => ({
      date: formatDate(invoice.date),
      invoice_no: invoice.invoice_no,
      orderName: getOrderName(invoice.order_id?.toString()),
      total: invoice.total,
      paidAmount: invoice.paidAmount || 0,
      balance: invoice.balance || 0,
      isCompleted: invoice.isCompleted || false,
    }));
  };

  const formatDate = (date: Date): string => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const getOrderName = (orderId: string | undefined): string | undefined => {
    if (!orderId) return undefined;
    const order = orders.find((order) => String(order._id) === orderId);
    return order?.name;
  };

  const columns = [
    {
      title: "Created At",
      dataIndex: "date",
      key: "date",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Invoice No",
      dataIndex: "invoice_no",
      key: "invoice_no",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Order Name",
      dataIndex: "order_id",
      key: "order_id",
      render: (text: any) => {
        const order = orders.find((order) => order._id === text);
        return <div>{order?.name}</div>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Completed",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (isCompleted: boolean) =>
        isCompleted ? (
          <Badge status="success" text="Yes" />
        ) : (
          <Badge status="error" text="No" />
        ),
    },
  ];

  return (
    <div className="p-4">
      <div className="text-right mb-4">
        <Button onClick={generatePDF}>Download PDF</Button>
      </div>
      {dateType === "daily" && (
        <p className="font-semibold">
          Date : {dayjs(date).format("DD/MM/YYYY")}
        </p>
      )}
      {dateType === "monthly" && (
        <p className="font-semibold">
          Month : {dayjs(month).format("MMMM YYYY")}
        </p>
      )}
      {dateType === "range" && (
        <p className="font-semibold">
          Start Date : {dayjs(startDate).format("DD/MM/YYYY")} | End Date :{" "}
          {dayjs(endDate).format("DD/MM/YYYY")}
        </p>
      )}
      <div className="my-3">
        <p className="font-semibold">Customer Name : {customerName}</p>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={invoices}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
