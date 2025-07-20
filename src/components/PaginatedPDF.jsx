import React, { useRef, useLayoutEffect, useState } from "react";
import { SectionTitle, Table, GradientBox, ArrowBox } from "./ItineraryPDF";

const PAGE_HEIGHT = 1122; // px for A4 at 96dpi
const PAGE_WIDTH = 794;
const FOOTER_HEIGHT = 80;

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
  </div>
);

// Helper to add days to a date string (YYYY-MM-DD)
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}
function formatDate(date) {
  if (!date) return "-";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// At the top, define the scenic images array
const scenicImages = [
  '/scenic_images/pic1.jpg',
  '/scenic_images/pic2.jpeg',
  '/scenic_images/pic3.jpeg',
  '/scenic_images/pic4.jpg',
  '/scenic_images/pic5.jpeg',
  '/scenic_images/pic6.jpeg',
  '/scenic_images/pic7.jpg',
];

const DayCard = ({ day, index }) => {
  const thisDate = day.date ? new Date(day.date) : null;
  // Pick a random scenic image for each day (deterministic by index for PDF stability)
  const scenicImage = scenicImages[index % scenicImages.length];
  // Group activities by partOfDay from user input
  const activities = Array.isArray(day.activities) ? day.activities : [];
  // In DayCard, for each time frame, show main summary/plan as first bullet, then all activities
  const getActivities = (part) => {
    const items = [];
    // Always show main summary/plan as first bullet if present
    if (day[part] && typeof day[part] === 'string' && day[part].trim() !== '') {
      items.push(<li key={part + '-main'} className="ml-4 list-disc text-[#321E5D] font-semibold">{day[part]}</li>);
    }
    // Add activities (tasks)
    activities.filter(a => a.partOfDay === part && a.name).forEach((a, idx) => {
      items.push(<li key={part + '-activity-' + idx} className="ml-4 list-disc text-[#321E5D]">{a.name}{a.description ? `: ${a.description}` : ''}</li>);
    });
    return items;
  };
  return (
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
        {/* Scenic Image and Date (vertical stack) */}
        <div className="flex flex-col items-center justify-center w-40">
          <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-[#FBF4FF] flex items-center justify-center">
            <img src={scenicImage} alt="Scenic" className="object-cover w-full h-full" />
          </div>
          <div className="font-bold text-[#541C9C] text-base mt-2 text-center">{thisDate ? formatDate(thisDate) : "-"}</div>
        </div>
        {/* Activities by time of day from user input */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {['morning', 'afternoon', 'evening'].map((part) => (
            <div key={part}>
              <div className="font-bold text-[#680099] capitalize">{part}</div>
              <ul>
                {getActivities(part)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PaginatedPDF = ({ data }) => {
  // Use user data or fallback to mock data for each section
  // Calculate arrival date (departureDate + 1 day)
  let arrivalDate = null;
  if (data.departureDate) {
    const d = new Date(data.departureDate);
    d.setDate(d.getDate() + 1);
    arrivalDate = d;
  }
  // Find last hotel check-out date
  let endDate = null;
  if (data.hotels && data.hotels.length > 0) {
    const lastHotel = data.hotels[data.hotels.length - 1];
    if (lastHotel.checkOut) {
      endDate = new Date(lastHotel.checkOut);
    }
  }
  // Generate days array from arrivalDate to endDate
  let days = [];
  if (arrivalDate && endDate) {
    let current = new Date(arrivalDate);
    let i = 0;
    while (current <= endDate) {
      days.push({
        ...(data.days && data.days[i] ? data.days[i] : {}),
        date: new Date(current),
      });
      current.setDate(current.getDate() + 1);
      i++;
    }
  } else {
    days = data.days || [];
  }
  // Map flights to array of arrays for Table
  const flightRows = (data.flights && data.flights.length > 0)
    ? data.flights.map(f => [f.date, <b>{f.airline}</b>, `From ${f.from} To ${f.to} (${f.number})`])
    : [["Thu 10 Jan'24", <b>Fly Air India</b>, "From Delhi (DEL) To Singapore (SIN)."]];
  // Map hotels to array of arrays for Table, calculate nights dynamically
  const hotelRows = (data.hotels && data.hotels.length > 0)
    ? data.hotels.map(h => {
        let nights = '';
        if (h.checkIn && h.checkOut) {
          const inDate = new Date(h.checkIn);
          const outDate = new Date(h.checkOut);
          nights = Math.max(0, Math.round((outDate - inDate) / (1000 * 60 * 60 * 24)));
        }
        return [h.city, h.checkIn, h.checkOut, nights, h.name];
      })
    : [["Singapore", "24/02/2024", "24/02/2024", "2", "Super Townhouse Oak Vashi Formerly Blue Diamond"]];
  // Activity table: for now, just use mock or empty
  const activityRows = data.activityTable && data.activityTable.length > 0 ? data.activityTable : [
    ["Rio De Janeiro", "Sydney Harbour Cruise & Taronga  Zoo", "2D-07-2025/04:00PM", "2-3 Hours"]
  ];
  // Payment table: for now, just use mock or empty
  const paymentRows = data.payment && data.payment.length > 0 ? data.payment : [
    ["Installment 1", "₹3,50,000", "Initial Payment"]
  ];
  // For notes, scope, inclusion, visa, etc., you can add similar logic or keep static for now
  const notesRows = [
    ["Airlines Standard Policy", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Flight/Hotel Cancellation", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Trip Insurance", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Hotel Check-In & Check Out", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."],
    ["Visa Rejection", "In Case Of Visa Rejection, Visa Fees Or Any Other Non Cancellable Component Cannot Be Reimbursed At Any Cost."]
  ];
  // Chunk notesRows for pagination
  const TABLE_HEADER_HEIGHT = 48;
  const TABLE_ROW_HEIGHT = 32;
  const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - FOOTER_HEIGHT - 48;
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
  const notesChunks = chunkByHeight(notesRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const serviceRows = [
    ["Flight Tickets And Hotel Vouchers", "Delivered 3 Days Post Full Payment"]
  ];
  const inclusionRows = [
    ["Flight", "2", "All Flights Mentioned", "Awaiting Confirmation"]
  ];

  // Add chunking for all major sections
  const serviceChunks = chunkByHeight(serviceRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const inclusionChunks = chunkByHeight(inclusionRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT - 80);
  const activityChunks = chunkByHeight(activityRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);
  const paymentChunks = chunkByHeight(paymentRows, TABLE_ROW_HEIGHT, PAGE_CONTENT_HEIGHT - TABLE_HEADER_HEIGHT);

  // Chunk the days array for pagination
  const DAY_CARD_HEIGHT = 220;
  const dayChunks = chunkByHeight(days, DAY_CARD_HEIGHT, PAGE_CONTENT_HEIGHT);

  // Real content blocks
  const blocks = [
    {
      key: "cover",
      content: <>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <img src="/Logo.png" alt="Logo" className="h-10" />
          <div className="text-right">
            <div className="text-[#541C9C] font-bold text-lg">vigovia</div>
            <div className="text-xs text-[#321E5D]">PLAN.PACK.GO</div>
          </div>
        </div>
        <GradientBox>
          <div className="text-lg font-bold">Hi, {data.travellerName || "Traveller"}!</div>
          <div className="text-2xl font-bold">{data.destination ? `${data.destination} Itinerary` : "Itinerary"}</div>
          <div className="text-base mt-1">{data.numDays || 1} Days {data.numDays ? data.numDays - 1 : 0} Nights</div>
          <div className="flex justify-center gap-4 mt-2">
            <span>✈️</span><span>🏨</span><span>🍽️</span><span>🚗</span><span>🏝️</span><span>🎫</span>
          </div>
        </GradientBox>
        <div className="border rounded-xl p-4 mb-6 grid grid-cols-5 gap-2 text-xs text-[#321E5D] font-semibold">
          <div>
            <div className="mb-1">Departure From</div>
            <div className="font-bold text-[#541C9C]">{data.departureFrom || "-"}</div>
          </div>
          <div>
            <div className="mb-1">Departure</div>
            <div className="font-bold text-[#541C9C]">{data.departureDate ? formatDate(new Date(data.departureDate)) : "-"}</div>
          </div>
          <div>
            <div className="mb-1">Arrival</div>
            <div className="font-bold text-[#541C9C]">{arrivalDate ? formatDate(arrivalDate) : "-"}</div>
          </div>
          <div>
            <div className="mb-1">Destination</div>
            <div className="font-bold text-[#541C9C]">{data.destination || "-"}</div>
          </div>
          <div>
            <div className="mb-1">No. Of Travellers</div>
            <div className="font-bold text-[#541C9C]">{data.travellers || "-"}</div>
          </div>
        </div>
      </>
    },
    ...dayChunks.flatMap((chunk, pageIdx) =>
      chunk.map((day, i) => ({
        key: `day-${pageIdx}-${i}`,
        content: <DayCard day={day} index={pageIdx * chunk.length + i} />
      }))
    ),
    {
      key: "flight-summary",
      content: <>
        <SectionTitle color="#321E5D">Flight <span style={{ color: '#936FE0' }}>Summary</span></SectionTitle>
        {flightRows.map((row, i) => (
          <ArrowBox key={i} left={row[0]} right={<><b>{row[1]}</b> {row[2]}</>} />
        ))}
        <div className="text-xs text-[#321E5D] mt-2 mb-6">Note: All Flights Include Meals, Seat Choice (Excluding XL), And 20kg/25Kg Checked Baggage.</div>
      </>
    },
    {
      key: "hotel-bookings",
      content: <>
        <SectionTitle color="#321E5D">Hotel <span style={{ color: '#936FE0' }}>Bookings</span></SectionTitle>
        <Table
          headers={["City", "Check In", "Check Out", "Nights", "Hotel Name"]}
          rows={hotelRows}
          headerBg="#541C9C"
          headerText="#fff"
        />
        <div className="text-xs text-[#321E5D] mb-6">
          1. All Hotels Are Tentative And Can Be Replaced With Similar.<br />
          2. Breakfast Included For All Hotel Stays.<br />
          3. All Hotels Will Be 4* And Above Category<br />
          4. A maximum occupancy of 2 people/room is allowed in most hotels.
        </div>
      </>
    },
    ...notesChunks.map((chunk, idx) => ({
      key: `notes-${idx}`,
      content: <>
        <SectionTitle color="#321E5D">Important <span style={{ color: '#936FE0' }}>Notes</span></SectionTitle>
        <Table
          headers={["Point", "Details"]}
          rows={chunk}
          headerBg="#541C9C"
          headerText="#fff"
        />
      </>
    })),
    ...serviceChunks.map((chunk, idx) => ({
      key: `scope-${idx}`,
      content: <>
        <SectionTitle color="#321E5D">Scope Of <span style={{ color: '#936FE0' }}>Service</span></SectionTitle>
        <Table
          headers={["Service", "Details"]}
          rows={chunk}
          headerBg="#541C9C"
          headerText="#fff"
        />
      </>
    })),
    ...inclusionChunks.map((chunk, idx) => ({
      key: `inclusion-${idx}`,
      content: <>
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
      </>
    })),
    ...activityChunks.map((chunk, idx) => ({
      key: `activity-${idx}`,
      content: <>
        <SectionTitle color="#321E5D">Activity <span style={{ color: '#936FE0' }}>Table</span></SectionTitle>
        <Table
          headers={["City", "Activity", "Date/Time", "Time Required"]}
          rows={chunk}
          headerBg="#541C9C"
          headerText="#fff"
        />
        {idx === activityChunks.length - 1 && (
          <div className="mt-4 text-left">
            <span className="font-bold text-[#321E5D]">Terms and <span style={{ color: '#936FE0' }}>Conditions</span>:</span>
            <br />
            <a href="#" className="text-[#541C9C] underline text-sm">View all terms and conditions</a>
          </div>
        )}
      </>
    })),
    ...paymentChunks.map((chunk, idx) => ({
      key: `payment-${idx}`,
      content: <>
        <SectionTitle color="#321E5D">Payment <span style={{ color: '#936FE0' }}>Plan</span></SectionTitle>
        <ArrowBox left="Total Amount" right={<b>₹ 9,00,000</b>} />
        <ArrowBox left="TCS" right={<span>Not Collected</span>} />
        <Table
          headers={["Installment", "Amount", "Due Date"]}
          rows={chunk}
          headerBg="#541C9C"
          headerText="#fff"
        />
        {idx === paymentChunks.length - 1 && (
          <>
            <SectionTitle color="#321E5D">Visa <span style={{ color: '#936FE0' }}>Details</span></SectionTitle>
            <Table
              headers={["Visa Type :", "Validity:", "Processing Date :"]}
              rows={[ ["Tourist", "30 Days", "14/06/2025"] ]}
              headerBg="#fff"
              headerText="#541C9C"
            />
            <div className="text-center my-8">
              <div className="text-2xl font-bold text-[#321E5D] mb-4">PLAN.PACK.GO!</div>
              <button className="bg-[#6C2EBE] hover:bg-[#541C9C] text-white font-bold py-3 px-12 rounded-full text-lg shadow transition">Book Now</button>
            </div>
          </>
        )}
      </>
    })),
  ];

  // Measurement and pagination logic (unchanged)
  const [blockHeights, setBlockHeights] = useState([]);
  const [pages, setPages] = useState([]);
  const blockRefs = useRef([]);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    if (measured) return;
    const heights = blockRefs.current.map(ref => ref ? ref.offsetHeight : 0);
    setBlockHeights(heights);
    setMeasured(true);
  }, [measured]);

  useLayoutEffect(() => {
    if (!measured) return;
    let currentPage = [];
    let currentHeight = 0;
    const allPages = [];
    for (let i = 0; i < blocks.length; i++) {
      const h = blockHeights[i] || 0;
      // Always start payment+visa on a new page
      if (blocks[i].key === "payment-visa" && currentPage.length > 0) {
        allPages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
      if (currentHeight + h > PAGE_HEIGHT - FOOTER_HEIGHT - 48 && currentPage.length > 0) {
        allPages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
      currentPage.push(blocks[i]);
      currentHeight += h;
    }
    if (currentPage.length > 0) allPages.push(currentPage);
    setPages(allPages);
  }, [blockHeights, measured]);

  if (!measured) {
    return (
      <div style={{position: 'absolute', left: -9999, top: 0}}>
        {blocks.map((block, i) => (
          <div key={block.key} ref={el => blockRefs.current[i] = el}>{block.content}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {pages.map((pageBlocks, idx) => (
        <PdfPage key={idx}>
          {pageBlocks.map(block => (
            <div key={block.key}>{block.content}</div>
          ))}
        </PdfPage>
      ))}
    </div>
  );
};

export default PaginatedPDF; 