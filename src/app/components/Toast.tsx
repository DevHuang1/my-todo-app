"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "info" | "confirm";

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  onConfirm,
}: {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  const styles = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    error: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    info: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    confirm:
      "bg-zinc-900 border-white/10 text-white shadow-2xl ring-1 ring-white/10",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`fixed bottom-8 right-8 z-[100] flex flex-col gap-3 rounded-2xl border p-4 backdrop-blur-xl min-w-[300px] ${styles[type]}`}
        >
          <div className="flex items-center gap-3">
            {type === "confirm" ? (
              <ExclamationTriangleIcon className="size-5 text-amber-500" />
            ) : (
              <InformationCircleIcon className="size-5" />
            )}
            <p className="text-sm font-semibold">{message}</p>
          </div>

          {type === "confirm" && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors"
              >
                Confirm Unfriend
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
