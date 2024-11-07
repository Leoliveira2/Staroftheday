import React from 'react';
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
      className
    )}>
      <main className="relative flex min-h-screen flex-col">
        <div className="flex-1 flex-grow">{children}</div>
      </main>
    </div>
  );
};

export const PageContainer = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn("container mx-auto px-4 py-6", className)}>
      {children}
    </div>
  );
};