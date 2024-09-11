import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input } from "antd";
import * as linesService from "../../services/lines";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";

const Line = () => {
  const initialLinesState = {
    name: "",
    description: "",
  };
  const [line, setLine] = useState(initialLinesState);
  const [currentPage, setCurrentPage] = useState(1);
  const [lines, setLines] = useState([]);
  const [changedLines, setChangedLines] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newLines = [...lines];
    const index = newLines.findIndex((item) => key === item.key);
    newLines[index][column] = e.target.value;
    setLines(newLines);

    setChangedLines((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newLines[index]];
      }
      return prev.map((item) => (item.key === key ? newLines[index] : item));
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "line_code",
      key: "line_code",
      width: "6%",
      ...getColumnSearch("line_code"),
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
    setLine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = useCallback(async () => {
    try {
      const response = await linesService.index(line);
      const data = response?.map((line, index) => ({
        ...line,
        key: index,
      }));
      setLines(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching lines: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [line]);

  const handleSave = useCallback(async () => {
    try {
      if (changedLines.length > 0) {
        for (const line of changedLines) {
          if (line && line.name) {
            const res = await linesService.update(line.id, line);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedLines([]);
      } else {
        if (line && line.name) {
          const data = await linesService.store(line);
          console.log(data);

          const newLine = {
            ...data,
            key: data.id,
          };
          setLines([newLine]);
          handleClear();
          Message("success", "Add new line success");
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
  }, [line, changedLines, lines, Message]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await linesService.destroy(id);
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
    setLine(initialLinesState);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(line);
  }, [line, form]);

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
              value={line.name}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              value={line.description}
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
            total: lines.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={lines}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Line;
