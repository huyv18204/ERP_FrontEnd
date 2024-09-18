import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useDispatch } from "react-redux";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as employeeService from "../../services/sale_orders";
import * as customerService from "../../services/customers";
import { useMessage } from "../../hooks/useMessage";
import BtnNew from "../../components/Button/BtnNew";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnAddRow from "../../components/Button/BtnAddRow";
import BtnModal from "../../components/Button/BtnModal";
import {
  openModalProductItem,
  openModalProductProcess,
} from "../../redux/actions/modalAction";
import SizeColorModal from "./components/SizeColorModal";
import ProcessModal from "./components/ProcessModal";

const SaleOrderRegister = () => {
  const dispatch = useDispatch();
  const handleShowModalProductItem = (key) => {
    const dataFillter = saleOrderItems.filter((item) => item.key === key);
    dispatch(openModalProductItem(dataFillter));
  };
  const handleShowModalProcess = (key) => {
    const dataFillter = saleOrderItems.filter((item) => item.key === key);
    dispatch(openModalProductProcess(dataFillter));
  };

  const initialSaleOrderState = {
    customer_id: null,
    order_date: "",
    saleOrderItem: [],
  };

  const initialSaleOrderItemState = [
    {
      key: 1,
      product: "",
      unit_price: null,
      delivery_date: "",
      description: "",
    },
    {
      key: 2,
      product: "",
      unit_price: null,
      delivery_date: "",
      description: "",
    },
  ];

  const [saleOrder, setSaleOrder] = useState(initialSaleOrderState);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [saleOrderItems, setSaleOrderItems] = useState(
    initialSaleOrderItemState
  );
  const [customers, setCustomers] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newSaleOrders = [...saleOrderItems];
    const index = newSaleOrders.findIndex((item) => key === item.key);
    newSaleOrders[index][column] = e.target.value;
    setSaleOrderItems(newSaleOrders);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product",
      key: "product",
      width: "16%",
      ...getColumnSearch("product"),
      render: (value, record) => (
        <Input
          className={isSaved ? "no-border" : ""}
          readOnly={isSaved}
          name={`product[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "product")}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      width: "16%",
      ...getColumnSearch("unit_price"),
      render: (value, record) => (
        <Input
          className={isSaved ? "no-border" : ""}
          readOnly={isSaved}
          name={`unit_price[${record.key}]`}
          type="number"
          min={0}
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "unit_price")}
        />
      ),
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      key: "delivery_date",
      width: "15%",
      ...getColumnSearch("delivery_date"),
      render: (value, record) => (
        <Input
          className={isSaved ? "no-border" : ""}
          readOnly={isSaved}
          name={`delivery_date[${record.key}]`}
          type="date"
          value={value}
          onChange={(e) =>
            handleInputTableChange(e, record.key, "delivery_date")
          }
        />
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearch("description"),
      render: (value, record) => (
        <Input
          className={isSaved ? "no-border" : ""}
          readOnly={isSaved}
          name={`description[${record.key}]`}
          type="text"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "description")}
        />
      ),
    },

    {
      className: "text-center",
      title: "Quantity",
      key: "product_item",
      render: (value, record) => (
        <BtnModal
          disabled={isSaved === false}
          event={() => handleShowModalProductItem(record.key)}
        />
      ),
    },

    {
      className: "text-center",
      title: "Routing",
      key: "process_id",
      render: (value, record) => (
        <BtnModal disabled={isSaved === false} event={handleShowModalProcess} />
      ),
    },

    {
      className: "text-center",
      title: "NG",
      key: "ng_type_id",
      ...getColumnSearch("product_item"),
      render: (value, record) => (
        <BtnModal
          disabled={isSaved === false}
          event={handleShowModalProductItem}
        />
      ),
    },

    {
      title: "Action",
      key: "operation",
      width: "7%",
      className: "text-center",
      fixed: "right",
      render: (_, record) => (
        <BtnDelete disabled={isSaved} event={() => handleDelete(record.key)} />
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  const handleSave = useCallback(async () => {
    try {
      if (
        saleOrder &&
        saleOrder.customer_id &&
        saleOrder.order_date &&
        saleOrderItems &&
        saleOrderItems[0].product &&
        saleOrderItems[0].unit_price
      ) {
        const response = await employeeService.store({
          ...saleOrder,
          saleOrderItem: [...saleOrderItems],
        });
        setSaleOrderItems(response.data.sale_order_item);

        setIsSaved(true);
        Message(response.type, response.message);
      } else {
        Message("error", "Please fill in required fields");
      }
    } catch (error) {
      Message(
        "error",
        "Error saving data: " +
          (error.response ? error.response.data : error.message)
      );
    }
  }, [saleOrder, saleOrderItems]);

  const handleDelete = (key) => {
    const updatedSaleOrders = saleOrderItems.filter((item) => item.key !== key);
    setSaleOrderItems(updatedSaleOrders);
  };

  const handleNew = () => {
    setIsSaved(false);
    setSaleOrderItems(initialSaleOrderItemState);
    setSaleOrder(initialSaleOrderState);
    form.resetFields();
  };

  const getCustomer = async () => {
    const data = await customerService.index();
    setCustomers(data);
  };

  const handleAddRow = async () => {
    const newKey = saleOrderItems.length + 1;
    const newRow = {
      key: newKey,
      product: "",
      unit_price: null,
      description: "",
      delivery_date: "",
    };

    setSaleOrderItems([...saleOrderItems, newRow]);
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
        <BtnNew event={handleNew} />
        <BtnSave className="ms-2" event={handleSave} />
        <BtnAddRow className="ms-2" event={handleAddRow} />
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
                message: "Please input customer",
              },
            ]}
            name="customer"
            label="Customer"
            className="py-2"
          >
            <Select
              disabled={isSaved}
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
            rules={[
              {
                required: true,
                message: "Please input customer",
              },
            ]}
            name="order_date"
            label="Order Date"
            className="py-2"
          >
            <Input
              readOnly={isSaved}
              name="order_date"
              onChange={handleInputFormChange}
              type="date"
              value={saleOrder.order_date}
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
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: saleOrderItems.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={saleOrderItems}
        />
      </Content>

      {contextHolder}

      <ProcessModal />
      <SizeColorModal />
    </div>
  );
};

export default SaleOrderRegister;
