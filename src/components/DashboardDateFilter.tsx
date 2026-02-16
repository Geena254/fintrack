import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DashboardDateFilterProps {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
}

const DashboardDateFilter = ({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DashboardDateFilterProps) => {
  const hasFilter = dateFrom || dateTo;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground font-medium">Filter by date:</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("w-[140px] justify-start text-left font-normal h-8 text-xs", !dateFrom && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
            {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={onDateFromChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("w-[140px] justify-start text-left font-normal h-8 text-xs", !dateTo && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
            {dateTo ? format(dateTo, "MMM dd, yyyy") : "To"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={onDateToChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1 text-muted-foreground"
          onClick={() => { onDateFromChange(undefined); onDateToChange(undefined); }}
        >
          <X className="w-3.5 h-3.5" /> Clear
        </Button>
      )}
    </div>
  );
};

export default DashboardDateFilter;
