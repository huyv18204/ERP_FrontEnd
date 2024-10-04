import React, { useState } from "react";
import { login } from "../../services/auth";
import { Form, Input, Button } from "antd";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      console.log(response);

      window.location.href = "/erp-system/dashboard";
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: "50px" }}>
      <h2>Đăng Nhập</h2>
      <Form name="login" initialValues={{ remember: true }} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Enter Email!" }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          label="Mật Khẩu"
          name="password"
          rules={[{ required: true, message: "Enter Password!" }]}
        >
          <Input.Password
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button onClick={handleLogin} type="primary" htmlType="submit" block>
            LogIn
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
