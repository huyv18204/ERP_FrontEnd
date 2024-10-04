import React, { useEffect, useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import { Input, Select } from "antd";
import * as stockOutsService from "../../services/stock_outs";
import * as stockOutItemsService from "../../services/stock_out_items";
import * as stockMaterialsService from "../../services/stock_materials";
import { useMessage } from "../../hooks/useMessage";
import BtnNew from "../../components/Button/BtnNew";
import BtnSave from "../../components/Button/BtnSave";
import BtnDelete from "../../components/Button/BtnDelete";
import BtnAddRow from "../../components/Button/BtnAddRow";
import BtnJump from "../../components/Button/BtnJump";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSOCreate,
  jumpSOExport,
} from "../../redux/actions/warehouseAction";

const StockOutRegister = () => {
  const [stockOut, setStockOut] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [original, setOriginal] = useState([]);
  const [stockOutItems, setStockOutItems] = useState([]);
  const [stockMaterials, setStockMaterials] = useState([]);

  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const dispatch = useDispatch();
  const { Content } = Layout;
  const { Option } = Select;

  const SO = useSelector((state) => state.warehouse.stockOut);
  const SOItems = useSelector((state) => state.warehouse.stockOutItems);

  const handleInputTableChange = (e, key, column) => {
    const newValues = [...stockOutItems];
    const index = newValues.findIndex((item) => key === item.key);
    newValues[index][column] = e.target.value;
    setStockOutItems(newValues);
  };

  const getStockOutItems = async (stockOutId) => {
    if (stockOutId) {
      try {
        const response = await stockOutItemsService.show(stockOutId);
        if (response.data.data.length > 0) {
          setStockOutItems(response.data.data);
          setOriginal(JSON.parse(JSON.stringify(response.data.data)));
        } else {
          setStockOutItems([]);
        }
      } catch (error) {
        Message("error", "Error fetching product items: " + error.message);
      }
    }
  };

  const handleOptionTableChange = (value, key, column) => {
    const newValues = [...stockOutItems];
    const index = newValues.findIndex((item) => key === item.key);
    if (index !== -1) {
      newValues[index][column] = value;
      setStockOutItems(newValues);
    }
  };

  const columns = [
    {
      title: "Material",
      dataIndex: "material_id",
      key: "material_id",
      width: "20%",
      ...getColumnSearch("material_id"),
      render: (value, record) => (
        <Select
          disabled={record.id !== undefined ? true : false}
          name={`product_id[${record.key}]`}
          placeholder="Select a material"
          onChange={(newValue) =>
            handleOptionTableChange(newValue, record.key, "material_id")
          }
          allowClear
          value={record.material_id}
          style={{ width: "100%" }}
        >
          {stockMaterials.map((item) => (
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
      width: "20%",
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
      width: "20%",
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

  const handleSave = useCallback(async () => {
    const dataSave = stockOutItems.filter((item) => item.id === undefined);
    const dataUpdate = stockOutItems.filter((item) => item.id !== undefined);
    if (dataSave.length > 0) {
      try {
        if (dataSave && dataSave[0].material_id && dataSave[0].quantity) {
          if (!isSaved) {
            const response = await stockOutsService.store({
              ...stockOut,
              stockOutItems: [...dataSave],
            });
            getStockOutItems(response.data.stock_out.id);
            setStockOut(response.data.stock_out);
            setIsSaved(true);
            Message(response.type, response.message);
          } else {
            const response = await stockOutItemsService.store({
              ...stockOut,
              stockOutItems: [...dataSave],
            });
            getStockOutItems(response.data.stock_out.id);
            setStockOut(response.data.stock_out);
            Message(response.type, response.message);
          }
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
        return (
          originalItem &&
          (originalItem.material_id !== item.material_id ||
            originalItem.quantity !== item.quantity)
        );
      });

      if (modifiedRecords.length > 0) {
        try {
          await Promise.all(
            modifiedRecords.map((item) =>
              stockOutItemsService.update(item.id, {
                material_id: item.material_id,
                quantity: item.quantity,
              })
            )
          );
          getStockOutItems(stockOut.id);
          Message("success", "Items updated successfully");
        } catch (error) {
          Message("error", "Error updating items: " + error.message);
        }
      }
    }
  }, [stockOut, stockOutItems]);

  const handleDelete = async (id, key) => {
    if (id) {
      const response = await stockOutItemsService.destroy(id);
      const updatedValue = stockOutItems.filter((item) => item.key !== key);
      setStockOutItems(updatedValue);
      Message(response.type, response.message);
    } else {
      const updatedValue = stockOutItems.filter((item) => item.key !== key);
      setStockOutItems(updatedValue);
      Message("success", "Delete row successfully");
    }
  };

  const handleNew = () => {
    setIsSaved(false);
    setStockOutItems([]);
    setStockOut({});
    dispatch(clearSOCreate());
  };

  const handleJump = () => {
    if (isSaved) {
      dispatch(jumpSOExport([...stockOutItems]));
      dispatch(clearSOCreate());
    }
  };

  const handleAddRow = async () => {
    const newKey = stockOutItems.length + 1;
    const newRow = {
      key: newKey,
      product_id: "",
      description: "",
      delivery_date: "",
    };

    setStockOutItems([...stockOutItems, newRow]);
  };

  const getStockMaterial = async () => {
    const data = await stockMaterialsService.index();

    const handleData = data?.map((item) => ({
      ...item,
      name: item.material.name,
    }));

    setStockMaterials(handleData);
  };

  useEffect(() => {
    if (SO && SOItems && SOItems.length > 0) {
      setStockOut({ ...SO });
      setIsSaved(true);
      setStockOutItems([...SOItems]);
      setOriginal(JSON.parse(JSON.stringify([...SOItems])));
    }
  }, []);

  useEffect(() => {
    getStockMaterial();
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
        <BtnNew event={handleNew} />
        <BtnSave className="ms-2" event={handleSave} />
        <BtnAddRow className="ms-2" event={handleAddRow} />
        <BtnJump
          onClick={handleJump}
          className="ms-2"
          title="Warehouse Export"
          to="/erp-system/warehouses/export"
        />
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
            total: stockOutItems.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={stockOutItems}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default StockOutRegister;
