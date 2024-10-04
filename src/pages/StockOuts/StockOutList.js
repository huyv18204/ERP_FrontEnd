import React, { useEffect, useState } from "react";
import { Layout, theme, Table, Button } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Tag } from "antd";
import { ImportOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as WHEntriesService from "../../services/stock_outs";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnQuery from "../../components/Button/BtnQuery.js";
import BtnEdit from "../../components/Button/BtnEdit.js";
import { useDispatch } from "react-redux";
import {
  jumpSOCreate,
  jumpSOExport,
} from "../../redux/actions/warehouseAction.js";

const WarehouseEntryList = () => {
  const initialSaleOrderState = {
    start_create_date: "",
    end_create_date: "",
    code: "",
  };
  const [WHEntry, setWHEntry] = useState(initialSaleOrderState);
  const [WHEntries, setWHEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Material",
        dataIndex: "material_name",
        key: "material_name",
        width: "10%",
        ...getColumnSearch("material_name"),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        width: "10%",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.stock_out_items.map((item) => ({
          key: item.id,
          material_name: item.material.name,
          ...item,
        }))}
        pagination={false}
      />
    );
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "code",
      key: "code",
      width: "15%",
      ...getColumnSearch("code"),
      fixed: "left",
    },

    {
      title: "Create Date",
      dataIndex: "out_date",
      key: "out_date",
      width: "20%",
    },

    {
      title: "Note",
      dataIndex: "notes",
      key: "notes",
      width: "25%",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (_, record) => (
        <Tag color={record.status ? "success" : "error"}>
          {record.status ? "completed" : "incompleted"}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "operation",
      width: "10%",
      className: "text-center",
      render: (_, record) => (
        <>
          {!record.status && (
            <div className="d-flex">
              <Button onClick={() => handleJump(record)}>
                <Link to="/erp-system/warehouses/export">
                  <ImportOutlined />
                </Link>
              </Button>
              <BtnEdit
                className="ms-2"
                onClick={() => handleEdit(record)}
                to="/erp-system/stock-outs/create"
              />
              <BtnDelete
                className="ms-2"
                event={() => handleDelete(record.id)}
              />
            </div>
          )}
        </>
      ),
    },
  ];

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setWHEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDelete = async (id) => {
    const response = await WHEntriesService.destroy(id);
    const dataFillter = WHEntries.filter((item) => item.id !== id);
    setWHEntries(dataFillter);
    Message(response.type, response.message);
  };

  const handleClear = () => {
    setWHEntry(initialSaleOrderState);
    form.resetFields();
  };

  const handleQuery = async () => {
    const WHEntries = await WHEntriesService.index(WHEntry);

    const dataWHEntry = WHEntries?.map((WHEntry, index) => ({
      ...WHEntry,
      key: WHEntry.id,
    }));

    setWHEntries(dataWHEntry);
  };

  const handleJump = (record) => {
    const WHEntryDetail = record.stock_out_items.map((item) => ({
      ...item,
      key: item.id,
    }));
    dispatch(jumpSOExport(WHEntryDetail));
  };

  const handleEdit = (record) => {
    dispatch(jumpSOCreate(record));
  };

  useEffect(() => {
    form.setFieldsValue(WHEntry);
  }, [WHEntry, form]);
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
          <Form.Item name="code" label="Code" className="py-2">
            <Input
              name="code"
              onChange={handleInputFormChange}
              type="text"
              value={WHEntry.code}
            />
          </Form.Item>

          <Form.Item
            name="start_create_date"
            label="Create Date"
            className="py-2"
          >
            <Input
              name="start_create_date"
              onChange={handleInputFormChange}
              type="date"
              value={WHEntry.start_create_date}
            />
          </Form.Item>

          <Form.Item name="end_create_date" label="To" className="py-2">
            <Input
              name="end_create_date"
              onChange={handleInputFormChange}
              type="date"
              value={WHEntry.end_create_date}
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
          // minHeight: 510,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Table
          size="small"
          expandable={{
            expandedRowRender,
          }}
          pagination={{
            current: currentPage,
            pageSize: 7,
            total: WHEntries.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={WHEntries.length > 0 ? WHEntries : []}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default WarehouseEntryList;
