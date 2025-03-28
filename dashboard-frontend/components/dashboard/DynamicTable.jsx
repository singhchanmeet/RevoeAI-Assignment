// components/dashboard/DynamicTable.jsx
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Database } from 'lucide-react';
import { fetchWithAuth } from '../../lib/api';
import AddColumnModal from './AddColumnModal';
import io from 'socket.io-client';

export default function DynamicTable({ table }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(table.columns);

    const fetchTableData = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth(`/tables/${table._id}/data`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch table data');
        }
        
        const responseData = await res.json();
        setData(responseData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();

    // Set up real-time connection
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('joinTable', table._id);
    });

    socket.on('tableDataUpdated', (updatedData) => {
      setData(updatedData);
    });

    return () => {
      socket.disconnect();
    };
  }, [table]);

  const handleAddColumn = async (columnData) => {
    try {
      const res = await fetchWithAuth(`/tables/${table._id}/columns`, {
        method: 'POST',
        body: JSON.stringify(columnData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add column');
      }

      const data = await res.json();
      setColumns(data.columns);
      setShowAddColumnModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading table data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <Card className="w-full overflow-hidden backdrop-blur-xl bg-background/30">
      <div className="flex justify-between items-center p-6 border-b border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div>
          <h2 className="text-2xl font-bold neon-text">{table.name}</h2>
          <p className="text-sm text-muted-foreground">
            {columns.length} columns • {data.length} rows
          </p>
        </div>
        <Button 
          onClick={() => setShowAddColumnModal(true)}
          variant="outline"
          // className="neon-border"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Column
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20">
              {columns.map((column) => (
                <TableHead 
                  key={column.name}
                  className="bg-muted/30 text-primary font-medium"
                >
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Database className="h-8 w-8" />
                    No data available. Add data to your Google Sheet to see it here.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  className="border-primary/10 hover:bg-primary/5 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={`${rowIndex}-${colIndex}`}
                      className="py-4"
                    >
                      {row[column.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AddColumnModal 
        open={showAddColumnModal} 
        onClose={() => setShowAddColumnModal(false)}
        onAddColumn={handleAddColumn}
      />
    </Card>
  );
}
