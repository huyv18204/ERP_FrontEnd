import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Form, Select } from "antd";
import * as POrdersService from "../../services/purchase_orders";
import * as suppliersService from "../../services/suppliers";
import * as materialsService from "../../services/materials";
import { useMessage } from "../../hooks/useMessage";
import BtnJump from "../../components/Button/BtnJump";
import BtnSave from "../../components/Button/BtnSave";
import { useSelector } from "react-redux";
import { clearData } from "../../redux/actions/purchaseOrderAction.js";
import { useDispatch } from "react-redux";

const PurchaseOrderRegister = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [original, setOriginal] = useState([]);
  const [PDOrders, setPDOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const POrderItems = useSelector(
    (item) => item.purchaseOrder.purchaseOrderItems
  );
  const PRsId = useSelector((item) => item.purchaseOrder.selectedRowKeys);

  useEffect(() => {
    if (POrderItems) {
      const data = POrderItems.map((item) => ({
        material_id: item.material_id,
        quantity: item.quantity,
        key: item.key,
        supplier_id: null,
      }));
      setPDOrders(data);
    }
  }, [POrderItems]);

  const handleOptionTableChange = (value, key, column) => {
    const newValue = [...PDOrders];
    const index = newValue.findIndex((item) => key === item.key);
    if (index !== -1) {
      newValue[index][column] = value;
      setPDOrders(newValue);
    }
  };

  const columns = [
    {
      title: "Material",
      dataIndex: "material_id",
      key: "material_id",
      width: "40%",
      ...getColumnSearch("material_id"),
      render: (value, record) => (
        <Select
          disabled={true}
          name={`material_id[${record.key}]`}
          placeholder="Select a materials"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "material_id")
          }
          allowClear
          value={record.material_id}
          style={{ width: 150 }}
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
      width: "25%",
    },
    {
      title: "Supplier",
      dataIndex: "supplier_id",
      key: "supplier_id",
      width: "30%",
      ...getColumnSearch("supplier_id"),
      render: (value, record) => (
        <Select
          name={`supplier_id[${record.key}]`}
          placeholder="Select a line"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "supplier_id")
          }
          allowClear
          value={record.supplier_id}
          style={{ width: 150 }}
        >
          {suppliers.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleSave = useCallback(async () => {
    const dataSave = PDOrders.filter((item) => item.id === undefined);
    const dataUpdate = PDOrders.filter((item) => item.id !== undefined);
    if (dataSave.length > 0) {
      try {
        if (dataSave) {
          const response = await POrdersService.store({
            PDOrders: [...dataSave],
            PRsId: PRsId,
          });
          // setPDOrders(response.data);
          // setOriginal(JSON.parse(JSON.stringify([...response.data])));
          Message(response.type, response.message);
          // console.log(response);
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
    }

    if (dataUpdate.length > 0) {
      const modifiedRecords = dataUpdate.filter((item) => {
        const originalItem = original.find(
          (original) => original.id === item.id
        );
        return originalItem && originalItem.supplier_id !== item.supplier_id;
      });

      if (modifiedRecords.length > 0) {
        try {
          await Promise.all(
            modifiedRecords.map(async (item) => {
              const response = await POrdersService.update(item.id, {
                supplier_id: item.supplier_id,
              });
              const newValue = [...PDOrders];
              const index = newValue.findIndex((items) => items.id === item.id);
              newValue[index] = { ...response.data, key: response.data.id };
              setPDOrders(newValue);
              setOriginal(JSON.parse(JSON.stringify([...newValue])));
              return response;
            })
          );

          Message("success", "Items updated successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
  }, [PDOrders]);

  const handleNew = () => {
    setPDOrders([]);
    form.resetFields();
  };

  const getSuppliers = async () => {
    const data = await suppliersService.index();
    setSuppliers(data);
  };

  const getMaterials = async () => {
    const data = await materialsService.index();
    setMaterials(data);
  };

  const handleJump = () => {
    dispatch(clearData());
  };

  useEffect(() => {
    getSuppliers();
    getMaterials();
  }, []);

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
        <BtnSave className="ms-2" event={handleSave} />
        <BtnJump
          className="ms-2"
          title="Purchase Requisition"
          to="/erp-system/purchase-requisitions"
          onClick={handleJump}
        />
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

export default PurchaseOrderRegister;
