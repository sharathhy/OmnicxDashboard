import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, ChevronDown, Menu, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import microsoft from '../../public/microsoft.png';

interface HeaderProps {
  retailers: string[];
  regions: string[];
  dates: string[];
  storeTypes: string[];
  filters: {
    retailer: string;
    region: string;
    date: string;
    storeType: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onMenuClick: () => void;
}

export default function Header({ retailers, regions, dates, storeTypes, filters, onFilterChange, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <header className="min-h-16 h-auto py-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-accent rounded-lg md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            O
          </div> */}
          <img src={microsoft} alt="OmniCx Logo" className="w-8 h-8 " />
          <h1 className="text-xl font-bold tracking-tight">OmniCx Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2 hover:bg-accent rounded-lg md:hidden flex items-center gap-2 text-sm font-medium"
            aria-label="Open filters"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent transition-colors md:hidden"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 flex-nowrap md:flex-wrap lg:flex-nowrap">
          <FilterDropdown
            label="Retailer"
            options={['All Retailers', ...retailers]}
            value={filters.retailer}
            onChange={(v) => onFilterChange('retailer', v)}
          />
          <FilterDropdown
            label="Region"
            options={regions}
            value={filters.region}
            onChange={(v) => onFilterChange('region', v)}
          />
          <FilterDropdown
            label="Date"
            options={dates}
            value={filters.date}
            onChange={(v) => onFilterChange('date', v)}
          />
          <FilterDropdown
            label="Store Type"
            options={storeTypes}
            value={filters.storeType}
            onChange={(v) => onFilterChange('storeType', v)}
          />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent transition-colors hidden md:block"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-100 md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-card border-t rounded-t-3xl p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Filter Options</h3>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-2 hover:bg-accent rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <MobileFilterItem
                  label="Retailer"
                  options={['All Retailers', ...retailers]}
                  value={filters.retailer}
                  onChange={(v) => { onFilterChange('retailer', v); setIsFilterModalOpen(false); }}
                />
                <MobileFilterItem
                  label="Region"
                  options={regions}
                  value={filters.region}
                  onChange={(v) => { onFilterChange('region', v); setIsFilterModalOpen(false); }}
                />
                <MobileFilterItem
                  label="Date"
                  options={dates}
                  value={filters.date}
                  onChange={(v) => { onFilterChange('date', v); setIsFilterModalOpen(false); }}
                />
                <MobileFilterItem
                  label="Store Type"
                  options={storeTypes}
                  value={filters.storeType}
                  onChange={(v) => { onFilterChange('storeType', v); setIsFilterModalOpen(false); }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

function FilterDropdown({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-accent transition-colors">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{value}</span>
        <ChevronDown size={14} />
      </button>
      <div className="absolute right-0 mt-1 w-48 bg-popover border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileFilterItem({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full border transition-all",
              value === opt 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-muted/50 hover:bg-accent"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
