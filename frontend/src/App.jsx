import { useState, useEffect } from 'react'
import DataTable from './components/DataTable'
import './App.css'

function App() {
  const [customers, setCustomers] = useState([])
  
  const API_URL = import.meta.env.PROD 
    ? "/api/customers" 
    : "http://localhost:4002/api/customers";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error(err))
  }, [])


  const totalSales = customers.reduce((acumulador, cliente) => {
    return acumulador + (cliente.totalSale || 0);
  }, 0);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Client', 
      accessor: 'fullName',
      render: (data) => (
        <div>
          <div style={{ fontWeight: '600' }}>{data.fullName}</div>
          <div style={{ fontSize: '0.8em', color: '#6b7280' }}>{data.email}</div>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (customer) => {
        const isFrequent = customer.type === "Frquent"; // Ojo con tu typo en la BD 'Frquent'
        return (
          <span className="status-badge" style={{
            backgroundColor: isFrequent ? '#dcfce7' : '#fef9c3',
            color: isFrequent ? '#166534' : '#854d0e'
          }}>
            {customer.type}
          </span>
        )
      }
    },
    { header: 'Discount', accessor: 'discount', render: (c) => `${c.discount}%` },
    { 
      header: 'Total Sale', 
      accessor: 'totalSale', 
      render: (c) => <span style={{ fontWeight: 'bold' }}>${c.totalSale}</span> 
    }
  ]

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Dashboard Customer</h1>
        <p className="app-subtitle">Reporte General</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Ingresos Totales</span>
          <span className="stat-value">${totalSales}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Clientes Registrados</span>
          <span className="stat-value">{customers.length}</span>
        </div>
      </div>

      <div className="table-card">
        <DataTable 
          data={customers}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default App