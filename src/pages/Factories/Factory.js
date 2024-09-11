import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as factoriesService from "../../services/factories";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";

const Factory = () => {
  const initialFactoriesState = {
    name: "",
    description: "",
  };
  const [factory, setFactory] = useState(initialFactoriesState);
  const [currentPage, setCurrentPage] = useState(1);
  const [factories, setFactories] = useState([]);
  const [changedFactories, setChangedFactories] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newFactories = [...factories];
    const index = newFactories.findIndex((item) => key === item.key);
    newFactories[index][column] = e.target.value;
    setFactories(newFactories);

    setChangedFactories((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newFactories[index]];
      }
      return prev.map((item) =>
        item.key === key ? newFactories[index] : item
      );
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "factory_code",
      key: "factory_code",
      width: "6%",
      ...getColumnSearch("factory_code"),
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
    setFactory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = useCallback(async () => {
    try {
      const response = await factoriesService.index(factory);
      const data = response?.map((factory, index) => ({
        ...factory,
        key: index,
      }));
      setFactories(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching factories: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [factory]);

  const handleSave = useCallback(async () => {
    try {
      if (changedFactories.length > 0) {
        for (const factory of changedFactories) {
          if (factory && factory.name) {
            const res = await factoriesService.update(factory.id, factory);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedFactories([]);
      } else {
        if (factory && factory.name) {
          const data = await factoriesService.store(factory);
          console.log(data);

          const newLine = {
            ...data,
            key: data.id,
          };
          setFactories([newLine]);
          handleClear();
          Message("success", "Add new factory success");
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
  }, [factory, changedFactories, factories, Message]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await factoriesService.destroy(id);
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
    setFactory(initialFactoriesState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(factory);
  }, [factory, form]);

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
              value={factory.name}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              value={factory.description}
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
            total: factories.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={factories}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Factory;
