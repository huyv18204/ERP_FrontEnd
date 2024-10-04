import React, { useState, useCallback, useEffect } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import * as stockMaterialsService from "../../services/stock_materials";
import { useMessage } from "../../hooks/useMessage";
import BtnImport from "../../components/Button/BtnImport";
import BtnJump from "../../components/Button/BtnJump";
import { useDispatch, useSelector } from "react-redux";
import { clearWHImport } from "../../redux/actions/warehouseAction";
import BtnExport from "../../components/Button/BtnExport";

const WarehouseExport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const dispatch = useDispatch();
  const [warehouseExport, setWarehouseExport] = useState([]);

  const res = useSelector((state) => state.warehouse.warehouseExport);
  useEffect(() => {
    if (res && res.length > 0) {
      const handleData = res.map((item) => ({
        ...item,
        material_name: item.material.name,
      }));
      setWarehouseExport(handleData);
    }
  }, [res]);

  const columns = [
    {
      title: "Material",
      dataIndex: "material_name",
      key: "material_name",
      width: "25%",
      ...getColumnSearch("material_name"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "25%",
      ...getColumnSearch("quantity"),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleSave = useCallback(async () => {
    try {
      if (
        warehouseExport &&
        warehouseExport.length > 0 &&
        warehouseExport[0].material_id &&
        warehouseExport[0].quantity
      ) {
        const response = await stockMaterialsService.store({
          stockOutItems: warehouseExport,
        });
        setWarehouseExport([]);
        dispatch(clearWHImport());
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
  }, [warehouseExport, dispatch]);

  // Xử lý khi nhấn nút Jump
  const handleJump = () => {
    dispatch(clearWHImport());
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
        <BtnExport className="ms-2" event={handleSave} />
        <BtnJump
          onClick={handleJump}
          className="ms-2"
          title="Stock Out"
          to="/erp-system/stock-outs"
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
            total: warehouseExport?.length || 0,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={warehouseExport}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default WarehouseExport;
