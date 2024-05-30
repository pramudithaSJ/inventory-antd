"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Form, Input, message, Button } from "antd";
import { useState, useContext } from "react";

import { jwtDecode } from "jwt-decode";
import { UserContext, User } from "@/context/user-context";
import { log } from "console";

const BaseUrl = process.env.BASE_URL;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const { login, userRole, loading } = useContext(UserContext);

  const onFinish = (values: User) => {
    login(values);
  };

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-center shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-900 my-5">
          Admin Login
        </h2>
        <div className="w-full">
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
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
              <Button loading={loading} htmlType="submit" className="w-full">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </main>
  );
}
