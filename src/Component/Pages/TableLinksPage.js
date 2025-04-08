import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import api from "../Services/api";
import "../Style/TableLinksPage.css";

const TableLinksPage = ({ onClose }) => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await api.get("getRestaurantTables");
        if (res.data && Array.isArray(res.data.data)) {
          setTables(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch tables", err);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = (tableId) => {
    onClose(); // Close modal
    navigate(`/table/${tableId}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Select a Table</h2>
          <IoMdClose className="close-icon" onClick={onClose} />
        </div>
        <div className="modal-body">
          {tables.map((table) => (
            <div
              key={table.id}
              className="modal-table-link"
              onClick={() => handleTableClick(table.id)}
            >
              Table No: {table.table_number} (Capacity: {table.capacity})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableLinksPage;
