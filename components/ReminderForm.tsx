import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReminderFormProps {
  onSubmit: (data: { title: string; date: Date; time: string }) => void;
  isSubmitting?: boolean;
}

export default function ReminderForm({ onSubmit, isSubmitting }: ReminderFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && time) {
      onSubmit({ title, date, time });
      setTitle("");
      setTime("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Event Title</Label>
        <Input
          id="title"
          placeholder="What's happening?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="h-14 px-4 py-3 rounded-2xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Date</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                "w-full h-14 justify-start text-left font-medium rounded-2xl bg-white/50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 transition-all px-4",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl glass" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-white/90"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Time</Label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="h-14 pl-12 pr-4 rounded-2xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !title || !date || !time}
        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
      >
        <span>Schedule Reminder</span>
        <Plus className="w-5 h-5" />
      </Button>
      
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Automated 5 Min Alert
        </p>
      </div>
    </form>
  );
}
