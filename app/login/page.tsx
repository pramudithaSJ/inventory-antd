"use client";

// import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Form, Input, message, Space, Button } from "antd";
import { useState } from "react";
const BaseUrl = process.env.BASE_URL;

export default function Login() {
  const [form] = Form.useForm();

  //   const login = (values: any) => {
  //     console.log(values.username);

  //     axios
  //       .post(`${BaseUrl}/user/login`)
  //       .then((res) => {
  //         if (res.data.status === "success") {
  //           Cookies.set("token", res.data.token);
  //         } else {
  //           message.error(res.data.message);
  //         }
  //       })
  //       .catch((err) => {
  //         message.error(err.message);
  //       });

  return (
    <main className="w-full  h-screen flex justify-center items-center">
      <div className="w-1/3 flex items-center shadow-lg h-1/2 rounded-lg">
        <div className=" w-full">
          <h2 className="text-3xl font-semibold text-gray-900 mx-10 my-5 ">
            Admin Login
          </h2>

          <div className=" mx-10">
            <Form
              form={form}
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              onFinish={(values: any) => {
                // login(values);
                console.log(values);
              }}
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
