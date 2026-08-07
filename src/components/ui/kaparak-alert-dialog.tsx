"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KaparakAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  actionText?: string;
  onAction: () => void;
  destructive?: boolean;
}

export function KaparakAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Batal",
  actionText = "Konfirmasi",
  onAction,
  destructive = false,
}: KaparakAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-md
          overflow-hidden
          border
          border-white/10
          bg-[#090909]/95
          p-0
          text-white
          shadow-[0_30px_100px_rgba(0,0,0,0.8)]
          backdrop-blur-2xl
          sm:rounded-3xl
        "
      >
        {/* TOP ACCENT */}
        <div
          className={`absolute inset-x-0 top-0 h-[2px] ${
            destructive ? "bg-red-500" : "bg-[#19622B]"
          }`}
        />

        {/* BACKGROUND GLOW */}
        <div
          className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl ${
            destructive ? "bg-red-500/10" : "bg-[#19622B]/20"
          }`}
        />

        <div className="relative p-7 sm:p-8">
          <AlertDialogHeader className="space-y-0">
            {/* BRAND LABEL */}
            <div className="mb-7 flex items-center gap-2">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  destructive
                    ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                    : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                }`}
              />

              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-white/40">
                KAPARAK • Confirmation
              </span>
            </div>

            {/* ICON */}
            <div className="mb-6">
              <div
                className={`
                  relative flex h-14 w-14 items-center justify-center
                  rounded-2xl
                  border
                  ${
                    destructive
                      ? "border-red-500/20 bg-red-500/10"
                      : "border-green-500/20 bg-green-500/10"
                  }
                `}
              >
                {/* ICON GLOW */}
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl ${
                    destructive ? "bg-red-500/10" : "bg-green-500/10"
                  }`}
                />

                {destructive ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="relative h-6 w-6 text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008v.008H12V15z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="relative h-6 w-6 text-green-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008v.008H12V15z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* TITLE */}
            <AlertDialogTitle
              className="
                max-w-sm
                text-2xl
                font-black
                uppercase
                leading-tight
                tracking-tight
                text-white
              "
            >
              {title}
            </AlertDialogTitle>

            {/* DESCRIPTION */}
            <AlertDialogDescription
              className="
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-white/45
              "
            >
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* DIVIDER */}
          <div className="my-7 h-px bg-white/6" />

          {/* FOOTER */}
          <AlertDialogFooter className="flex-row justify-end gap-3 bg-black">
            <AlertDialogCancel
              className="
                mt-0
                h-10
                rounded-xl
                border
                border-white/10
                bg-white/3
                px-5
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white/50
                transition-all
                duration-300
                hover:border-white/20
                hover:bg-white/[0.07]
                hover:text-white
                focus:ring-0
              "
            >
              {cancelText}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={onAction}
              className={`
                mt-0
                h-10
                rounded-xl
                border
                px-6
                font-mono
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-white
                shadow-lg
                transition-all
                duration-300
                focus:ring-0
                ${
                  destructive
                    ? `
                      border-red-500/30
                      bg-red-600
                      shadow-red-900/20
                      hover:border-red-400
                      hover:bg-red-500
                      hover:shadow-red-900/30
                    `
                    : `
                      border-green-500/30
                      bg-[#19622B]
                      shadow-green-900/20
                      hover:border-green-400
                      hover:bg-[#227a38]
                      hover:shadow-green-900/30
                    `
                }
              `}
            >
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
