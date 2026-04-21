import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ShieldCheck } from "lucide-react";

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full glass border border-white/40 shadow-2xl rounded-[40px] overflow-hidden">
        <div className="bg-indigo-600 h-2" />
        <CardHeader className="text-center pb-2 pt-10 px-8">
          <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
            <Bell className="w-10 h-10 text-indigo-600" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">Stay on track</CardTitle>
          <CardDescription className="text-base font-medium text-slate-500 mt-2">
            Simple reminders with push notifications to keep your day organized.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6 pb-12 px-8">
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Securely sign in with your Google account.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Receive notifications 5 minutes before your events.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={onLogin} 
            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold transition-all shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
