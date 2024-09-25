import React, { useEffect, useState } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch.js";
import { Form, Input, Select } from "antd";
import * as materialsService from "../../services/materials.js";
import * as stockMaterialsService from "../../services/stock_materials.js";
import BtnClear from "../../components/Button/BtnClear.js";
import BtnQuery from "../../components/Button/BtnQuery.js";

const StockMaterial = () => {
  const initialStockState = {
    material_id: null,
    code: "",
  };
  const [stock, setStock] = useState(initialStockState);
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [materials, setMaterials] = useState([]);
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
      title: "Material",
      dataIndex: "material",
      key: "material",
      width: "15%",
      ...getColumnSearch("material"),
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

  const handleOptionFormChange = (value) => {
    setStock((prev) => ({
      ...prev,
      material_id: value,
    }));
  };

  const handleClear = () => {
    setStock(initialStockState);
    form.resetFields();
  };

  const handleQuery = async () => {
    const stocks = await stockMaterialsService.index(stock);
    const dataWHEntry = stocks?.map((stock, index) => ({
      ...stock,
      material: stock.material.name,
      key: stock.id,
      code: stock.material.code,
    }));

    setStocks(dataWHEntry);
  };

  const getSuppliers = async () => {
    const data = await materialsService.index();
    setMaterials(data);
  };

  useEffect(() => {
    getSuppliers();
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
          <Form.Item name="material_id" label="Material" className="py-2">
            <Select
              style={{ width: 180 }}
              name="material_id"
              placeholder="Select a material"
              onChange={handleOptionFormChange}
              allowClear
            >
              {materials.map((item) => (
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

export default StockMaterial;
