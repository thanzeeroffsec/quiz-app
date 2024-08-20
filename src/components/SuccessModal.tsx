import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  correctAnswers: number | null;
  wrongAnswers: number | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  show,
  onClose,
  correctAnswers = 0, // Default value if null
  wrongAnswers = 0, // Default value if null
}) => {
  const router = useRouter();

  // Handle closing the modal and redirecting
  const handleClose = () => {
    onClose(); // Close the modal
    router.push("/"); // Redirect to the home page
  };

  return (
    <Dialog open={show} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quiz Submitted Successfully!</DialogTitle>
          <DialogDescription>
            Your quiz has been submitted. Here are your results:
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>Correct Answers: {correctAnswers ?? 0}</p>{" "}
          {/* Handle null values */}
          <p>Wrong Answers: {wrongAnswers ?? 0}</p> {/* Handle null values */}
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
