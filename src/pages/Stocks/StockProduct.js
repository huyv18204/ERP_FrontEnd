import React, { useEffect, useState } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch.js";
import { Form, Input, Select } from "antd";
import * as productsService from "../../services/products.js";
import * as colorsService from "../../services/colors.js";
import * as sizesService from "../../services/sizes.js";
import * as stockProductsService from "../../services/stock_products.js";
import BtnClear from "../../components/Button/BtnClear.js";
import BtnQuery from "../../components/Button/BtnQuery.js";

const StockProduct = () => {
  const initialStockState = {
    product_id: null,
    size_id: null,
    color_id: null,
    code: "",
  };
  const [stock, setStock] = useState(initialStockState);
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const columns = [
    {
      title: "No",
      dataIndex: "code",
      key: "code",
      width: "15%",
      ...getColumnSearch("code"),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "15%",
      ...getColumnSearch("product"),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "15%",
      ...getColumnSearch("color"),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: "15%",
      ...getColumnSearch("size"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
    },
  ];

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionFormChange = (field, value) => {
    setStock((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setStock(initialStockState);
    form.resetFields();
  };

  const handleQuery = async () => {
    const stocks = await stockProductsService.index(stock);

    const dataWHEntry = stocks?.map((stock, index) => ({
      ...stock,
      product: stock.product.name,
      key: stock.id,
      code: stock.product.code,
      color: stock.color.name,
      size: stock.size.name,
    }));
    console.log(dataWHEntry);

    setStocks(dataWHEntry);
  };

  const getProducts = async () => {
    const data = await productsService.index();
    setProducts(data);
  };

  const getColors = async () => {
    const data = await colorsService.index();
    setColors(data);
  };

  const getSizes = async () => {
    const data = await sizesService.index();
    setSizes(data);
  };

  useEffect(() => {
    getProducts();
    getColors();
    getSizes();
  }, []);

  useEffect(() => {
    form.setFieldsValue(stock);
  }, [stock, form]);
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
              value={stock.code}
            />
          </Form.Item>
          <Form.Item name="product_id" label="Product" className="py-2">
            <Select
              style={{ width: 180 }}
              name="product_id"
              placeholder="Select a product"
              onChange={(value) => handleOptionFormChange("product_id", value)} // Ghi chú
              allowClear
            >
              {products.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="color_id" label="Color" className="py-2">
            <Select
              style={{ width: 180 }}
              name="color_id"
              placeholder="Select a color"
              onChange={(value) => handleOptionFormChange("color_id", value)} // Ghi chú
              allowClear
            >
              {colors.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="size_id" label="Size" className="py-2">
            <Select
              style={{ width: 180 }}
              name="size_id"
              placeholder="Select a size"
              onChange={(value) => handleOptionFormChange("size_id", value)} // Ghi chú
              allowClear
            >
              {sizes.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
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
          size="small"
          pagination={{
            current: currentPage,
            pageSize: 7,
            total: stocks.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={stocks.length > 0 ? stocks : []}
        />
      </Content>
    </div>
  );
};

export default StockProduct;
