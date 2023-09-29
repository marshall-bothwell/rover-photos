"use client"
 
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "../utils/cn"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

interface DatePickerProps {
  searchDate: Date | undefined,
  setSearchDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  disabled: (Date | { from: Date; to: Date;})[],
  defaultMonth: Date,
  fromDate: Date,
  toDate: Date,
}


export function DatePicker({ searchDate, setSearchDate, disabled, defaultMonth, fromDate, toDate }: DatePickerProps ) {
 
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !searchDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {searchDate ? format(searchDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={searchDate}
          onSelect={setSearchDate}
          disabled={disabled}
          defaultMonth={defaultMonth}
          fromDate={fromDate}
          toDate={toDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}