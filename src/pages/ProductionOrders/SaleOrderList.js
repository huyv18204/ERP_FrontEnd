import React, { useEffect, useState } from "react";
import { Layout, theme, Table } from "antd";
import { useDispatch } from "react-redux";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as customerService from "../../services/customers";
import * as saleOrderService from "../../services/sale_orders";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnModal from "../../components/Button/BtnModal";
import {
  openModalProductItem,
  openModalProductNG,
  openModalProductProcess,
} from "../../redux/actions/modalAction";
import SizeColorModal from "./components/SizeColorModal";
import ProcessModal from "./components/ProcessModal";
import NGModal from "./components/NGModal.js";
import BtnQuery from "../../components/Button/BtnQuery.js";

const SaleOrderList = () => {
  const initialSaleOrderState = {
    customer_id: null,
    start_order_date: "",
    end_order_date: "",
  };
  const [saleOrder, setSaleOrder] = useState(initialSaleOrderState);
  const [saleOrders, setSaleOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();
  const handleShowModalProductItem = (record) => {
    dispatch(
      openModalProductItem([
        { id: record.id, code: record.code, product: record.product },
      ])
    );
  };
  const handleShowModalProcess = (record) => {
    dispatch(
      openModalProductProcess([
        { id: record.id, code: record.code, product: record.product },
      ])
    );
  };

  const handleShowModalNG = (record) => {
    dispatch(
      openModalProductNG([
        { id: record.id, code: record.code, product: record.product },
      ])
    );
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "No.",
        dataIndex: "code",
        key: "code",
        width: "8%",
        ...getColumnSearch("code"),
        fixed: "left",
      },
      {
        title: "Product",
        dataIndex: "product_name",
        key: "product_name",
        width: "10%",
        ...getColumnSearch("product_name"),
      },
      {
        title: "Unit Price",
        dataIndex: "unit_price",
        key: "unit_price",
        width: "10%",
        ...getColumnSearch("unit_price"),
      },
      // {
      //   title: "Total",
      //   dataIndex: "total",
      //   key: "total",
      //   width: "10%",
      // },

      // {
      //   title: "Price",
      //   dataIndex: "price",
      //   key: "price",
      //   width: "10%",
      // },

      {
        title: "Delivery Date",
        dataIndex: "delivery_date",
        key: "delivery_date",
        width: "10%",
      },

      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "10%",
      },

      {
        className: "text-center",
        title: "Quantity",
        key: "product_item",
        width: "6%",
        fixed: "right",
        render: (value, record) => (
          <div>
            <BtnModal event={() => handleShowModalProductItem(record)} />
          </div>
        ),
      },

      {
        className: "text-center",
        title: "Routing",
        key: "process_id",
        width: "6%",
        fixed: "right",
        render: (value, record) => (
          <BtnModal event={() => handleShowModalProcess(record)} />
        ),
      },

      {
        className: "text-center",
        title: "NG",
        key: "ng_type_id",
        width: "6%",
        fixed: "right",
        render: (value, record) => (
          <BtnModal event={() => handleShowModalNG(record)} />
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.sale_order_items.map((item) => ({
          key: item.id,
          product_name: item.product.name,
          unit_price: item.product.unit_price,
          // total:
          //   item.product_items && item.product_items.length > 0
          //     ? item.product_items[0].total
          //     : 0,
          // price:
          //   (item.product_items && item.product_items.length > 0
          //     ? +item.product_items[0].total
          //     : 0) * item.unit_price,
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
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      width: "25%",
      ...getColumnSearch("customer"),
    },

    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      width: "20%",
    },

    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
      width: "20%",
    },

    {
      title: "Action",
      key: "operation",
      width: "15%",
      className: "text-center",
      render: (_, record) => (
        <BtnDelete event={() => handleDelete(record.id)} />
      ),
    },
  ];

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setSaleOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionFormChange = (value) => {
    setSaleOrder((prev) => ({
      ...prev,
      customer_id: value,
    }));
  };

  const handleDelete = async (id) => {
    const response = await saleOrderService.destroy(id);
    const dataFillter = saleOrders.filter((item) => item.id !== id);
    setSaleOrders(dataFillter);
    Message(response.type, response.message);
  };

  const handleClear = () => {
    setSaleOrder(initialSaleOrderState);
    form.resetFields();
  };

  const handleQuery = async () => {
    const saleOrders = await saleOrderService.index(saleOrder);

    const dataSaleOrder = saleOrders?.map((saleOrder, index) => ({
      ...saleOrder,
      key: saleOrder.id,
      customer: saleOrder.customer.name,
    }));
    console.log(dataSaleOrder);

    setSaleOrders(dataSaleOrder);
  };

  const getCustomer = async () => {
    const data = await customerService.index();
    setCustomers(data);
  };

  useEffect(() => {
    getCustomer();
  }, []);

  useEffect(() => {
    form.setFieldsValue(saleOrder);
  }, [saleOrder, form]);
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
          <Form.Item name="customer" label="Customer" className="py-2">
            <Select
              style={{ width: 180 }}
              name="customer_id"
              placeholder="Select a customer"
              onChange={handleOptionFormChange}
              allowClear
            >
              {customers.map((item) => (
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
              value={saleOrder.start_order_date}
            />
          </Form.Item>

          <Form.Item name="end_order_date" label="To" className="py-2">
            <Input
              name="end_order_date"
              onChange={handleInputFormChange}
              type="date"
              value={saleOrder.end_order_date}
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
            pageSize: 8,
            total: saleOrders.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={saleOrders.length > 0 ? saleOrders : []}
        />
      </Content>

      {contextHolder}

      <ProcessModal />
      <SizeColorModal />
      <NGModal />
    </div>
  );
};

export default SaleOrderList;
