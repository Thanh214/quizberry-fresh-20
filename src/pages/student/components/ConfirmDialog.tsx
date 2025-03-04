
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  warning?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  warning,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        
        {warning && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{warning}</p>
          </div>
        )}
        
        <p className="mb-5 text-muted-foreground">{message}</p>
        
        <div className="flex justify-end gap-3">
          <button 
            className="px-4 py-2 border border-input rounded-md text-sm"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
