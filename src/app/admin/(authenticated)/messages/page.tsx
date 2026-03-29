"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
    Mail,
    Trash2,
    CheckCircle,
    Clock,
    User,
    Calendar,
    Search,
    Loader2,
    CheckCheck,
    Eye
} from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export default function MessagesPage() {
    const { data: messages, mutate, isLoading } = useSWR("/api/admin/messages", fetcher);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);

    const filteredMessages = messages?.filter((msg: any) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "read" }),
            });
            if (res.ok) {
                mutate();
                if (selectedMessage?.id === id) {
                    setSelectedMessage({ ...selectedMessage, status: "read" });
                }
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Message deleted");
                mutate();
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            toast.error("Failed to delete message");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setIsSendingReply(true);
        try {
            const res = await fetch("/api/admin/messages/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: selectedMessage.email,
                    subject: selectedMessage.subject || "SoleBazar Inquiry",
                    message: replyText
                }),
            });

            if (res.ok) {
                toast.success("Reply sent successfully!");
                setReplyText("");
                setShowReplyForm(false);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to send reply");
            }
        } catch (error) {
            toast.error("An error occurred while sending the reply");
        } finally {
            setIsSendingReply(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#2B2B2B]">Customer <span className="text-[#7C8C5C]">Inquiries</span></h1>
                    <p className="text-sm text-[#999] font-bold mt-1">Manage all contact form submissions and messages</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-4 bg-white border-2 border-[#E8DCC8] rounded-[32px] w-full md:w-80 focus:outline-none focus:border-[#7C8C5C] text-sm font-bold shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Messages List */}
                <div className="lg:col-span-5 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar pr-2">
                    {filteredMessages?.length === 0 ? (
                        <div className="bg-white p-10 rounded-[40px] border border-dashed border-[#E8DCC8] text-center">
                            <p className="text-sm font-bold text-[#999]">No messages found</p>
                        </div>
                    ) : (
                        filteredMessages?.map((msg: any) => (
                            <button
                                key={msg.id}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    setShowReplyForm(false);
                                    if (msg.status === 'unread') handleMarkAsRead(msg.id);
                                }}
                                className={`w-full text-left p-6 rounded-[32px] border transition-all duration-300 relative group ${selectedMessage?.id === msg.id
                                        ? "bg-[#2B2B2B] border-[#2B2B2B] shadow-xl translate-x-2"
                                        : "bg-white border-[#E8DCC8] hover:border-[#7C8C5C] hover:shadow-lg"
                                    }`}
                            >
                                {msg.status === 'unread' && (
                                    <div className="absolute top-6 right-6 w-2 h-2 bg-[#7C8C5C] rounded-full"></div>
                                )}

                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedMessage?.id === msg.id ? "bg-[#7C8C5C] text-white" : "bg-[#F5EBDC] text-[#7C8C5C]"
                                        }`}>
                                        {msg.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-black ${selectedMessage?.id === msg.id ? "text-white" : "text-[#2B2B2B]"}`}>
                                            {msg.name}
                                        </p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedMessage?.id === msg.id ? "text-gray-400" : "text-[#999]"}`}>
                                            {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                                        </p>
                                    </div>
                                </div>

                                <p className={`text-xs font-bold truncate ${selectedMessage?.id === msg.id ? "text-gray-400" : "text-[#555]"}`}>
                                    {msg.subject || "No Subject"}
                                </p>
                                <p className={`text-[11px] mt-1 line-clamp-2 ${selectedMessage?.id === msg.id ? "text-gray-500" : "text-[#999]"}`}>
                                    {msg.message}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Message Detail Area */}
                <div className="lg:col-span-7">
                    {selectedMessage ? (
                        <div className="bg-white rounded-[48px] border border-[#E8DCC8] shadow-sm flex flex-col h-full overflow-hidden">
                            {/* Detail Header */}
                            <div className="p-8 border-b border-[#E8DCC8] flex items-center justify-between bg-[#FAFAF7]/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#7C8C5C] rounded-2xl flex items-center justify-center text-white">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[#2B2B2B]">{selectedMessage.subject || "No Subject"}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            {selectedMessage.status === 'read' ? (
                                                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-green-600">
                                                    <CheckCheck className="w-3 h-3" /> Read
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-orange-500">
                                                    <Clock className="w-3 h-3" /> Unread
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    disabled={isDeleting === selectedMessage.id}
                                    className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isDeleting === selectedMessage.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Detail Body */}
                            <div className="p-10 flex-1 space-y-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">From</p>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-[#7C8C5C]" />
                                            <p className="text-sm font-black text-[#2B2B2B]">{selectedMessage.name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">Email Address</p>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-[#7C8C5C]" />
                                            <p className="text-sm font-black text-[#2B2B2B]">{selectedMessage.email || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">Received At</p>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-[#7C8C5C]" />
                                            <p className="text-sm font-black text-[#2B2B2B]">
                                                {format(new Date(selectedMessage.createdAt), "EEEE, MMMM yyyy @ h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-[#E8DCC8]/50" />

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">Message Content</p>
                                    <div className="bg-[#FAFAF7] p-8 rounded-[32px] border border-[#E8DCC8]/50 min-h-[150px]">
                                        <p className="text-base text-[#2B2B2B] font-medium leading-relaxed whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                {showReplyForm && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C]">Your Reply</p>
                                            <button
                                                onClick={() => setShowReplyForm(false)}
                                                className="text-[9px] font-black uppercase tracking-widest text-[#999] hover:text-red-500 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="bg-white border-2 border-[#7C8C5C]/30 rounded-[32px] p-2 focus-within:border-[#7C8C5C] transition-all">
                                            <textarea
                                                rows={5}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write your email reply here..."
                                                className="w-full bg-transparent p-6 outline-none text-sm font-medium resize-none"
                                            />
                                            <div className="p-2 border-t border-[#E8DCC8]/30 flex justify-end">
                                                <button
                                                    onClick={handleSendReply}
                                                    disabled={isSendingReply}
                                                    className="px-8 py-3 bg-[#7C8C5C] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#5D6B44] transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                                                >
                                                    {isSendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    Send Email
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Detail Footer */}
                            {!showReplyForm && selectedMessage.email && (
                                <div className="p-8 bg-[#FAFAF7] border-t border-[#E8DCC8] flex gap-4">
                                    <button
                                        onClick={() => setShowReplyForm(true)}
                                        className="flex-1 py-4 bg-[#2B2B2B] hover:bg-[#7C8C5C] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Compose Direct Reply
                                    </button>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "SoleBazaar Inquiry"}`}
                                        className="px-2 md:px-6 py-4 bg-white border-2 border-[#E8DCC8] text-[#2B2B2B] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#7C8C5C] transition-all shadow-sm flex items-center justify-center gap-3"
                                        title="Open in your email app"
                                    >
                                        <Send className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full bg-white rounded-[48px] border border-[#E8DCC8] border-dashed flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-[#F5EBDC] rounded-3xl flex items-center justify-center text-[#7C8C5C] mb-6">
                                <Eye className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-[#2B2B2B]">Select a message</h3>
                            <p className="text-sm text-[#999] font-bold mt-2 max-w-xs">
                                Click on any message from the list on the left to view the full details and reply to the customer.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Send } from "lucide-react";
