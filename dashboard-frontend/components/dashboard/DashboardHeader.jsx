// components/dashboard/DashboardHeader.jsx
import { Button } from '../ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ onCreateTable, userName, onLogout }) {
  return (
    <div className="relative backdrop-blur-xl bg-background/30 border-b border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
      <div className="relative flex justify-between items-center p-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
            Dashboard
          </h1>
          {userName && (
            <p className="text-sm text-muted-foreground">
              Welcome back, <span className="text-primary neon-text">{userName}</span>
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <Button onClick={onCreateTable} variant="default" className="neon-border">
            <Plus className="mr-2 h-4 w-4" /> Create Table
          </Button>
          <Button onClick={onLogout} variant="outline" className="neon-text">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}