import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as menusService from "../../services/menus";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
const Menu = () => {
  const initialMenuState = {
    label: "",
    parent: "",
    icon: "",
  };
  const [menu, setMenu] = useState(initialMenuState);
  const [currentPage, setCurrentPage] = useState(1);
  const [menus, setMenus] = useState([]);
  const [menusRoot, setMenusRoot] = useState([]);
  const [changedMenus, setChangedMenus] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newMenus = [...menus];
    const index = newMenus.findIndex((item) => key === item.key);
    newMenus[index][column] = e.target.value;
    setMenus(newMenus);

    // Cập nhật danh sách các bản ghi đã thay đổi
    setChangedMenus((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newMenus[index]];
      }
      return prev.map((item) => (item.key === key ? newMenus[index] : item));
    });
  };

  const handleOptionTableChange = (value, key, column) => {
    const newMenus = [...menus];
    const index = newMenus.findIndex((item) => key === item.key);
    if (index !== -1) {
      newMenus[index][column] = value;
      setMenus(newMenus);

      setChangedMenus((prev) => {
        const isExisting = prev.some((item) => item.key === key);
        if (!isExisting) {
          return [...prev, newMenus[index]];
        }
        return prev.map((item) => (item.key === key ? newMenus[index] : item));
      });
    }
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: "16%",
      ...getColumnSearch("label"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`label[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "label")}
        />
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      width: "15%",
      ...getColumnSearch("url"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`url[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "url")}
        />
      ),
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: "12%",
      ...getColumnSearch("icon"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`icon[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "icon")}
        />
      ),
    },
    {
      title: "Parent",
      dataIndex: "parent",
      key: "parent",
      width: "8%",
      ...getColumnSearch("parent"),
      render: (value, record) => (
        <Select
          name={`parent[${record.key}]`}
          placeholder="Select a parent"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "parent")
          }
          allowClear
          value={record.parent}
          style={{ minWidth: 250 }}
        >
          {menusRoot.map((item) => (
            <Option key={item.key} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
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
    setMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionFormChange = (value) => {
    setMenu((prev) => ({
      ...prev,
      parent: value,
    }));
  };

  const handleQuery = async () => {
    try {
      const response = await menusService.index(menu);
      const data = response?.map((menu, index) => ({
        ...menu,
        key: index,
      }));
      console.log(response);
      setMenus(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching menus: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (changedMenus.length > 0) {
        for (const menu of changedMenus) {
          if (menu && menu.label) {
            const res = await menusService.update(menu.id, menu);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedMenus([]);
      } else {
        if (menu && menu.label) {
          const data = await menusService.store(menu);
          const newEmployee = {
            ...data,
            key: data.id,
          };
          setMenus([newEmployee]);
          handleClear();
          Message("success", "Add new menu success");
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
  }, [menu, menus]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await menusService.destroy(id);
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
    [menus]
  );

  const handleClear = () => {
    setMenu(initialMenuState);
    form.resetFields();
  };

  const getMenuRoot = async () => {
    const data = await menusService.getMenuRoot();
    setMenusRoot(data);
  };

  useEffect(() => {
    getMenuRoot();
  }, []);

  useEffect(() => {
    form.setFieldsValue(menu);
  }, [menu, form]);

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
                message: "Please input label",
              },
            ]}
            name="label"
            label="Label"
            className="py-2"
          >
            <Input
              name="label"
              onChange={handleInputFormChange}
              type="text"
              value={menu.label}
              placeholder="Enter Name"
            />
          </Form.Item>
          <Form.Item name="url" label="URL" className="py-2">
            <Input
              name="url"
              onChange={handleInputFormChange}
              value={menu.url}
              placeholder="Enter URL"
            />
          </Form.Item>
          <Form.Item name="icon" label="Icon" className="py-2">
            <Input
              name="icon"
              onChange={handleInputFormChange}
              value={menu.icon}
              placeholder="Enter Icon"
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input parent",
              },
            ]}
            name="parent"
            label="Parent"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="parent"
              placeholder="Select a parent"
              onChange={handleOptionFormChange}
              allowClear
            >
              {menusRoot.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Content>

      <Content
        style={{
          margin: "18px 16px",
          padding: 24,
          paddingTop: 20,
          paddingBottom: 20,
          // minHeight: 510,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: menus.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={menus}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default Menu;
