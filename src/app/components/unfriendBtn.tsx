"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Toast, { ToastType } from "./Toast";
import { UserMinusIcon } from "@heroicons/react/24/outline";

export default function UnfriendButton({
  friendId,
  friendName,
  myId,
}: {
  friendId: string;
  friendName: string;
  myId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info" as ToastType,
    onConfirm: undefined as any,
  });
  const supabase = createClient();
  const router = useRouter();

  const showToast = (message: string, type: ToastType) => {
    setToast({ isVisible: true, message, type, onConfirm: undefined });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  };

  const confirmUnfriend = () => {
    setToast({
      isVisible: true,
      type: "confirm",
      message: `Remove ${friendName} from friends?`,
      onConfirm: executeUnfriend,
    });
  };

  const executeUnfriend = async () => {
    setIsDeleting(true);
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(user_id.eq.${myId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${myId})`,
      );

    if (!error) {
      router.push("/friends");
      router.refresh();
    } else {
      showToast("Failed to unfriend.", "error");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toast
        {...toast}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <button
        onClick={confirmUnfriend}
        disabled={isDeleting}
        className="flex h-full w-full items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs disabled:opacity-50"
      >
        <UserMinusIcon className="size-4" />
        {isDeleting ? "Removing..." : "Unfriend"}
      </button>
    </>
  );
}
