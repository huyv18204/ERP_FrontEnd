import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as ngsService from "../../services/ngs";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";

const NG = () => {
  const initialNGsState = {
    name: "",
    description: "",
  };
  const [ng, setNg] = useState(initialNGsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [ngs, setNgs] = useState([]);
  const [changedNgs, setChangedNgs] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newNgs = [...ngs];
    const index = newNgs.findIndex((item) => key === item.key);
    newNgs[index][column] = e.target.value;
    setNgs(newNgs);

    setChangedNgs((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newNgs[index]];
      }
      return prev.map((item) => (item.key === key ? newNgs[index] : item));
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "ng_code",
      key: "ng_code",
      width: "6%",
      ...getColumnSearch("ng_code"),
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
    setNg((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = useCallback(async () => {
    try {
      const response = await ngsService.index(ng);
      const data = response?.map((ng, index) => ({
        ...ng,
        key: index,
      }));
      setNgs(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching ngs: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [ng]);

  const handleSave = useCallback(async () => {
    try {
      if (changedNgs.length > 0) {
        for (const ng of changedNgs) {
          if (ng && ng.name) {
            const res = await ngsService.update(ng.id, ng);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedNgs([]);
      } else {
        if (ng && ng.name) {
          const data = await ngsService.store(ng);
          const newNg = {
            ...data,
            key: data.id,
          };
          setNgs([newNg]);
          handleClear();
          Message("success", "Add new NG success");
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
  }, [ng, changedNgs, ngs, Message]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await ngsService.destroy(id);
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
    setNg(initialNGsState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(ng);
  }, [ng, form]);

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
              value={ng.name}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              value={ng.description}
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
            total: ngs.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={ngs}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default NG;
