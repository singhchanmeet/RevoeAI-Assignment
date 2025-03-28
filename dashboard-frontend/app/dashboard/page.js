// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import TableList from '../../components/dashboard/TableList';
import DynamicTable from '../../components/dashboard/DynamicTable';
import CreateTableModal from '../../components/dashboard/CreateTableModal';
import useAuth from '../../hooks/useAuth';

export default function DashboardPage() {
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // If not authenticated, redirect to login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, router]);

  const handleCreateTable = () => {
    setShowCreateTableModal(true);
  };

  const handleTableCreated = (newTable) => {
    // Auto-select the newly created table
    setSelectedTable(newTable);
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleBackToList = () => {
    setSelectedTable(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        onCreateTable={handleCreateTable}
        userName={user?.name}
        onLogout={logout}
      />
      
      <div className="container mx-auto p-4">
        {selectedTable ? (
          <div>
            <button 
              onClick={handleBackToList}
              className="mb-4 text-sm flex items-center text-gray-600 hover:text-gray-900"
            >
              &larr; Back to tables
            </button>
            <DynamicTable table={selectedTable} />
          </div>
        ) : (
          <TableList onSelectTable={handleSelectTable} />
        )}
      </div>

      <CreateTableModal 
        open={showCreateTableModal}
        onClose={() => setShowCreateTableModal(false)}
        onTableCreated={handleTableCreated}
      />
    </div>
  );
}