"use client";
import { ReportContext } from "@/context/report-context";
import { Tabs, TabsProps } from "antd";
import { useContext, useState } from "react";
import InvoiceReportByCustomer from "./invoice-reports-customer";

export default function InvoiceReport() {
  const { activeTab, setActiveTab } = useContext(ReportContext);

  const tabs: TabsProps["items"] = [
    {
      key: "customer",
      label: "By Customer",
    },
  ];
  //comment
  return (
    <div className="lg:mx-10 mx-0">
      <Tabs
        defaultActiveKey="1"
        items={tabs}
        onChange={(key) => {
          if (setActiveTab) {
            setActiveTab(key);
          }
        }}
      />
      {activeTab === "customer" && <InvoiceReportByCustomer />}
      
    </div>
  );
}
