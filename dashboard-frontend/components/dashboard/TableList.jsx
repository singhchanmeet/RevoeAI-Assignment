// components/dashboard/TableList.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { fetchWithAuth } from '../../lib/api';
import { Database, Clock } from 'lucide-react'; // Replace custom icons with Lucide icons

export default function TableList({ onSelectTable }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetchWithAuth('/tables');
        
        if (!res.ok) {
          throw new Error('Failed to fetch tables');
        }
        
        const data = await res.json();
        setTables(data.tables);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {tables.length === 0 ? (
        <Card className="col-span-full p-8 text-center">
          <div className="text-lg text-muted-foreground">
            No tables created yet. Start by creating your first table.
          </div>
        </Card>
      ) : (
        tables.map((table) => (
          <Card 
            key={table._id} 
            className="group cursor-pointer hover:scale-105 transition-all duration-500"
            onClick={() => onSelectTable(table)}
          >
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardTitle className="text-xl neon-text">{table.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Database className="h-4 w-4" /> {/* Replace TableProperties with Database icon */}
                {table.columns.length} columns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated: {new Date(table.updatedAt).toLocaleString()}
              </div>
              <Button className="w-full neon-border group-hover:animate-pulse">
                View Table
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}