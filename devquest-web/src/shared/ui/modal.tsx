import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XIcon } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function Modal({ open, onClose, children, size = "md" }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* 모달 위치 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={`w-full ${sizeMap[size]} bg-white rounded-lg shadow-lg overflow-hidden`}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 px-4 py-2">
      <DialogTitle className="text-base font-medium text-white">
        {title}
      </DialogTitle>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        <XIcon size={18} />
      </button>
    </div>
  );
}

export function ModalBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-6 ${className}`}>{children}</div>;
}
