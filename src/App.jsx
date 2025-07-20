import React, { useRef, useState } from "react";
import PaginatedPDF from "./components/PaginatedPDF";
import ItineraryForm from "./components/ItineraryForm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const mockData = {
  travellerName: "Rahul",
  numDays: 6,
  departureFrom: "Kolkata",
  departureDate: "09/06/2025",
  destination: "Singapore",
  travellers: 4,
};

function App() {
  const pdfRef = useRef();
  const [formData, setFormData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setSubmitted(true);
  };

  const handleDownloadPDF = async () => {
    const pages = document.querySelectorAll('.pdf-page');
    const pdf = new jsPDF({ unit: 'px', format: [794, 1122] });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage([794, 1122], 'portrait');
      pdf.addImage(imgData, 'PNG', 0, 0, 794, 1122);
    }
    pdf.save('itinerary.pdf');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF4FF]">
      <header className="bg-[#541C9C] shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/Logo.png" alt="Company Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-white">Itinerary Builder</h1>
            <p className="text-sm text-white">Create your custom travel plan</p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center bg-[#FBF4FF]">
        {!submitted ? (
          <ItineraryForm onSubmit={handleFormSubmit} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 mt-4 px-8">
              <h2 className="text-xl font-semibold text-[#541C9C]">Your Custom Itinerary</h2>
              <button className="bg-[#936FE0] hover:bg-[#680099] text-white font-bold py-2 px-6 rounded transition" onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </div>
            <PaginatedPDF ref={pdfRef} data={formData} />
          </>
        )}
      </main>
      <footer className="bg-[#321E5D] text-white text-center py-4 text-sm border-t border-[#936FE0]">
        <div>Company Name &bull; Address Line 1, City, Country &bull; +91-1234567890 &bull; info@company.com</div>
      </footer>
    </div>
  );
}

export default App;
