"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "info";

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
}: {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}) {
  const styles = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    error: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    info: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  };

  const Icons = {
    success: <CheckCircleIcon className="size-5" />,
    error: <XCircleIcon className="size-5" />,
    info: <InformationCircleIcon className="size-5" />,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${styles[type]}`}
        >
          {Icons[type]}
          <p className="text-sm font-semibold">{message}</p>
          <button onClick={onClose} className="ml-4 hover:opacity-70">
            <XCircleIcon className="size-4 opacity-50" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
