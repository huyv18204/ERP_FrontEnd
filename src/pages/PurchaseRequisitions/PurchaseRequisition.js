import React, { useEffect, useState } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Tag } from "antd";
import * as PRService from "../../services/purchase_requisitions";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery.js";
import BtnClose from "../../components/Button/BtnClose.js";
import { useDispatch } from "react-redux";
import BtnJump from "../../components/Button/BtnJump.js";
import { jumpPORegister } from "../../redux/actions/purchaseOrderAction.js";

const RequisitionOrder = () => {
  const initialState = {
    start_create_date: "",
    end_create_date: "",
    code: "",
  };
  const [PR, setPR] = useState(initialState);
  const [PRs, setPRs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys);

    setSelectedRowKeys(newSelectedRowKeys);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Material",
        dataIndex: "material_code",
        key: "material_code",
        width: "10%",
        ...getColumnSearch("material_code"),
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
        dataSource={record.purchase_requisition_items.map((item) => ({
          key: item.id,
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
      width: "20%",
      ...getColumnSearch("code"),
      fixed: "left",
    },

    {
      title: "Create Date",
      dataIndex: "create_date",
      key: "create_date",
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
      render: (_, record) => <Tag color="success">{record.status}</Tag>,
    },

    {
      title: "Action",
      key: "operation",
      width: "10%",
      className: "text-center",
      render: (_, record) => (
        <>
          {record.status === "Pending" && (
            <BtnClose className="ms-2" event={() => handleReject(record.id)} />
          )}
        </>
      ),
    },
  ];

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setPR((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReject = async (id) => {
    const response = await PRService.destroy(id);
    const dataFillter = PRs.filter((item) => item.id !== id);
    setPRs(dataFillter);
    Message(response.type, response.message);
  };

  const handleClear = () => {
    setPR(initialState);
    form.resetFields();
  };

  const handleQuery = async () => {
    const PRs = await PRService.index(PR);

    const dataWHEntry = PRs?.map((PR, index) => ({
      ...PR,
      key: PR.id,
    }));
    console.log(dataWHEntry);

    setPRs(dataWHEntry);
  };

  const handleJump = () => {
    const fillterDate = PRs.filter((_, index) =>
      selectedRowKeys.includes(_.key)
    );
    dispatch(
      jumpPORegister({
        selectedRowKeys: selectedRowKeys,
        PRs: fillterDate,
      })
    );
  };

  useEffect(() => {
    form.setFieldsValue(PR);
  }, [PR, form]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.status !== "Pending",
    }),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
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
        <BtnJump
          className="ms-2"
          title="Production Order Register"
          to="/erp-system/purchase-orders/register"
          onClick={handleJump}
        />
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
              value={PR.code}
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
              value={PR.start_create_date}
            />
          </Form.Item>

          <Form.Item name="end_create_date" label="To" className="py-2">
            <Input
              name="end_create_date"
              onChange={handleInputFormChange}
              type="date"
              value={PR.end_create_date}
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
          rowSelection={rowSelection}
          size="small"
          expandable={{
            expandedRowRender,
          }}
          pagination={{
            current: currentPage,
            pageSize: 7,
            total: PRs.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={PRs.length > 0 ? PRs : []}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default RequisitionOrder;
