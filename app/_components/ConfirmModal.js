
"use client";

import { useEffect, useRef } from "react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);
    return (
        <dialog
            ref={dialogRef}
            onCancel={onClose}
            className="rounded-lg p-6 backdrop:bg-black/50 bg-gray-100"
        >
            <div className="space-y-4">
                {children}
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:scale-105 transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:scale-105 transition-all duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </dialog>
    );
}
