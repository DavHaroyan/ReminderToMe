import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  // Simple protection with a secret header or param (CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    
    // Query reminders that haven't been notified and are due
    const snapshot = await adminDb
      .collection("reminders")
      .where("notified", "==", false)
      .where("remindAt", "<=", now.toISOString())
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ processed: 0 });
    }

    const results = [];

    for (const doc of snapshot.docs) {
      const reminder = doc.data();
      const userId = reminder.userId;

      // Get user's FCM token
      const userDoc = await adminDb.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const fcmToken = userData?.fcmToken;

      if (fcmToken) {
        try {
          await adminMessaging.send({
            token: fcmToken,
            notification: {
              title: "⏰ Reminder Alert!",
              body: `Don't forget: ${reminder.title} starts in 5 minutes!`,
            },
            data: {
              reminderId: doc.id,
              url: "/",
            }
          });
          
          results.push({ id: doc.id, status: 'sent' });
          // Mark as notified
          await doc.ref.update({ notified: true });
        } catch (msgError: any) {
          console.error(`Failed to send notification for ${doc.id}:`, msgError);
          results.push({ id: doc.id, status: 'failed', error: msgError.message });
        }
      } else {
        results.push({ id: doc.id, status: 'no_token' });
        // Optional: mark as notified anyway or leave for later?
        // Mark as notified to avoid infinite retries if no token
        await doc.ref.update({ notified: true });
      }
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
