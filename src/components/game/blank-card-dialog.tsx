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
import { useMutation } from "@tanstack/react-query";
import { moderateContent } from "@/lib/actions/moderate";

interface BlankCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  prompt: string;
}

const BlankCardDialog: React.FC<BlankCardDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prompt,
}) => {
  const [blankCardContent, setBlankCardContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const moderationMutation = useMutation({
    mutationFn: (content: string) => moderateContent(prompt, content),
    onSuccess: (isSafe) => {
      if (isSafe) {
        onSubmit(blankCardContent);
        setBlankCardContent("");
        setError(null);
      } else {
        setError("Your answer didn't pass moderation. Please try again.");
      }
    },
    onError: () => {
      setError("An error occurred. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (blankCardContent.trim() !== "") {
      moderationMutation.mutate(blankCardContent);
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
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={moderationMutation.isPending}
          >
            {moderationMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlankCardDialog;
