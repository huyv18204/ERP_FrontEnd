import React, { useState, useCallback } from "react";
import { Layout, theme, Table } from "antd";
import { useColumnSearch } from "../../hooks/useColumnSearch";
import * as stockMaterialsService from "../../services/stock_materials";
import { useMessage } from "../../hooks/useMessage";
import BtnImport from "../../components/Button/BtnImport";
import BtnJump from "../../components/Button/BtnJump";
import { useDispatch, useSelector } from "react-redux";
import { clearWHImport } from "../../redux/actions/warehouseAction";

const WarehouseImport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { Message, contextHolder } = useMessage();
  const { getColumnSearch } = useColumnSearch();
  const { Content } = Layout;
  const dispatch = useDispatch();
  const [warehouseImport, setWarehouseImport] = useState(
    useSelector((state) => state.warehouse.warehouseImport)
  );
  const supplier_id = useSelector((state) => state.warehouse.supplier_id);

  const columns = [
    {
      title: "Material code",
      dataIndex: "material_code",
      key: "material_code",
      width: "25%",
      ...getColumnSearch("material_code"),
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      ...getColumnSearch("name"),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      width: "25%",
      ...getColumnSearch("unit_price"),
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
        warehouseImport &&
        warehouseImport[0].material_code &&
        warehouseImport[0].quantity &&
        warehouseImport[0].unit_price
      ) {
        const response = await stockMaterialsService.store({
          warehouseEntryDetail: warehouseImport,
          supplier_id: supplier_id,
        });
        setWarehouseImport([]);
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
  }, []);

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
        <BtnImport className="ms-2" event={handleSave} />
        <BtnJump
          onClick={handleJump}
          className="ms-2"
          title="Warehouse Entry List"
          to="/erp-system/warehouse-entries"
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
            total: warehouseImport.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          columns={columns}
          dataSource={warehouseImport}
        />
      </Content>

      {contextHolder}
    </div>
  );
};

export default WarehouseImport;
