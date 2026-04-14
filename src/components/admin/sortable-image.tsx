"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Image as ImageIcon } from "lucide-react";

interface SortableImageProps {
    id: string;
    url: string;
    index: number;
    onRemove: (index: number) => void;
}

export default function SortableImage({ id, url, index, onRemove }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.3 : 1,
        scale: isDragging ? 1.05 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group aspect-[4/5] rounded-[16px] md:rounded-[32px] overflow-hidden border-2 transition-all ${isDragging ? "border-[#7C8C5C] shadow-2xl" : "border-[#E8DCC8] bg-[#FAFAF7] shadow-sm hover:shadow-md"
                }`}
        >
            {url ? (
                <img src={url} className="w-full h-full object-cover select-none pointer-events-none" alt={`Product ${index + 1}`} />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-[#E8DCC8]">
                    <ImageIcon className="w-10 h-10" />
                </div>
            )}

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-2xl cursor-grab text-[#2B2B2B] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all border border-[#E8DCC8] shadow-sm z-30"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Remove Button */}
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-2xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-lg active:scale-95 z-30 flex items-center justify-center"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* URL Badge */}
            <div className="absolute bottom-4 left-4 right-4 px-3 py-2 bg-white/80 backdrop-blur-md rounded-2xl text-[8px] font-black truncate text-[#2B2B2B] border border-white/20 select-none text-center">
                {index === 0 ? "Thumbnail" : `Image ${index + 1}`}
            </div>

            {/* Overlay for dragging */}
            {isDragging && (
                <div className="absolute inset-0 bg-[#7C8C5C]/10 border-4 border-[#7C8C5C] rounded-[16px] md:rounded-[32px]" />
            )}
        </div>
    );
}
