"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Plus } from "lucide-react";

interface CloudinaryUploadProps {
    onUpload: (url: string) => void;
}

export default function CloudinaryUpload({ onUpload }: CloudinaryUploadProps) {
    return (
        <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            onSuccess={(result: any) => {
                if (result.info && typeof result.info !== "string" && result.info.secure_url) {
                    onUpload(result.info.secure_url);
                }
            }}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "solebazaar"}
            options={{
                multiple: true,
                folder: "solebazaar/products",
                theme: "minimal",
                styles: {
                    palette: {
                        window: "#FAFAF7",
                        sourceBg: "#FFFFFF",
                        windowBorder: "#E8DCC8",
                        tabIcon: "#7C8C5C",
                        inactiveTabIcon: "#A3B38A",
                        menuIcons: "#2B2B2B",
                        link: "#7C8C5C",
                        action: "#7C8C5C",
                        inProgress: "#7C8C5C",
                        complete: "#7C8C5C",
                        error: "#FF4D4D",
                        textDark: "#2B2B2B",
                        textLight: "#FFFFFF"
                    }
                }
            }}
        >
            {({ open }) => (
                <button
                    type="button"
                    onClick={() => open()}
                    className="aspect-[4/5] rounded-[16px] md:rounded-[32px] border-2 md:border-4 border-dashed border-[#E8DCC8] flex flex-col items-center justify-center text-[#E8DCC8] hover:text-[#7C8C5C] hover:border-[#7C8C5C] transition-all gap-4 group bg-white/50"
                >
                    <Plus className="w-6 h-6 md:w-12 md:h-12 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] md:text-sm font-black uppercase tracking-widest text-[#555]">Upload Images</span>
                </button>
            )}
        </CldUploadWidget>
    );
}
