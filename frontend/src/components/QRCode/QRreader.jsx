import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';

const QRScanner = () => {
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const scanComplete = useRef(false); // Ref to prevent multiple scans

  useEffect(() => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      );

      const handleScan = async (decodedText) => {
        if (scanComplete.current) return; // Prevent multiple scans
        scanComplete.current = true; // Mark scan as complete

        const token = localStorage.getItem("token");

        if (token) {
          try {
            const response = await fetch(
              "https://campus-mate.onrender.com/getTokenForSecurity",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({ scanResult: decodedText }),
              }
            );

            const data = await response.json();

            if (response.ok) {
              console.log("Scan result sent successfully", data);
            } else {
              console.error("Failed to send scan result", data);
            }
          } catch (error) {
            console.error("Error sending scan result:", error);
          }
        }

        // Open the scanned URL in a new tab
        window.open(decodedText, "_blank");

        // Clear scanner to prevent re-trigger
        scanner.clear();
        scanner.render(handleScan, handleError);
        scanComplete.current = false; // Reset for future scans
      };

      const handleError = (err) => {
        setError("Scanning failed. Please try again.");
        console.error("QR Scanning Error: ", err);
        scanComplete.current = false; // Reset scan state
      };

      scanner.render(handleScan, handleError);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear(); // Cleanup scanner
        scannerRef.current = null;
      }
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("https://campus-mate.onrender.com/logout", {}, { withCredentials: true });

      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-100">
      <div className="grid grid-cols-3 gap-20">
        <div className="col-span-1/3"></div>
        <h1 className="text-3xl font-bold mb-4 text-[#e82574]">QR Code Scanner</h1>
        <button className="bg-[#e82574] w-20 text-white rounded-xl mb-5 ml-20 h-10" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="bg-white w-[98%] h-[70%] flex flex-col items-center justify-center rounded-[10px]">
        <div id="reader" className="w-full max-w-sm mb-4"></div>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
            <h2 className="text-lg font-semibold">Instructions:</h2>
            Reload The Page After each scan
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
