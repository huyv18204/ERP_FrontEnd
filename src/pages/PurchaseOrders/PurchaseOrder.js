import React, { useEffect, useState } from "react";
import { Layout, theme, Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as suppliersService from "../../services/suppliers";
import * as POrdersService from "../../services/purchase_orders";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery.js";
import { jumpPDORegister } from "../../redux/actions/productionOrderAction.js";
import BtnCheckOut from "../../components/Button/BtnCheckOut.js";
import BtnJump from "../../components/Button/BtnJump.js";
import BtnClose from "../../components/Button/BtnClose.js";

const SaleOrderList = () => {
  const initialSaleOrderState = {
    supplier_id: null,
    start_order_date: "",
    end_order_date: "",
    code: "",
  };
  const [POrder, setPOrder] = useState(initialSaleOrderState);
  const [POrders, setPOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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

  const dispatch = useDispatch();
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Material",
        dataIndex: "material_name",
        key: "material_name",
        width: "15%",
        ...getColumnSearch("material_name"),
      },
      {
        title: "Unit Price",
        dataIndex: "unit_price",
        key: "unit_price",
        width: "10%",
        ...getColumnSearch("unit_price"),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        width: "10%",
      },

      {
        title: "Total Price",
        dataIndex: "total_price",
        key: "total_price",
        width: "10%",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.purchase_order_items.map((item) => ({
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
      width: "10%",
      ...getColumnSearch("code"),
      fixed: "left",
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: "25%",
      ...getColumnSearch("supplier"),
    },

    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      width: "20%",
    },

    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      width: "15%",
    },

    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      width: "15%",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "2 0%",
      render: (_, record) => <Tag color="success">{_}</Tag>,
    },

    {
      title: "Action",
      key: "operation",
      width: "15%",
      className: "text-center",
      render: (_, record) => (
        <div className="d-flex justify-content-center">
          {record.status === "Pending" && (
            <>
              <BtnCheckOut
                className="ms-2"
                event={() => handleUpdateStatus(record.id)}
              />
              <BtnClose
                className="ms-2"
                event={() => handleDelete(record.id)}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const handleUpdateStatus = async (id) => {
    await POrdersService.updateStatus(id, {
      status: "Approved",
    });
    handleQuery();
  };

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setPOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionFormChange = (value) => {
    setPOrder((prev) => ({
      ...prev,
      supplier_id: value,
    }));
  };

  const handleDelete = async (id) => {
    const response = await POrdersService.destroy(id);
    const dataFillter = POrders.filter((item) => item.id !== id);
    setPOrders(dataFillter);
    Message(response.type, response.message);
  };

  const handleClear = () => {
    setPOrder(initialSaleOrderState);
    form.resetFields();
  };

  const handleQuery = async () => {
    const POrders = await POrdersService.index(POrder);

    const dataSaleOrder = POrders?.map((POrder, index) => ({
      ...POrder,
      key: POrder.id,
      supplier: POrder.supplier.name,
    }));
    setPOrders(dataSaleOrder);
  };

  const handleJump = () => {
    const fillterDate = POrders.filter((_, index) =>
      selectedRowKeys.includes(index + 1)
    );
    dispatch(jumpPDORegister(fillterDate));
  };

  const getSuppliers = async () => {
    const data = await suppliersService.index();
    setSuppliers(data);
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  useEffect(() => {
    form.setFieldsValue(POrder);
  }, [POrder, form]);
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
          to="/erp-system/production-orders/register"
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
          <Form.Item name="code" label="No." className="py-2">
            <Input
              name="code"
              onChange={handleInputFormChange}
              type="text"
              value={POrder.code}
            />
          </Form.Item>
          <Form.Item name="supplier_id" label="Supplier" className="py-2">
            <Select
              style={{ width: 180 }}
              name="supplier_id"
              placeholder="Select a supplier"
              onChange={handleOptionFormChange}
              allowClear
            >
              {suppliers.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="start_order_date"
            label="Order Date"
            className="py-2"
          >
            <Input
              name="start_order_date"
              onChange={handleInputFormChange}
              type="date"
              value={POrder.start_order_date}
            />
          </Form.Item>

          <Form.Item name="end_order_date" label="To" className="py-2">
            <Input
              name="end_order_date"
              onChange={handleInputFormChange}
              type="date"
              value={POrder.end_order_date}
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
          rowSelection={rowSelection}
          pagination={{
            current: currentPage,
            pageSize: 8,
            total: POrders.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={POrders.length > 0 ? POrders : []}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default SaleOrderList;
