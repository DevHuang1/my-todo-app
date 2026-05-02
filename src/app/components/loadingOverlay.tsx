import { motion, AnimatePresence } from "framer-motion";

export default function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09090b]/60 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            {/* Elegant Spinner */}
            <div className="relative size-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shadow-[0_0_15px_#6366f1]" />
            </div>
            <p className="text-xs font-medium tracking-widest text-indigo-400 uppercase animate-pulse">
              Processing...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
