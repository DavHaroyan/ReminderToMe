"use client";

import { useEffect, useState } from "react";
import { auth, db, googleProvider, requestNotificationPermission } from "@/lib/firebase";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Auth from "@/components/Auth";
import ReminderForm from "@/components/ReminderForm";
import ReminderList from "@/components/ReminderList";
import { toast } from "sonner";
import { Bell } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  eventTime: string;
  notified: boolean;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      
      if (u) {
        setupNotifications(u);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setReminders([]);
      return;
    }

    const q = query(
      collection(db, "reminders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reminder[];
      setReminders(data);
    });

    return () => unsubscribe();
  }, [user]);

  const setupNotifications = async (currentUser: User) => {
    const token = await requestNotificationPermission();
    if (token) {
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        fcmToken: token,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('FCM Token registered');
    } else {
      toast("Notifications not enabled", {
        description: "You won't receive push notifications until you enable them in your settings.",
        action: {
          label: "Enable",
          onClick: () => setupNotifications(currentUser)
        }
      });
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome back!");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        return; // Ignore if user just closed the popup
      }
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleAddReminder = async (data: { title: string; date: Date; time: string }) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(":").map(Number);
      const eventTime = new Date(data.date);
      eventTime.setHours(hours, minutes, 0, 0);

      // Calculate remindAt (5 minutes before)
      const remindAt = new Date(eventTime.getTime() - 5 * 60 * 1000);

      await addDoc(collection(db, "reminders"), {
        userId: user.uid,
        title: data.title,
        eventTime: eventTime.toISOString(),
        remindAt: remindAt.toISOString(),
        notified: false,
        createdAt: serverTimestamp()
      });

      toast.success("Reminder created!");
    } catch (error) {
      console.error("Failed to add reminder", error);
      toast.error("Cloud not add reminder. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reminders", id));
      toast.info("Reminder deleted");
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Bell className="w-8 h-8 text-blue-600 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="mesh-blob blob-1"></div>
      <div className="mesh-blob blob-2"></div>
      <div className="mesh-blob blob-3"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
        
        <main className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full">
          {!user ? (
            <Auth onLogin={handleLogin} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">New Reminder</h1>
                  <p className="text-slate-500 font-medium">Keep your schedule crystal clear.</p>
                </div>
                
                <div className="glass p-8 rounded-[32px] shadow-xl border-white/40">
                  <ReminderForm onSubmit={handleAddReminder} isSubmitting={isSubmitting} />
                </div>

                <div className="glass p-4 rounded-2xl flex items-center gap-3 border-indigo-100/50">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-indigo-700 font-bold">
                    You will be notified 5 minutes before your event starts.
                  </p>
                </div>
              </div>

              <div className="md:col-span-12 lg:col-span-7 h-full">
                <ReminderList reminders={reminders} onDelete={handleDeleteReminder} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
