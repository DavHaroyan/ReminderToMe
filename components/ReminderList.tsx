import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { format, differenceInSeconds, isPast } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Reminder {
  id: string;
  title: string;
  eventTime: string;
  notified: boolean;
}

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: string) => void;
}

export default function ReminderList({ reminders, onDelete }: ReminderListProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (reminders.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
        <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No reminders yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto">
          Create your first reminder above to see it listed here.
        </p>
      </div>
    );
  }

  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Upcoming Reminders</h2>
        <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
          {reminders.length} Active
        </span>
      </div>
      
      <div className="grid gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
        <AnimatePresence>
          {sortedReminders.map((reminder) => (
            <ReminderCard 
              key={reminder.id} 
              reminder={reminder} 
              onDelete={onDelete} 
              now={now} 
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 p-8 border-2 border-dashed border-white/40 glass rounded-[32px] flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center text-slate-300 shadow-sm">
          <Plus className="w-8 h-8" />
        </div>
        <p className="text-sm text-slate-400 font-bold mb-0">
          Stay focused. Stay efficient.
        </p>
      </div>
    </div>
  );
}

interface ReminderCardProps {
  key?: React.Key;
  reminder: Reminder;
  onDelete: (id: string) => void;
  now: Date;
}

function ReminderCard({ reminder, onDelete, now }: ReminderCardProps) {
  const eventDate = new Date(reminder.eventTime);
  const diff = differenceInSeconds(eventDate, now);
  const isExpired = isPast(eventDate);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "Starting now";
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "glass border border-white/50 shadow-lg rounded-[32px] group overflow-hidden transition-all duration-300",
        isExpired && "opacity-60 grayscale-[0.5]"
      )}>
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 bg-white shadow-sm border border-slate-100",
              isExpired ? "text-slate-400" : "text-indigo-600"
            )}>
              <span className="text-[10px] font-black uppercase leading-none">{format(eventDate, "MMM")}</span>
              <span className="text-base font-black leading-none mt-0.5">{format(eventDate, "d")}</span>
            </div>
            
            <div className="space-y-0.5">
              <h4 className={cn(
                "font-bold text-base tracking-tight leading-tight",
                isExpired ? "text-slate-500 line-through" : "text-slate-800"
              )}>
                {reminder.title}
              </h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                {format(eventDate, "h:mm a")} • {isExpired ? "Passed" : "Upcoming"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {!isExpired && (
              <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                IN {formatCountdown(diff)}
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(reminder.id)}
              className="rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50/50 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

