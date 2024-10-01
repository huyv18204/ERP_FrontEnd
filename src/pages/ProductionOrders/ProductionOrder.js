import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as PDOrdersService from "../../services/production_orders";
import * as linesService from "../../services/lines";
import * as factoriesService from "../../services/factories";
import * as productsService from "../../services/products";
import { useMessage } from "../../hooks/useMessage";
import BtnClear from "../../components/Button/BtnClear";
import BtnQuery from "../../components/Button/BtnQuery";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
const ProductionOrder = () => {
  const initialState = {
    product_id: null,
    line_id: null,
    factory_id: null,
    start_date: "",
    end_date: "",
    description: "",
    quantity: null,
  };
  const [PDOrder, setPDOrder] = useState(initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [PDOrders, setPDOrders] = useState([]);
  const [lines, setLines] = useState([]);
  const [factories, setFactories] = useState([]);
  const [product, setProduct] = useState([]);
  const [changedValue, setChangedValue] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const [form] = Form.useForm();
  const { Option } = Select;

  const handleInputTableChange = (e, key, column) => {
    const newValues = [...PDOrders];
    const index = newValues.findIndex((item) => key === item.key);
    newValues[index][column] = e.target.value;
    setPDOrders(newValues);

    setChangedValue((prev) => {
      const isExisting = prev.some((item) => item.key === key);
      if (!isExisting) {
        return [...prev, newValues[index]];
      }
      return prev.map((item) => (item.key === key ? newValues[index] : item));
    });
  };

  const handleOptionTableChange = (value, key, column) => {
    const newValues = [...PDOrders];
    const index = newValues.findIndex((item) => key === item.key);
    if (index !== -1) {
      newValues[index][column] = value;
      setPDOrders(newValues);

      setChangedValue((prev) => {
        const isExisting = prev.some((item) => item.key === key);
        if (!isExisting) {
          return [...prev, newValues[index]];
        }
        return prev.map((item) => (item.key === key ? newValues[index] : item));
      });
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product_id",
      key: "product_id",
      width: "16%",
      ...getColumnSearch("product_id"),
      render: (value, record) => (
        <Select
          className="input-no-border"
          name={`product_id[${record.key}]`}
          placeholder="Select a product"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "product_id")
          }
          allowClear
          value={record.product_id}
          style={{ width: 150 }}
        >
          {product.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "13%",
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`quantity[${record.id}]`}
          type="number"
          value={value}
          min={0}
          onChange={(e) => handleInputTableChange(e, record.key, "quantity")}
        />
      ),
    },
    {
      title: "Line",
      dataIndex: "line_id",
      key: "line_id",
      width: "16%",
      ...getColumnSearch("line_id"),
      render: (value, record) => (
        <Select
          className="input-no-border"
          name={`line_id[${record.key}]`}
          placeholder="Select a line"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "line_id")
          }
          allowClear
          value={record.line_id}
          style={{ width: 150 }}
        >
          {lines.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Factory",
      dataIndex: "factory_id",
      key: "factory_id",
      width: "16%",
      ...getColumnSearch("factory_id"),
      render: (value, record) => (
        <Select
          className="input-no-border"
          name={`factory_id[${record.key}]`}
          placeholder="Select a line"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "factory_id")
          }
          allowClear
          value={record.factory_id}
          style={{ width: 150 }}
        >
          {factories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      width: "15%",
      ...getColumnSearch("start_date"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`start_date[${record.key}]`}
          type="date"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "start_date")}
        />
      ),
    },

    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      width: "15%",
      ...getColumnSearch("end_date"),
      render: (value, record) => (
        <Input
          className="input-no-border"
          name={`end_date[${record.key}]`}
          type="date"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "end_date")}
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
      fixed: "right",
      render: (_, record) => (
        <BtnDelete event={() => handleDelete(record.id, record.key)} />
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setPDOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuery = async () => {
    try {
      const response = await PDOrdersService.index(PDOrder);
      const data = response?.map((PDOrder, index) => ({
        ...PDOrder,
        key: index,
      }));
      setPDOrders(data);
    } catch (error) {
      Message(
        "error",
        "Error fetching PDOrders: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleSave = useCallback(async () => {
    try {
      if (changedValue.length > 0) {
        for (const value of changedValue) {
          if (
            value &&
            value.product_id &&
            value.line_id &&
            value.factory_id &&
            value.quantity &&
            value.start_date &&
            value.end_date
          ) {
            const res = await PDOrdersService.update(value.id, value);
            Message("success", res.message);
          } else {
            Message("error", "Please fill in required fields");
          }
        }
        setChangedValue([]);
      } else {
        if (
          PDOrder &&
          PDOrder.product_id &&
          PDOrder.line_id &&
          PDOrder.factory_id &&
          PDOrder.quantity &&
          PDOrder.start_date &&
          PDOrder.end_date
        ) {
          const response = await PDOrdersService.store(PDOrder);

          console.log(response.data);
          setPDOrders([response.data]);
          Message(response.type, response.message);
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
  }, [PDOrder, PDOrders]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await PDOrdersService.destroy(id);
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
    [PDOrders]
  );

  const handleOptionFormChange = (name, value) => {
    setPDOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setPDOrder(initialState);
    form.resetFields();
  };

  const getLines = async () => {
    const data = await linesService.index();
    setLines(data);
  };

  const getFactories = async () => {
    const data = await factoriesService.index();
    setFactories(data);
  };

  const getProduct = async () => {
    const data = await productsService.index();
    setProduct(data);
  };

  useEffect(() => {
    getFactories();
    getLines();
    getProduct();
  }, []);

  useEffect(() => {
    form.setFieldsValue(PDOrder);
  }, [PDOrder, form]);
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
                message: "Please input product",
              },
            ]}
            name="product_id"
            label="Product"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="product_id"
              placeholder="Select a product"
              onChange={(value) => handleOptionFormChange("product_id", value)}
              allowClear
            >
              {product.map((item) => (
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
                message: "Please input factory",
              },
            ]}
            name="factory_id"
            label="Factory"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="factory_id"
              placeholder="Select a factory"
              onChange={(value) => handleOptionFormChange("factory_id", value)}
              allowClear
            >
              {factories.map((item) => (
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
                message: "Please input line",
              },
            ]}
            name="line_id"
            label="Line"
            className="py-2"
          >
            <Select
              style={{ width: 180 }}
              name="line_id"
              placeholder="Select a line"
              onChange={(value) => handleOptionFormChange("line_id", value)}
              allowClear
            >
              {lines.map((item) => (
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
                message: "Please input quantity",
              },
            ]}
            name="quantity"
            label="Quantity"
            className="py-2"
          >
            <Input
              name="quantity"
              onChange={handleInputFormChange}
              value={PDOrder.quantity}
              placeholder="Enter quantity"
              type="number"
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input start date",
              },
            ]}
            name="start_date"
            label="Start Date"
            className="py-2"
          >
            <Input
              name="start_date"
              onChange={handleInputFormChange}
              type="date"
              value={PDOrder.start_date}
              placeholder="Enter Start Date"
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input end date",
              },
            ]}
            name="end_date"
            label="End Date"
            className="py-2"
          >
            <Input
              name="end_date"
              onChange={handleInputFormChange}
              type="date"
              value={PDOrder.end_date}
              placeholder="Enter End Date"
            />
          </Form.Item>

          <Form.Item name="description" label="Description" className="py-2">
            <Input
              name="description"
              onChange={handleInputFormChange}
              type="text"
              value={PDOrder.description}
              style={{ width: 350 }}
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
          // rowKey={(record) => record.id}
          size="small"
          pagination={{
            current: currentPage,
            pageSize: 7,
            total: PDOrders.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={PDOrders}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default ProductionOrder;
