import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, User as UserIcon } from "lucide-react";

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">RemindMe</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold leading-none text-slate-800">{user.displayName}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{user.email}</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border-2 border-white shadow-sm w-9 h-9">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout} className="rounded-xl border-slate-200 hover:bg-white/50">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
