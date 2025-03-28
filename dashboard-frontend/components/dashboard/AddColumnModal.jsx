// components/dashboard/AddColumnModal.jsx
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function AddColumnModal({ open, onClose, onAddColumn }) {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState('text');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!columnName.trim()) {
      setError('Column name is required');
      return;
    }

    onAddColumn({
      name: columnName,
      type: columnType
    });

    // Reset form
    setColumnName('');
    setColumnType('text');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>
            Add a new column to your dashboard view (this will not affect your Google Sheet).
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="columnName">Column Name</Label>
            <Input
              id="columnName"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="New Column"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="columnType">Column Type</Label>
            <Select value={columnType} onValueChange={setColumnType}>
              <SelectTrigger id="columnType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}