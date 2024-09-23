import React, { useEffect, useState } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Input, Select } from "antd";
import * as BOMsService from "../../services/BOMs";
import * as materialsService from "../../services/materials";
import * as productsService from "../../services/products";
import { useMessage } from "../../hooks/useMessage";
import BtnNew from "../../components/Button/BtnNew";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnAddRow from "../../components/Button/BtnAddRow";
import BtnQuery from "../../components/Button/BtnQuery";

const BOMRegister = () => {
  const initialProductState = {
    product_id: null,
  };
  const initialMaterialInfoState = [
    {
      key: 1,
      material_id: null,
      quantity: null,
    },
    {
      key: 2,
      material_id: null,
      quantity: null,
    },
  ];

  const [productId, setProductId] = useState(initialProductState);
  const [currentPage, setCurrentPage] = useState(1);
  const [materialInfo, setMaterialInfo] = useState(initialMaterialInfoState);
  const [originalMaterialInfo, setOriginalMaterialInfo] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();

  const handleInputTableChange = (e, key, column) => {
    const newValues = [...materialInfo];
    const index = newValues.findIndex((item) => key === item.key);
    newValues[index][column] = e.target.value;
    setMaterialInfo(newValues);
  };

  const handleOptionTableChange = (value, key, column) => {
    const newValues = [...materialInfo];
    const index = newValues.findIndex((item) => key === item.key);
    if (index !== -1) {
      newValues[index][column] = value;
      setMaterialInfo(newValues);
    }
  };

  const columns = [
    {
      title: "Material",
      dataIndex: "material_id",
      key: "material_id",
      width: "30%",
      ...getColumnSearch("material_id"),
      render: (value, record) => (
        <Select
          name={`material_id[${record.key}]`}
          placeholder="Select a materials"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "material_id")
          }
          allowClear
          value={record.material_id}
          style={{ width: "100%" }}
        >
          {materials.map((item) => (
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
      width: "30%",
      ...getColumnSearch("quantity"),
      render: (value, record) => (
        <Input
          name={`quantity[${record.key}]`}
          type="number"
          value={value}
          onChange={(e) => handleInputTableChange(e, record.key, "quantity")}
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

  const handleOptionFormChange = (value) => {
    setProductId((prev) => ({
      ...prev,
      product_id: value,
    }));
  };

  const handleDelete = async (id, key) => {
    if (id) {
      const response = await BOMsService.destroy(id);
      if (response.type === "success") {
        const updatedMaterialInfo = materialInfo.filter(
          (item) => item.key !== key
        );
        setMaterialInfo(updatedMaterialInfo);
      }
      Message(response.type, response.message);
    } else {
      const updatedMaterialInfo = materialInfo.filter(
        (item) => item.key !== key
      );
      setMaterialInfo(updatedMaterialInfo);
      Message("success", "Delete row successfully");
    }
  };

  const handleSave = async () => {
    const dataSave = materialInfo.filter((item) => item.id === undefined);
    const dataUpdate = materialInfo.filter((item) => item.id !== undefined);

    if (
      dataSave.length > 0 &&
      productId &&
      productId.product_id &&
      dataSave &&
      dataSave[0].material_id &&
      dataSave[0].quantity
    ) {
      const response = await BOMsService.store({
        ...productId,
        materials: [...dataSave],
      });

      if (response.type === "success") {
        Message(response.type, response.message);
      }
    }

    if (dataUpdate.length > 0) {
      const modifiedRecords = dataUpdate.filter((item) => {
        const originalItem = originalMaterialInfo.find(
          (original) => original.id === item.id
        );
        return (
          originalItem &&
          (originalItem.material_id !== item.material_id ||
            originalItem.quantity !== item.quantity)
        );
      });

      if (modifiedRecords.length > 0) {
        const hasInvalidItemsUpdate = modifiedRecords.some(
          (item) => !item.material_id || !item.quantity
        );

        if (hasInvalidItemsUpdate) {
          Message("error", "Please fill in required fields for existing items");
          return;
        }

        try {
          await Promise.all(
            modifiedRecords.map((item) =>
              BOMsService.update(item.id, {
                ...item,
              })
            )
          );

          Message("success", "Update successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
    handleQuery();
  };

  const handleQuery = async () => {
    try {
      if (productId.product_id) {
        const response = await BOMsService.index(productId);
        const data = response?.map((productId, index) => ({
          ...productId,
          key: index,
        }));
        setMaterialInfo(data);

        // Sao chép dữ liệu gốc thay vì tham chiếu
        setOriginalMaterialInfo(JSON.parse(JSON.stringify(data)));
      } else {
        Message("error", "Please fill in required fields");
      }
    } catch (error) {
      Message(
        "error",
        "Error fetching suppliers: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const handleNew = () => {
    setMaterialInfo(initialMaterialInfoState);
    setProductId(initialProductState);
    form.resetFields();
  };

  const getMaterial = async () => {
    const data = await materialsService.index();
    setMaterials(data);
  };

  const getProduct = async () => {
    const data = await productsService.index();
    setProducts(data);
  };

  const handleAddRow = async () => {
    const newKey = materialInfo.length + 1;
    const newRow = {
      key: newKey,
      material_id: null,
      quantity: null,
    };
    setMaterialInfo([...materialInfo, newRow]);
  };
  useEffect(() => {
    getMaterial();
    getProduct();
  }, []);

  useEffect(() => {
    form.setFieldsValue(productId);
  }, [productId, form]);
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
        <BtnQuery className="ms-2" event={handleQuery} />
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
              placeholder="Select a customer"
              onChange={handleOptionFormChange}
              allowClear
            >
              {products.map((item) => (
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
            total: materialInfo.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={materialInfo}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default BOMRegister;
