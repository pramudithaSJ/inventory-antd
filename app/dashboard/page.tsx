"use client";
import React, { useState, Suspense, lazy, useContext } from "react";
import {
  Button,
  Layout,
  Menu,
  Avatar,
  Popover,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AreaChartOutlined,
  DollarOutlined,
  CodeSandboxOutlined,
  DownOutlined,
  UserOutlined,
  BarChartOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { log } from "util";

const LazyCustomer = lazy(() => import("../admin/customer/page"));
const LazyCategory = lazy(() => import("../admin/category/page"));
const LazyItem = lazy(() => import("../admin/item/page"));
const LazyGrn = lazy(() => import("../admin/grn/page"));
const LazyOrder = lazy(() => import("../admin/order/page"));
const LazyInvoice = lazy(() => import("../admin/invoice/page"));
const LazyReceipts = lazy(() => import("../admin/receipts/page"));
const LazyAdminDashboard = lazy(() => import("../admin/dashboard/page"));
const LazyJob = lazy(() => import("../admin/Jobs/page"));
const LazyCheque = lazy(() => import("../admin/cheque/page"));
const LazyInvoiceReport = lazy(
  () => import("../admin/reports/invoice-reports/page")
);
const LazyUser = lazy(() => import("../admin/users/page"));
const LazyRoute = lazy(() => import("../admin/routes/page"));
const LazyExpence = lazy(() => import("../admin/expense/page"));
const LazyWastedJobs = lazy(() => import("../admin/wastedJobs/page"));

export default function Dashboard() {
  const [selectTab, setSelectTab] = useState<string>("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { SubMenu } = Menu;
  const { userRole, logout } = useContext(UserContext);
  const router = useRouter();

  const handleMenuClick = (openKeys: string[]) => {
    const latestOpenKey = openKeys[openKeys.length - 1];
    setOpenKeys([latestOpenKey]);
  };

  const text = "Are you sure you want to logout?";

  const confirm = () => {
    logout();
  };

  const content = (
    <div>
      <Popconfirm
        placement="leftTop"
        title={text}
        okText="Yes"
        onConfirm={confirm}
        cancelText="No"
        okButtonProps={{ style: { background: "red" } }}
      >
        <Button>Logout</Button>
      </Popconfirm>
    </div>
  );

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth="0"
        breakpoint="lg"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="logo"
          style={{
            height: "64px",
            background: "rgba(255, 255, 255, 0.2)",
            margin: "16px",
          }}
        >
          {/* Your logo content goes here */}
          <img
            src="null.png"
            alt="Logo"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          subMenuCloseDelay={0.1}
          openKeys={openKeys}
          onOpenChange={handleMenuClick}
        >
          <Menu.Item
            key="1"
            icon={<AreaChartOutlined />}
            onClick={() => setSelectTab("Dashboard")}
          >
            Dashboard
          </Menu.Item>
          <SubMenu key="2" icon={<AreaChartOutlined />} title="Sales">
            <Menu.Item key="2.0" onClick={() => setSelectTab("Jobs")}>
              Jobs
            </Menu.Item>
            {/* <Menu.Item key="2.1" onClick={() => setSelectTab("Orders")}>
              Orders
            </Menu.Item> */}

            <Menu.Item key="2.3" onClick={() => setSelectTab("Customer")}>
              Customers
            </Menu.Item>
            <Menu.Item key="2.2" onClick={() => setSelectTab("Wasted")}>
              Wasted Jobs
            </Menu.Item>
          </SubMenu>
          <SubMenu key="3" icon={<DollarOutlined />} title="Account">
            <Menu.Item
              key="3.2"
              onClick={() => {
                setSelectTab("Invoices");
              }}
            >
              Invoices
            </Menu.Item>

            <Menu.Item
              key="3.3"
              onClick={() => {
                setSelectTab("Receipts");
              }}
            >
              Receipts
            </Menu.Item>
            <Menu.Item
              key="3.4"
              onClick={() => {
                setSelectTab("Cheque");
              }}
            >
              Cheque
            </Menu.Item>
          </SubMenu>
          <SubMenu key="4" icon={<CodeSandboxOutlined />} title="Inventory">
            <Menu.Item
              key="Categories"
              onClick={() => setSelectTab("Categories")}
            >
              Stock Category
            </Menu.Item>
            <Menu.Item key="4.2" onClick={() => setSelectTab("Items")}>
              Stock Items
            </Menu.Item>
            <Menu.Item key="4.3" onClick={() => setSelectTab("Grn")}>
              GRN
            </Menu.Item>
          </SubMenu>
          <SubMenu key="5" icon={<BarChartOutlined />} title="Reports">
            <Menu.Item
              key="reports"
              onClick={() => setSelectTab("Invoice Report")}
            >
              Invoice Reports
            </Menu.Item>
          </SubMenu>
          <SubMenu key="6" icon={<UserAddOutlined />} title="Company">
            <Menu.Item key="users" onClick={() => setSelectTab("User")}>
              Users
            </Menu.Item>
            <Menu.Item key="routes" onClick={() => setSelectTab("Route")}>
              Routes
            </Menu.Item>
            <Menu.Item key="expences" onClick={() => setSelectTab("Expenses")}>
              Expenses
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <div className="flex items-center justify-between w-full pr-5">
            <div className="flex items-center">
              <Button
                type="text"
                icon={
                  collapsed ? (
                    <MenuUnfoldOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                  ) : (
                    <MenuFoldOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                  )
                }
                onClick={() => setCollapsed(!collapsed)}
              />
              <h1 className="text-xl ml-4 text-white">{selectTab}</h1>
            </div>
            <h1 className="text-xl text-white pt-2">
              {userRole && (
                <div className="flex items-center">
                  <p className="text-white pr-2">{userRole}</p>
                  {/* <Dropdown menu={{ items }} className="pr-5">
                <a onClick={(e) => e.preventDefault()}>
                    <DownOutlined style={{ fontSize: "14px" }} />
                </a>
              </Dropdown> */}
                  <Popover placement="bottom" content={content}>
                    <Tooltip placement="top">
                      <Avatar
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                        size={40}
                      />
                    </Tooltip>
                  </Popover>
                </div>
              )}
            </h1>
          </div>
        </Header>

        <Content>
          {selectTab === "Dashboard" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyAdminDashboard />
            </Suspense>
          ) : null}
          {selectTab === "Customer" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyCustomer />
            </Suspense>
          ) : null}
          {selectTab === "Categories" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyCategory />
            </Suspense>
          ) : null}
          {selectTab === "Items" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyItem />
            </Suspense>
          ) : null}
          {selectTab === "Grn" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyGrn />
            </Suspense>
          ) : null}
          {selectTab === "Orders" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyOrder />
            </Suspense>
          ) : null}
          {selectTab === "Jobs" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyJob />
            </Suspense>
          ) : null}
          {selectTab === "Invoices" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyInvoice />
            </Suspense>
          ) : null}
          {selectTab === "Receipts" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyReceipts />
            </Suspense>
          ) : null}
          {selectTab === "Cheque" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyCheque />
            </Suspense>
          ) : null}
          {selectTab === "Invoice Report" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyInvoiceReport />
            </Suspense>
          ) : null}
          {selectTab === "User" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyUser />
            </Suspense>
          ) : null}
          {selectTab === "Route" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyRoute />
            </Suspense>
          ) : null}
          {selectTab === "Expenses" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyExpence />
            </Suspense>
          ) : null}
          {selectTab === "Wasted" ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyWastedJobs />
            </Suspense>
          ) : null}
        </Content>
      </Layout>
    </Layout>
  );
}
