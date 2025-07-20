import React from "react";

const PAGE_HEIGHT = 1122; // px for A4 at 96dpi
const PAGE_WIDTH = 794; // px for A4 at 96dpi
const FOOTER_HEIGHT = 80;
const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - FOOTER_HEIGHT - 48; // 48px for padding

const SectionTitle = ({ children, color = "#541C9C" }) => (
  <div className="text-lg font-bold mb-4" style={{ color }}>{children}</div>
);

const Table = ({ headers, rows, headerBg = "#541C9C", headerText = "#fff" }) => (
  <table className="w-full mb-6 text-sm border-separate" style={{ borderSpacing: 0 }}>
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="py-2 px-3 font-semibold" style={{ background: headerBg, color: headerText, borderTopLeftRadius: i === 0 ? 12 : 0, borderTopRightRadius: i === headers.length - 1 ? 12 : 0 }}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} className="py-2 px-3 text-[#321E5D] border-b border-[#E5E7EB] bg-white">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const GradientBox = ({ children }) => (
  <div
    className="rounded-xl p-6 text-center text-white mb-6"
    style={{ background: "linear-gradient(90deg, #541C9C 0%, #936FE0 100%)" }}
  >
    {children}
  </div>
);

const ArrowBox = ({ left, right }) => (
  <div className="flex items-center mb-2">
    <div className="bg-[#FBF4FF] border border-[#936FE0] rounded-l-full px-4 py-2 font-semibold text-[#541C9C] text-sm" style={{ borderRight: 0 }}>{left}</div>
    <div className="bg-white border border-[#936FE0] rounded-r-full px-4 py-2 font-semibold text-[#321E5D] text-sm" style={{ borderLeft: 0 }}>{right}</div>
  </div>
);

const Footer = () => (
  <div className="absolute bottom-0 left-0 w-full pt-4 border-t border-[#936FE0] flex items-center justify-between text-xs text-[#321E5D] bg-white" style={{height: FOOTER_HEIGHT}}>
    <div className="pl-4">
      Vigovia Tech Pvt. Ltd.<br />
      Registered Office: Hd-109 Cinnabar Hills, Links Business Park, Karnataka, India.
    </div>
    <div className="text-right pr-4">
      <b>Phone:</b> +91-99X9999999<br />
      <b>Email ID:</b> Contact@Vigovia.Com
    </div>
    <div className="flex flex-col items-end pr-4">
      <div className="text-[#541C9C] font-bold text-lg">vigovia</div>
      <div className="text-xs text-[#321E5D]">PLAN.PACK.GO</div>
    </div>
  </div>
);

const DayCard = ({ day, index }) => (
  <div className="flex gap-4 mb-8">
    {/* Timeline */}
    <div className="flex flex-col items-center min-w-[60px]">
      <div className="bg-[#541C9C] text-white rounded-full px-3 py-2 font-bold mb-2 text-xs" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
        Day {index + 1}
      </div>
      <div className="flex-1 w-1 bg-gradient-to-b from-[#936FE0] to-[#541C9C]" style={{ minHeight: 80 }}></div>
    </div>
    {/* Card Content */}
    <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] shadow p-4 flex flex-col md:flex-row gap-4">
      {/* Image */}
      <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-[#FBF4FF] flex items-center justify-center">
        {/* Local logo as placeholder image */}
        <img src="/Logo.png" alt="Activity" className="object-cover w-full h-full" />
      </div>
      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-[#541C9C] text-lg mb-1">{day.date || "27th November"}</div>
          <div className="text-[#321E5D] font-semibold mb-2">Arrival in Singapore & City Exploration</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <div className="font-bold text-[#680099]">Morning</div>
            <div className="text-[#321E5D]">{day.morning || "Arrive in Singapore. Transfer From Airport To Hotel."}</div>
          </div>
          <div>
            <div className="font-bold text-[#680099]">Afternoon</div>
            <div className="text-[#321E5D]">{day.afternoon || "Check into your hotel. Visit Marina Bay Sands Sky Park (2-3 Hours)."}</div>
          </div>
          <div>
            <div className="font-bold text-[#680099]">Evening</div>
            <div className="text-[#321E5D]">{day.evening || "Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)"}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PdfPage = ({ children }) => (
  <div
    className="pdf-page relative mb-12 mx-auto bg-white shadow"
    style={{
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      boxSizing: "border-box",
      pageBreakAfter: "always",
      overflow: "hidden",
      border: "1px dashed #936FE0",
      position: "relative"
    }}
  >
    <div className="pb-24 px-8 pt-8" style={{ minHeight: PAGE_HEIGHT - FOOTER_HEIGHT }}>
      {children}
    </div>
    <Footer />
  </div>
);

// Utility to chunk an array into groups that fit per page
function chunkByHeight(items, estHeight, maxHeight) {
  const result = [];
  let chunk = [];
  let height = 0;
  for (let i = 0; i < items.length; i++) {
    if (height + estHeight > maxHeight && chunk.length > 0) {
      result.push(chunk);
      chunk = [];
      height = 0;
    }
    chunk.push(items[i]);
    height += estHeight;
  }
  if (chunk.length > 0) result.push(chunk);
  return result;
}

const ItineraryPDF = ({ data }) => {
  // Sample data for all sections
  const flightRows = [
    ["Thu 10 Jan'24", <b>Fly Air India</b>, "From Delhi (DEL) To Singapore (SIN)."],
    ["Thu 10 Jan'24", <b>Fly Air India</b>, "From Delhi (DEL) To Singapore (SIN)."],
    ["Thu 10 Jan'24", <b>Fly Air India</b>, "From Delhi (DEL) To Singapore (SIN)."],
    ["Thu 10 Jan'24", <b>Fly Air India</b>, "From Delhi (DEL) To Singapore (SIN)."],
  ];
  const hotelRows = [
    ["Singapore", "24/02/2024", "24/02/2024", "2", "Super Townhouse Oak Vashi Formerly Blue Diamond"],
    ["Singapore", "24/02/2024", "24/02/2024", "2", "Super Townhouse Oak Vashi Formerly Blue Diamond"],
    ["Singapore", "24/02/2024", "24/02/2024", "2", "Super Townhouse Oak Vashi Formerly Blue Diamond"],
    ["Singapore", "24/02/2024", "24/02/2024", "2", "Super Townhouse Oak Vashi Formerly Blue Diamond"],
    ["Singapore", "24/02/2024", "24/02/2024", "2", "Super Townhouse Oak Vashi Formerly Blue Diamond"],
  ];
  const notesRows = [
    ["Airlines Standard Policy", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Flight/Hotel Cancellation", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Trip Insurance", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Hotel Check-In & Check Out", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Visa Rejection", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
  ];
  const serviceRows = [
    ["Flight Tickets And Hotel Vouchers", "Delivered 3 Days Post Full Payment"],
    ["Web Check-In", "Boarding Pass Delivery Via Email/WhatsApp"],
    ["Support", "Chat Support – Response Time: 4 Hours"],
    ["Cancellation Support", "Provided"],
    ["Trip Support", "Response Time: 5 Minutes"],
  ];
  const inclusionRows = [
    ["Flight", "2", "All Flights Mentioned", "Awaiting Confirmation"],
    ["Tourist Tax", "2", "Yotel (Singapore), Oakwood (Sydney), Mercure (Cairns), Novotel (Gold Coast), Holiday Inn (Melbourne)", "Awaiting Confirmation"],
    ["Hotel", "2", "Airport To Hotel - Hotel To Attractions - Day Trips If Any", "Included"],
  ];
  const activityRows = Array(12).fill(["Rio De Janeiro", "Sydney Harbour Cruise & Taronga  Zoo", "2D-07-2025/04:00PM", "2-3 Hours"]);
  const paymentRows = [
    ["Installment 1", "₹3,50,000", "Initial Payment"],
    ["Installment 2", "₹4,00,000", "Post Visa Approval"],
    ["Installment 3", "Remaining", "20 Days Before Departure"],
  ];
  // Sample day-by-day itinerary data
  const days = [
    {
      date: "27th November",
      morning: "Arrive in Singapore. Transfer From Airport To Hotel.",
      afternoon: "Check into your hotel. Visit Marina Bay Sands Sky Park (2-3 Hours).",
      evening: "Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)",
      image: "/Logo.png"
    },
    {
      date: "28th November",
      morning: "Breakfast at hotel. Universal Studios Singapore.",
      afternoon: "Lunch at Sentosa. S.E.A. Aquarium visit.",
      evening: "Wings of Time show at Sentosa Beach.",
      image: "/Logo.png"
    },
    {
      date: "29th November",
      morning: "Breakfast at hotel. Shopping at Orchard Road.",
      afternoon: "Lunch at Clarke Quay. River Cruise.",
      evening: "Night Safari at Singapore Zoo.",
      image: "/Logo.png"
    }
  ];

  // Estimate heights (in px) for chunking
  const DAY_CARD_HEIGHT = 220;
  const TABLE_HEADER_HEIGHT = 48;
  const TABLE_ROW_HEIGHT = 32;

  // Chunk itinerary days
  const dayChunks = chunkByHeight(days, DAY_CARD_HEIGHT, PAGE_CONTENT_HEIGHT);
  // Chunk table rows for each table
  const flightChunks = chunkByHeight(flightRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const hotelChunks = chunkByHeight(hotelRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT - 80); // 80px for notes
  const notesChunks = chunkByHeight(notesRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const serviceChunks = chunkByHeight(serviceRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const inclusionChunks = chunkByHeight(inclusionRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT - 80);
  const activityChunks = chunkByHeight(activityRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const paymentChunks = chunkByHeight(paymentRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);

  return (
    <div className="w-full flex flex-col items-center">
      {/* COVER PAGE */}
      <PdfPage>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <img src="/Logo.png" alt="Logo" className="h-10" />
          <div className="text-right">
            <div className="text-[#541C9C] font-bold text-lg">vigovia</div>
            <div className="text-xs text-[#321E5D]">PLAN.PACK.GO</div>
          </div>
        </div>
        {/* Gradient Box */}
        <GradientBox>
          <div className="text-lg font-bold">Hi, {data.travellerName || "Rahul"}!</div>
          <div className="text-2xl font-bold">{data.tripTitle || "Singapore Itinerary"}</div>
          <div className="text-base mt-1">{data.numDays || 6} Days {data.numNights || 5} Nights</div>
          {/* Icons row placeholder */}
          <div className="flex justify-center gap-4 mt-2">
            <span>✈️</span><span>🏨</span><span>🍽️</span><span>🚗</span><span>🏝️</span><span>🎫</span>
          </div>
        </GradientBox>
        {/* Trip Info Table */}
        <div className="border rounded-xl p-4 mb-6 grid grid-cols-5 gap-2 text-xs text-[#321E5D] font-semibold">
          <div>
            <div className="mb-1">Departure From</div>
            <div className="font-bold text-[#541C9C]">{data.departureFrom || "Kolkata"}</div>
          </div>
          <div>
            <div className="mb-1">Departure</div>
            <div className="font-bold text-[#541C9C]">{data.departureDate || "09/06/2025"}</div>
          </div>
          <div>
            <div className="mb-1">Arrival</div>
            <div className="font-bold text-[#541C9C]">{data.arrivalDate || "15/06/2025"}</div>
          </div>
          <div>
            <div className="mb-1">Destination</div>
            <div className="font-bold text-[#541C9C]">{data.destination || "Singapore"}</div>
          </div>
          <div>
            <div className="mb-1">No. Of Travellers</div>
            <div className="font-bold text-[#541C9C]">{data.travellers || 4}</div>
          </div>
        </div>
      </PdfPage>

      {/* DAY-BY-DAY ITINERARY PAGE(S) */}
      {dayChunks.map((chunk, idx) => (
        <PdfPage key={"days-"+idx}>
          {chunk.map((day, i) => (
            <DayCard key={i} day={day} index={i + idx * chunk.length} />
          ))}
        </PdfPage>
      ))}

      {/* Flight Summary */}
      {flightChunks.map((chunk, idx) => (
        <PdfPage key={"flight-"+idx}>
          <SectionTitle color="#321E5D">Flight <span style={{ color: '#936FE0' }}>Summary</span></SectionTitle>
          {chunk.map((row, i) => (
            <ArrowBox key={i} left={row[0]} right={<><b>{row[1]}</b> {row[2]}</>} />
          ))}
          {idx === flightChunks.length - 1 && (
            <div className="text-xs text-[#321E5D] mt-2 mb-6">Note: All Flights Include Meals, Seat Choice (Excluding XL), And 20kg/25Kg Checked Baggage.</div>
          )}
        </PdfPage>
      ))}

      {/* Hotel Bookings */}
      {hotelChunks.map((chunk, idx) => (
        <PdfPage key={"hotel-"+idx}>
          <SectionTitle color="#321E5D">Hotel <span style={{ color: '#936FE0' }}>Bookings</span></SectionTitle>
          <Table
            headers={["City", "Check In", "Check Out", "Nights", "Hotel Name"]}
            rows={chunk}
            headerBg="#541C9C"
            headerText="#fff"
          />
          {idx === hotelChunks.length - 1 && (
            <div className="text-xs text-[#321E5D] mb-6">
              1. All Hotels Are Tentative And Can Be Replaced With Similar.<br />
              2. Breakfast Included For All Hotel Stays.<br />
              3. All Hotels Will Be 4* And Above Category<br />
              4. A maximum occupancy of 2 people/room is allowed in most hotels.
            </div>
          )}
        </PdfPage>
      ))}

      {/* Important Notes */}
      {notesChunks.map((chunk, idx) => (
        <PdfPage key={"notes-"+idx}>
          <SectionTitle color="#321E5D">Important <span style={{ color: '#936FE0' }}>Notes</span></SectionTitle>
          <Table
            headers={["Point", "Details"]}
            rows={chunk}
            headerBg="#541C9C"
            headerText="#fff"
          />
        </PdfPage>
      ))}

      {/* Scope of Service */}
      {serviceChunks.map((chunk, idx) => (
        <PdfPage key={"service-"+idx}>
          <SectionTitle color="#321E5D">Scope Of <span style={{ color: '#936FE0' }}>Service</span></SectionTitle>
          <Table
            headers={["Service", "Details"]}
            rows={chunk}
            headerBg="#541C9C"
            headerText="#fff"
          />
        </PdfPage>
      ))}

      {/* Inclusion Summary */}
      {inclusionChunks.map((chunk, idx) => (
        <PdfPage key={"inclusion-"+idx}>
          <SectionTitle color="#321E5D">Inclusion <span style={{ color: '#936FE0' }}>Summary</span></SectionTitle>
          <Table
            headers={["Category", "Count", "Details", "Status / Comments"]}
            rows={chunk}
            headerBg="#541C9C"
            headerText="#fff"
          />
          {idx === inclusionChunks.length - 1 && (
            <div className="text-xs text-[#321E5D] mb-6">
              <b>Transfer Policy(Refundable Upon Claim)</b><br />
              If Any Transfer Is Delayed Beyond 15 Minutes, Customers May Book An App-Based Or Radio Taxi And Claim A Refund For That Specific Leg.
            </div>
          )}
        </PdfPage>
      ))}

      {/* Activity Table */}
      {activityChunks.map((chunk, idx) => (
        <PdfPage key={"activity-"+idx}>
          <SectionTitle color="#321E5D">Activity <span style={{ color: '#936FE0' }}>Table</span></SectionTitle>
          <Table
            headers={["City", "Activity", "Date/Time", "Time Required"]}
            rows={chunk}
            headerBg="#541C9C"
            headerText="#fff"
          />
        </PdfPage>
      ))}

      {/* Payment Plan */}
      {paymentChunks.map((chunk, idx) => (
        <PdfPage key={"payment-"+idx}>
          <SectionTitle color="#321E5D">Payment <span style={{ color: '#936FE0' }}>Plan</span></SectionTitle>
          <ArrowBox left="Total Amount" right={<b>₹ 9,00,000</b>} />
          <ArrowBox left="TCS" right={<span>Not Collected</span>} />
          <Table
            headers={["Installment", "Amount", "Due Date"]}
            rows={chunk}
            headerBg="#541C9C"
            headerText="#fff"
          />
        </PdfPage>
      ))}

      {/* Visa Details + Book Now CTA (always last page) */}
      <PdfPage>
        <SectionTitle color="#321E5D">Visa <span style={{ color: '#936FE0' }}>Details</span></SectionTitle>
        <Table
          headers={["Visa Type :", "Validity:", "Processing Date :"]}
          rows={[["Tourist", "30 Days", "14/06/2025"]]}
          headerBg="#fff"
          headerText="#541C9C"
        />
        {/* Book Now CTA */}
        <div className="text-center my-8">
          <div className="text-2xl font-bold text-[#321E5D] mb-4">PLAN.PACK.GO!</div>
          <button className="bg-[#6C2EBE] hover:bg-[#541C9C] text-white font-bold py-3 px-12 rounded-full text-lg shadow transition">Book Now</button>
        </div>
      </PdfPage>
    </div>
  );
};

export { SectionTitle, Table, GradientBox, ArrowBox, DayCard };
export default ItineraryPDF; 