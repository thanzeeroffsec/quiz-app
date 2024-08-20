import { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Button } from "./ui/button"; // Adjust import based on your project structure
import { useRouter } from "next/navigation";

export default function QRScanner() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const router = useRouter();

  const handleScanClick = () => {
    setIsScannerOpen(true); // Show the scanner overlay
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const result = detectedCodes[0]?.rawValue; // Use the first detected code
      if (result) {
        router.push(`/questions/${result}`);
      }
    }

    setIsScannerOpen(false); // Optionally close the scanner after scanning
  };

  const handleError = (error: any) => {
    console.error(error); // Handle any errors
    setIsScannerOpen(false); // Optionally close the scanner on error
  };

  const handleCancel = () => {
    setIsScannerOpen(false); // Close the scanner overlay
  };

  return (
    <div>
      <Button
        onClick={handleScanClick}
        className="bg-[hsl(262.1,83.3%,57.8%)] hover:bg-[hsl(262.1,83.3%,57.8%)]/80"
      >
        Scan QR Code
      </Button>

      {isScannerOpen && (
        <div className="scanner-overlay">
          <div className="scanner-container">
            <Scanner
              onScan={handleScan}
              styles={{}} // Use empty styles object or check available properties
            />
            <p className="scanner-overlay-text">Scan QR Code</p>
            <Button onClick={handleCancel} className="scanner-cancel-button">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scanner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scanner-container {
          position: relative;
          width: 90%;
          height: 80%;
          max-width: 500px;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .scanner-overlay-text {
          color: #fff;
          font-size: 18px;
          text-align: center;
          margin-bottom: 10px; /* Space between text and button */
        }
        .scanner-cancel-button {
          background-color: red;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 16px;
          outline: none;
          margin-top: 10px; /* Space from QR scanner */
        }
        .scanner-cancel-button:hover {
          background-color: darkred;
        }
      `}</style>
    </div>
  );
}
