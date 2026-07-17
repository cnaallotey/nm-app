"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { 
  Users, 
  CreditCard, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Clock,
  Briefcase
} from "lucide-react";

type Tab = "users" | "payments" | "feedback";

export default function AdminPortalPage() {
  const { profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all admin data
  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Users
      const usersSnap = await getDocs(collection(db, "users"));
      const users = usersSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setUsersList(users);

      // 2. Fetch Payments (sorted by date)
      const paymentsSnap = await getDocs(collection(db, "payments"));
      const payments = paymentsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      // Sort payments by date descending
      payments.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime() || 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime() || 0;
        return bTime - aTime;
      });
      setPaymentsList(payments);

      // 3. Fetch Feedback (sorted by date)
      const feedbackSnap = await getDocs(collection(db, "feedback"));
      const feedback = feedbackSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      // Sort feedback by date descending
      feedback.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime() || 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime() || 0;
        return bTime - aTime;
      });
      setFeedbackList(feedback);

    } catch (err: any) {
      console.error("Failed to load admin data:", err);
      setError("Unauthorized or failed to retrieve administrative data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [profile]);

  if (!isAdmin) {
    return (
      <div className="py-16 text-center space-y-6 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-display font-bold text-slate-900 uppercase tracking-wide">Access Denied</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          You do not have administrative privileges required to view this portal. Use the Demo Role switch in the sidebar to toggle permissions.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <svg className="animate-spin h-6 w-6 text-indigo-650" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-450 text-[10px] font-bold uppercase tracking-wider">Accessing admin database logs...</span>
      </div>
    );
  }

  // Admin Actions for Users
  const handleTogglePlan = async (userId: string, currentPlan: string) => {
    try {
      const newPlan = currentPlan === "Pro" ? "Free" : "Pro";
      await updateDoc(doc(db, "users", userId), { plan: newPlan });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "suspended" ? "active" : "suspended";
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Actions for Feedback
  const handleToggleFeedbackStatus = async (feedbackId: string, currentStatus: string) => {
    try {
      let newStatus = "in-progress";
      if (currentStatus === "new") newStatus = "in-progress";
      else if (currentStatus === "in-progress") newStatus = "resolved";
      else if (currentStatus === "resolved") newStatus = "new";

      await updateDoc(doc(db, "feedback", feedbackId), { status: newStatus });
      setFeedbackList((prev) =>
        prev.map((f) => (f.id === feedbackId ? { ...f, status: newStatus } : f))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this feedback log?")) return;
    try {
      await deleteDoc(doc(db, "feedback", feedbackId));
      setFeedbackList((prev) => prev.filter((f) => f.id !== feedbackId));
    } catch (err) {
      console.error(err);
    }
  };

  // Sum total payments
  const totalRevenue = paymentsList.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-black text-slate-900 mb-1">Administrative Portal</h1>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Manage user accounts, review billing ledgers, and track feature feedback tickets.
          </p>
        </div>
        <button
          onClick={loadAdminData}
          className="self-start md:self-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-sm hover:shadow uppercase tracking-wider cursor-pointer"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl text-xs text-rose-600 font-bold">
          {error}
        </div>
      )}

      {/* Tabs Selection Bar */}
      <div className="flex border-b border-slate-200/60 pb-px gap-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "border-indigo-650 text-indigo-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({usersList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "payments"
              ? "border-indigo-650 text-indigo-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payments ({paymentsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "feedback"
              ? "border-indigo-650 text-indigo-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback ({feedbackList.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="border border-slate-200/60 bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {usersList.map((userItem) => {
                    const joinedDate = userItem.createdAt
                      ? userItem.createdAt.toDate ? userItem.createdAt.toDate().toLocaleDateString() : new Date(userItem.createdAt).toLocaleDateString()
                      : "—";

                    return (
                      <tr key={userItem.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 max-w-xs">
                          <div className="font-bold text-slate-800 truncate">{userItem.displayName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{userItem.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                            userItem.role === "admin" 
                              ? "bg-purple-50 border-purple-100 text-purple-700" 
                              : "bg-slate-100 border-slate-200 text-slate-500"
                          }`}>
                            {userItem.role?.toUpperCase() || "USER"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                            userItem.plan === "Pro" 
                              ? "bg-indigo-50 border-indigo-100 text-indigo-700" 
                              : "bg-slate-100 border-slate-200 text-slate-500"
                          }`}>
                            {userItem.plan || "Free"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                            userItem.status === "suspended" 
                              ? "bg-rose-50 border-rose-100 text-rose-600" 
                              : "bg-emerald-50 border-emerald-100 text-emerald-600"
                          }`}>
                            {userItem.status?.toUpperCase() || "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleTogglePlan(userItem.id, userItem.plan)}
                              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] font-bold rounded-full transition-all uppercase tracking-wider cursor-pointer"
                            >
                              Toggle Plan
                            </button>
                            <button
                              onClick={() => handleToggleRole(userItem.id, userItem.role)}
                              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] font-bold rounded-full transition-all uppercase tracking-wider cursor-pointer"
                            >
                              Toggle Role
                            </button>
                            <button
                              onClick={() => handleToggleStatus(userItem.id, userItem.status)}
                              className={`px-2.5 py-1 text-[9px] font-bold rounded-full border transition-all uppercase tracking-wider cursor-pointer ${
                                userItem.status === "suspended"
                                  ? "bg-emerald-50 hover:bg-emerald-100/50 border-emerald-250 text-emerald-605"
                                  : "bg-rose-50 hover:bg-rose-100/50 border-rose-250 text-rose-605"
                              }`}
                            >
                              {userItem.status === "suspended" ? "Reactivate" : "Suspend"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* Total Revenue Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-slate-200/60 rounded-3xl flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>Total Revenue</span>
                </span>
                <span className="text-3xl font-display font-black text-slate-900 mt-4">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>

            <div className="border border-slate-200/60 bg-white rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Transaction / User</th>
                      <th className="px-6 py-4">Plan Purchased</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {paymentsList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                          No transactions found on ledger records.
                        </td>
                      </tr>
                    ) : (
                      paymentsList.map((payment) => {
                        const date = payment.createdAt
                          ? payment.createdAt.toDate ? payment.createdAt.toDate().toLocaleString() : new Date(payment.createdAt).toLocaleString()
                          : "—";

                        return (
                          <tr key={payment.id} className="hover:bg-slate-55/20 transition-colors">
                            <td className="px-6 py-4 max-w-xs">
                              <div className="font-bold text-slate-800 truncate">{payment.displayName}</div>
                              <div className="text-[10px] text-slate-400 truncate">{payment.email}</div>
                              <span className="text-[8px] bg-slate-50 border border-slate-100 text-slate-450 px-2 py-0.5 rounded font-mono mt-1 inline-block">
                                ID: {payment.transactionId}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[8px] font-bold px-2 py-0.5 rounded border bg-indigo-50 border-indigo-100 text-indigo-700">
                                {payment.plan || "PRO"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-800 font-extrabold text-xs">
                              ${(payment.amount || 10).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-slate-405 font-medium">
                              {date}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <div className="p-12 border border-slate-200/60 bg-white rounded-3xl text-center text-slate-400 text-xs shadow-sm">
                No user feedback tickets submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbackList.map((fb) => {
                  const date = fb.createdAt
                    ? fb.createdAt.toDate ? fb.createdAt.toDate().toLocaleDateString() : new Date(fb.createdAt).toLocaleDateString()
                    : "—";

                  const isBug = fb.type === "bug";

                  return (
                    <div 
                      key={fb.id}
                      className={`p-5 rounded-3xl border bg-white flex flex-col justify-between shadow-sm transition-all ${
                        fb.status === "resolved" 
                          ? "border-emerald-100 opacity-60" 
                          : fb.status === "in-progress"
                          ? "border-indigo-150"
                          : "border-slate-200/60"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Meta */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-0.5 ${
                            isBug 
                              ? "bg-rose-50 border-rose-100 text-rose-600" 
                              : "bg-amber-50 border-amber-100 text-amber-700"
                          }`}>
                            {isBug ? <AlertTriangle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                            <span>{fb.type?.toUpperCase()}</span>
                          </span>

                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{date}</span>
                        </div>

                        {/* Message content */}
                        <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                          "{fb.message}"
                        </p>

                        <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2.5">
                          From: {fb.displayName} ({fb.email})
                        </div>
                      </div>

                      {/* Ticket Action Footer */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-4">
                        <button
                          onClick={() => handleToggleFeedbackStatus(fb.id, fb.status)}
                          className={`text-[8px] px-2.5 py-1 rounded-full font-bold border transition-all uppercase tracking-wider cursor-pointer ${
                            fb.status === "resolved"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : fb.status === "in-progress"
                              ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                              : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}
                        >
                          Status: {fb.status?.toUpperCase() || "NEW"}
                        </button>

                        <button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          className="p-1.5 rounded-full border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
