// components/dashboard/CreateTableModal.jsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '../../lib/api';

export default function CreateTableModal({ open, onClose, onTableCreated }) {
  const [tableName, setTableName] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'text' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddColumn = () => {
    setColumns([...columns, { name: '', type: 'text' }]);
  };

  const handleRemoveColumn = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!tableName.trim()) {
      setError('Table name is required');
      return;
    }

    if (!sheetUrl.trim()) {
      setError('Google Sheet URL is required');
      return;
    }

    if (columns.some(col => !col.name.trim())) {
      setError('All columns must have a name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetchWithAuth('/tables', {
        method: 'POST',
        body: JSON.stringify({
          name: tableName,
          sheetUrl,
          columns
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create table');
      }

      const data = await res.json();
      onTableCreated(data.table);
      handleReset();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTableName('');
    setSheetUrl('');
    setColumns([{ name: '', type: 'text' }]);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
          <DialogDescription>
            Connect to a Google Sheet and configure your table columns.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="My Table"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheetUrl">Google Sheet URL</Label>
            <Input
              id="sheetUrl"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
            <p className="text-sm text-gray-500 content-center">
              Make sure your sheet is shared with the service account
              <br></br> (test-user@revoeai-sheets-api.iam.gserviceaccount.com)
            </p>
          </div>
          <div>
            <Label>Columns</Label>
            {columns.map((column, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  value={column.name}
                  onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                  placeholder="Column Name"
                  className="flex-grow"
                />
                <Select
                  value={column.type}
                  onValueChange={(value) => handleColumnChange(index, 'type', value)}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
                {columns.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveColumn(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleAddColumn}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Column
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Table'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}