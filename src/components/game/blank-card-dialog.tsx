import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BlankCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

const BlankCardDialog: React.FC<BlankCardDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [blankCardContent, setBlankCardContent] = useState<string>("");

  const handleSubmit = () => {
    if (blankCardContent.trim() !== "") {
      onSubmit(blankCardContent);
      setBlankCardContent("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill in the blank card</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Enter your answer"
          value={blankCardContent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBlankCardContent(e.target.value)
          }
        />
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlankCardDialog;
