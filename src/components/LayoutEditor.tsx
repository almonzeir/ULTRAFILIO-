'use client';
import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';

// Default section order
export const DEFAULT_SECTION_ORDER = ['hero', 'about', 'experience', 'projects', 'contact'];

// Human-readable labels for sections
const SECTION_LABELS: Record<string, string> = {
    hero: 'Hero / Introduction',
    about: 'About Me',
    experience: 'Experience',
    projects: 'Projects / Work',
    contact: 'Contact',
};

interface LayoutEditorProps {
    sectionOrder: string[];
    onOrderChange: (newOrder: string[]) => void;
}

export function LayoutEditor({ sectionOrder, onOrderChange }: LayoutEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id as string);
            const newIndex = sectionOrder.indexOf(over.id as string);
            onOrderChange(arrayMove(sectionOrder, oldIndex, newIndex));
        }
    };

    return (
        <div className="space-y-4">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Section Order</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Drag sections to reorder how they appear on your portfolio.
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {sectionOrder.map((sectionId) => (
                            <SortableSection
                                key={sectionId}
                                id={sectionId}
                                label={SECTION_LABELS[sectionId] || sectionId}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
