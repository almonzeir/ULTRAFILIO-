'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
    id: string;
    label: string;
}

export function SortableSection({ id, label }: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg select-none ${isDragging ? 'opacity-50 shadow-lg z-50' : ''
                }`}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
            >
                <GripVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <span className="font-medium text-sm sm:text-base text-slate-700 dark:text-slate-200 truncate">{label}</span>
        </div>
    );
}
