import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as departmentService from "../../services/departments";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";

const Department = () => {
  const initialDepartmentsState = {
    name: "",
    description: "",
  };
  const [department, setDepartment] = useState(initialDepartmentsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [changedDepartments, setChangedDepartments] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newDepartments = [...departments];
    const index = newDepartments.findIndex((item) => key === item.key);
    newDepartments[index][column] = e.target.value;
    setDepartments(newDepartments);

    setChangedDepartments((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newDepartments[index]];
      }
      return prev.map((item) =>
        item.key === key ? newDepartments[index] : item
      );
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "department_code",
      key: "department_code",
      width: "6%",
      ...getColumnSearch("department_code"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "13%",
      ...getColumnSearch("name"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`name[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "name")}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "15%",
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`description[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "description")}
        />
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "7%",
      className: "text-center",
      render: (_, record) => (
        <BtnDelete event={() => handleDelete(record.id)} />
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = useCallback(async () => {
    try {
      const response = await departmentService.index(department);
      const data = response?.map((department, index) => ({
        ...department,
        key: index,
      }));
      setDepartments(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching departments: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [department]);

  const handleSave = useCallback(async () => {
    try {
      if (changedDepartments.length > 0) {
        for (const department of changedDepartments) {
          if (department && department.name) {
            const res = await departmentService.update(
              department.id,
              department
            );
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedDepartments([]);
      } else {
        if (department && department.name) {
          const data = await departmentService.store(department);
          console.log(data);

          const newDepartment = {
            ...data,
            key: data.department_code,
          };
          setDepartments([newDepartment]);
          handleClear();
          Message("success", "Add new department success");
        } else {
          Message("error", "Please fill in required fields");
        }
      }
    } catch (error) {
      Message(
        "error",
        "Error saving data: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [department, changedDepartments, departments, Message]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await departmentService.destroy(id);
        Message("success", "Delete success");
        handleQuery();
      } catch (error) {
        Message(
          "error",
          "Error deleting data: " +
            (error.response ? error.response.data : error.message)
        );
      }
    },
    [handleQuery, Message]
  );

  const handleClear = () => {
    setDepartment(initialDepartmentsState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(department);
  }, [department, form]);

  return (
    <div>
      <Content
        style={{
          margin: "10px 16px",
          padding: 10,
          paddingLeft: 24,
          minHeight: 10,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <BtnClear event={handleClear} />
        <BtnQuery className="ms-2" event={handleQuery} />
        <BtnSave className="ms-2" event={handleSave} />
      </Content>

      <Content
        style={{
          margin: "10px 16px",
          padding: 24,
          paddingTop: 15,
          paddingBottom: 15,
          minHeight: 100,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Form
          layout="inline"
          form={form}
          style={{
            maxWidth: "none",
          }}
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input name",
              },
            ]}
            name="name"
            label="Name"
            className="py-2"
          >
            <Input
              name="name"
              onChange={handleInputFormChange}
              type="text"
              value={department.name}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              value={department.description}
              placeholder="Enter Description"
            />
          </Form.Item>
        </Form>
      </Content>

      <Content
        style={{
          margin: "18px 16px",
          padding: 24,
          paddingTop: 20,
          paddingBottom: 20,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: departments.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={departments}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Department;
