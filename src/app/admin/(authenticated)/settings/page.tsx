"use client";

import { useState, useEffect } from "react";
import { 
    Globe, 
    Smartphone, 
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Save,
    RotateCcw,
    Loader2,
    MessageCircle,
    Shield
} from "lucide-react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function SettingsPage() {
    const { data: settings, mutate, isLoading } = useSWR("/api/admin/settings", fetcher);
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            
            if (!res.ok) throw new Error("Failed to update");
            
            await mutate();
            toast.success("Settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "contact", label: "Contact Info", icon: Mail },
        { id: "social", label: "Social Media", icon: Smartphone },
        { id: "email", label: "Email / Notifications", icon: Shield },
    ];

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header / Tabs */}
            <div className="rounded-[40px] shadow-sm border border-[#E8DCC8] p-6 flex flex-wrap gap-4 items-center justify-between sticky top-20 z-10 backdrop-blur-xl bg-white/90">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                                activeTab === tab.id
                                    ? "bg-[#2B2B2B] text-white shadow-xl scale-105"
                                    : "bg-[#FAFAF7] text-[#555] hover:bg-[#E8DCC8]/30"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => setFormData(settings)}
                        className="p-3.5 bg-white border border-[#E8DCC8] text-[#555] rounded-2xl hover:bg-[#FAFAF7] transition-all"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-3 px-8 py-3.5 bg-[#7C8C5C] hover:bg-[#5C6C3C] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-[48px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                            <div className="p-10 border-b border-[#E8DCC8]">
                                <h3 className="text-xl font-black text-[#2B2B2B]">Website Configuration</h3>
                                <p className="text-xs text-[#999] font-bold mt-1">Manage basic site information and settings</p>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Site Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.siteName || ""}
                                        onChange={(e) => handleInputChange("siteName", e.target.value)}
                                        className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                        placeholder="e.g. SOLEBAZAR"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Meta Description</label>
                                    <textarea 
                                        rows={4}
                                        value={formData.siteDescription || ""}
                                        onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                                        className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all resize-none"
                                        placeholder="Brief description for SEO..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="bg-white rounded-[48px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                            <div className="p-10 border-b border-[#E8DCC8]">
                                <h3 className="text-xl font-black text-[#2B2B2B]">Contact Information</h3>
                                <p className="text-xs text-[#999] font-bold mt-1">How customers can reach your business</p>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-4">
                                            <Mail className="w-3.5 h-3.5 text-[#7C8C5C]" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">Business Email</label>
                                        </div>
                                        <input 
                                            type="email" 
                                            value={formData.email || ""}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="support@example.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-4">
                                            <Phone className="w-3.5 h-3.5 text-[#7C8C5C]" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">Business Phone</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.phone || ""}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="+92 3XX XXXXXXX"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 ml-4">
                                        <MapPin className="w-3.5 h-3.5 text-[#7C8C5C]" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">Physical Address</label>
                                    </div>
                                    <textarea 
                                        rows={3}
                                        value={formData.address || ""}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all resize-none"
                                        placeholder="Full address of your office/store..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="bg-white rounded-[48px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                            <div className="p-10 border-b border-[#E8DCC8]">
                                <h3 className="text-xl font-black text-[#2B2B2B]">Social Media Links</h3>
                                <p className="text-xs text-[#999] font-bold mt-1">Connect your brand's social presence</p>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-4">
                                            <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">Facebook URL</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.facebook || ""}
                                            onChange={(e) => handleInputChange("facebook", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#1877F2] font-bold text-sm transition-all"
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-4">
                                            <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">Instagram URL</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.instagram || ""}
                                            onChange={(e) => handleInputChange("instagram", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#E4405F] font-bold text-sm transition-all"
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-4">
                                            <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">Twitter / X URL</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.twitter || ""}
                                            onChange={(e) => handleInputChange("twitter", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#1DA1F2] font-bold text-sm transition-all"
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 ml-4">
                                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#555]">WhatsApp Support URL</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.whatsapp || ""}
                                            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#25D366] font-bold text-sm transition-all"
                                            placeholder="https://wa.me/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div className="bg-white rounded-[48px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                            <div className="p-10 border-b border-[#E8DCC8]">
                                <h3 className="text-xl font-black text-[#2B2B2B]">Email Notifications & SMTP</h3>
                                <p className="text-xs text-[#999] font-bold mt-1">Configure automated alerts and email server settings</p>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Notification Recipient Email</label>
                                        <input 
                                            type="email" 
                                            value={formData.notificationEmail || ""}
                                            onChange={(e) => handleInputChange("notificationEmail", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="khubaibsyed820@gmail.com"
                                        />
                                        <p className="text-[9px] text-[#999] ml-4 font-bold uppercase tracking-tight">Emails for orders/messages will be sent here</p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">SMTP From Address</label>
                                        <input 
                                            type="text" 
                                            value={formData.smtpFrom || ""}
                                            onChange={(e) => handleInputChange("smtpFrom", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="SoleBazar <noreply@solebazar.com>"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-[#E8DCC8]/50" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">SMTP Host</label>
                                        <input 
                                            type="text" 
                                            value={formData.smtpHost || ""}
                                            onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="smtp.gmail.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">SMTP Port</label>
                                        <input 
                                            type="number" 
                                            value={formData.smtpPort || 587}
                                            onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="587"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">SMTP User</label>
                                        <input 
                                            type="text" 
                                            value={formData.smtpUser || ""}
                                            onChange={(e) => handleInputChange("smtpUser", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="your-email@gmail.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">SMTP Password / App Password</label>
                                        <input 
                                            type="password" 
                                            value={formData.smtpPass || ""}
                                            onChange={(e) => handleInputChange("smtpPass", e.target.value)}
                                            className="w-full px-8 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                                            placeholder="••••••••••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info Panels */}
                <div className="space-y-8">
                    <div className="bg-[#2B2B2B] p-10 rounded-[48px] shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C8C5C] opacity-20 blur-3xl rounded-full"></div>
                        <h4 className="text-xl font-black italic uppercase tracking-wider mb-4">Quick <span className="text-[#7C8C5C]">Tip</span></h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-bold">
                            Changes saved here will be reflected across your entire application in real-time. Make sure to double-check your support email and phone numbers.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] shadow-sm border border-[#E8DCC8]">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-6">Website Status</h4>
                        <div className="space-y-6">
                            {[
                                { label: "Landing Page", status: "Active" },
                                { label: "Order System", status: "Active" },
                                { label: "Admin Panel", status: "Active" },
                                { label: "API Sync", status: "Active" },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-[#2B2B2B]">{s.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-green-600">{s.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
