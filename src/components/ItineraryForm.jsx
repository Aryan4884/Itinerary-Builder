import React, { useState } from "react";
import dayjs from "dayjs";

const steps = [
  "Trip Info",
  "Flights",
  "Hotels",
  "Activities",
];

const defaultDay = () => ({
  morning: "",
  afternoon: "",
  evening: "",
  activities: [],
  transfers: [],
  flights: [],
});
const defaultActivity = () => ({ name: "", description: "", id: "", price: "", time: "" });
const defaultTransfer = () => ({ type: "", timings: "", price: "", people: "" });
const defaultFlight = () => ({ date: "09/06/2025", airline: "Air India", from: "DEL", to: "SIN", number: "AI123" });
const defaultHotel = () => ({ city: "Singapore", checkIn: "24/02/2024", checkOut: "26/02/2024", nights: 2, name: "Super Townhouse Oak" });

function ItineraryForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    travellerName: "",
    numDays: 1,
    departureFrom: "",
    departureDate: "",
    destination: "",
    travellers: 1,
    days: [defaultDay()],
    flights: [],
    hotels: [],
  });

  // Add state to track which add task form is open and the form values
  const [openTaskTime, setOpenTaskTime] = useState({});
  const [taskForm, setTaskForm] = useState({ morning: { name: '', description: '' }, afternoon: { name: '', description: '' }, evening: { name: '', description: '' } });

  // Handle trip info change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle number of days change
  const handleNumDaysChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setForm((prev) => ({
      ...prev,
      numDays: value,
      days: value > prev.days.length
        ? [...prev.days, ...Array(value - prev.days.length).fill().map(defaultDay)]
        : prev.days.slice(0, value),
    }));
  };

  // Day-by-day handlers
  const handleDayField = (i, field, value) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((d, idx) => idx === i ? { ...d, [field]: value } : d),
    }));
  };
  const handleAddActivity = (dayIdx) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => i === dayIdx ? { ...d, activities: [...d.activities, defaultActivity()] } : d),
    }));
  };
  const handleActivityChange = (dayIdx, actIdx, field, value) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => i === dayIdx ? {
        ...d,
        activities: d.activities.map((a, j) => j === actIdx ? { ...a, [field]: value } : a)
      } : d),
    }));
  };
  const handleRemoveActivity = (dayIdx, actIdx) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => i === dayIdx ? {
        ...d,
        activities: d.activities.filter((_, j) => j !== actIdx)
      } : d),
    }));
  };
  // Flights step handlers
  const handleAddFlight = () => {
    setForm((prev) => ({ ...prev, flights: [...prev.flights, defaultFlight()] }));
  };
  const handleFlightChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      flights: prev.flights.map((f, i) => i === idx ? { ...f, [field]: value } : f),
    }));
  };
  const handleRemoveFlight = (idx) => {
    setForm((prev) => ({ ...prev, flights: prev.flights.filter((_, i) => i !== idx) }));
  };
  // Hotels step handlers
  const handleAddHotel = () => {
    setForm((prev) => ({ ...prev, hotels: [...prev.hotels, defaultHotel()] }));
  };
  const handleHotelChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      hotels: prev.hotels.map((h, i) => i === idx ? { ...h, [field]: value } : h),
    }));
  };
  const handleRemoveHotel = (idx) => {
    setForm((prev) => ({ ...prev, hotels: prev.hotels.filter((_, i) => i !== idx) }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="flex w-full gap-12">
      {/* Left: Strictly left-aligned image, no padding/margin */}
      <div className="w-1/2 h-[500px] flex items-start justify-start bg-white overflow-hidden p-0 m-0">
        <img src="/t2.png" alt="Traveller" className="w-full h-full object-cover object-left" />
      </div>
      {/* Right: Strictly right-aligned form, with padding */}
      <div className="w-1/2 h-[500px] flex items-center justify-center bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (step === steps.length - 1) {
              console.log("Submitting", form);
              onSubmit(form);
            } else {
              nextStep();
            }
          }}
          className="w-full max-w-lg p-4 flex flex-col h-[500px] justify-between text-base"
        >
          {/* Stepper */}
          <div>
            <div className="flex items-center mb-6">
              {steps.map((label, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center py-2 px-2 rounded font-semibold cursor-pointer transition select-none
                    ${i === step ? 'text-[#541C9C]' : 'text-gray-400'}
                    hover:bg-gray-100 hover:shadow`}
                  onClick={() => setStep(i)}
                  style={{ userSelect: 'none' }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          {/* Main Content (scrollable if needed) */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Step 1: Trip Info */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#541C9C] font-semibold mb-1">Traveler Name</label>
                    <input name="travellerName" type="text" placeholder="e.g. Rahul" className="w-full border border-[#936FE0] rounded px-3 py-2 text-black" value={form.travellerName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[#541C9C] font-semibold mb-1">Number of Days</label>
                    <input name="numDays" type="number" min={1} max={30} placeholder="e.g. 5" className="w-full border border-[#936FE0] rounded px-3 py-2 text-black text-lg" value={form.numDays} onChange={handleNumDaysChange} />
                  </div>
                  <div>
                    <label className="block text-[#541C9C] font-semibold mb-1">Departure From</label>
                    <input name="departureFrom" type="text" list="city-suggestions" placeholder="e.g. Delhi" className="w-full border border-[#936FE0] rounded px-3 py-2 text-black text-lg" value={form.departureFrom} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[#541C9C] font-semibold mb-1">Departure Date</label>
                    <input name="departureDate" type="date" className="w-full border border-[#936FE0] rounded px-3 py-2 text-black text-lg" value={form.departureDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[#541C9C] font-semibold mb-1">Destination</label>
                    <input name="destination" type="text" list="city-suggestions" placeholder="e.g. Singapore" className="w-full border border-[#936FE0] rounded px-3 py-2 text-black text-lg" value={form.destination} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[#541C9C] font-semibold mb-1">No. of Travellers</label>
                    <input name="travellers" type="number" min={1} max={20} placeholder="e.g. 2" className="w-full border border-[#936FE0] rounded px-3 py-2 text-black text-lg" value={form.travellers} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}
            {/* Step 2: Flights */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#541C9C]">Flights</span>
                  <button type="button" className="bg-[#936FE0] hover:bg-[#680099] text-white px-3 py-1 rounded text-sm" onClick={handleAddFlight}>Add Flight</button>
                </div>
                <div className="max-h-[250px] overflow-y-auto pr-1">
                  {form.flights.length === 0 && <div className="text-[#321E5D] italic mb-2">No flights added.</div>}
                  {form.flights.map((flight, i) => (
                    <div key={i} className="bg-white border border-[#936FE0] rounded p-3 mb-2 flex flex-col gap-2">
                      <div className="font-semibold text-[#541C9C] mb-2">Flight {i + 1}</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">Date</label>
                          <input type="date" className="border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" value={flight.date} onChange={e => handleFlightChange(i, 'date', e.target.value)} placeholder="Date" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">Airline</label>
                          <input type="text" list="airline-suggestions" className="w-32 border border-[#936FE0] rounded px-2 py-1 text-black" value={flight.airline} onChange={e => handleFlightChange(i, 'airline', e.target.value)} placeholder="Airline (e.g. Air India)" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">From</label>
                          <input type="text" className="w-16 border border-[#936FE0] rounded px-2 py-1 text-black" value={flight.from} onChange={e => handleFlightChange(i, 'from', e.target.value)} placeholder="From (e.g. DEL)" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">To</label>
                          <input type="text" className="w-16 border border-[#936FE0] rounded px-2 py-1 text-black" value={flight.to} onChange={e => handleFlightChange(i, 'to', e.target.value)} placeholder="To (e.g. SIN)" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">Flight No.</label>
                          <input type="text" className="w-20 border border-[#936FE0] rounded px-2 py-1 text-black" value={flight.number} onChange={e => handleFlightChange(i, 'number', e.target.value)} placeholder="Flight No." />
                        </div>
                      </div>
                      <button type="button" className="self-end text-xs text-[#680099] hover:underline" onClick={() => handleRemoveFlight(i)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Step 3: Hotels */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#541C9C]">Hotels</span>
                  <button type="button" className="bg-[#936FE0] hover:bg-[#680099] text-white px-3 py-1 rounded text-sm" onClick={handleAddHotel}>Add Hotel</button>
                </div>
                <div className="max-h-[250px] overflow-y-auto pr-1">
                  {form.hotels.length === 0 && <div className="text-[#321E5D] italic mb-2">No hotels added.</div>}
                  {form.hotels.map((hotel, i) => (
                    <div key={i} className="bg-white border border-[#936FE0] rounded p-3 mb-2 flex flex-col gap-2">
                      <div className="font-semibold text-[#541C9C] mb-2">Hotel {i + 1}</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">City</label>
                          <input type="text" className="w-32 border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" value={hotel.city} onChange={e => handleHotelChange(i, 'city', e.target.value)} placeholder="City (e.g. Singapore)" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">Check In</label>
                          <input type="date" className="border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" value={hotel.checkIn} onChange={e => handleHotelChange(i, 'checkIn', e.target.value)} placeholder="Check In" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">Check Out</label>
                          <input type="date" className="border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" value={hotel.checkOut} onChange={e => handleHotelChange(i, 'checkOut', e.target.value)} placeholder="Check Out" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-xs text-[#541C9C] font-semibold mb-1">Hotel Name</label>
                          <input type="text" list="hotel-suggestions" className="border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" value={hotel.name} onChange={e => handleHotelChange(i, 'name', e.target.value)} placeholder="Hotel Name" />
                        </div>
                      </div>
                      <button type="button" className="self-end text-xs text-[#680099] hover:underline" onClick={() => handleRemoveHotel(i)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Step 4: Activities */}
            {step === 3 && (
              <div className="space-y-8 max-h-[250px] overflow-y-auto">
                {form.days.map((day, i) => {
                  // Calculate arrival date: departureDate + 1 day
                  let arrivalDate = form.departureDate ? dayjs(form.departureDate).add(1, 'day') : null;
                  // Each day after arrival: arrivalDate + i days
                  let dayDate = arrivalDate ? arrivalDate.add(i, 'day').format('DD MMM YYYY') : '';
                  return (
                    <div key={i} className="bg-white border border-[#936FE0] rounded-lg p-4">
                      <h3 className="text-lg font-bold text-[#680099] mb-2">Day {i + 1} <span className='text-xs font-normal text-[#321E5D]'>{dayDate}</span></h3>
                      <div className="flex flex-col gap-2 mb-4">
                        {['morning', 'afternoon', 'evening'].map((part) => (
                          <div key={part} className="relative pb-6">
                            <label className="block text-[#541C9C] font-semibold mb-1 capitalize">{part}</label>
                            <input type="text" placeholder={part === 'morning' ? 'e.g. Arrive in Singapore. Transfer to hotel.' : part === 'afternoon' ? 'e.g. Visit Marina Bay Sands' : 'e.g. Explore Gardens by the Bay'} className="w-full border border-[#936FE0] rounded px-2 py-1 text-black" value={day[part]} onChange={e => handleDayField(i, part, e.target.value)} />
                            <span className="absolute right-0 bottom-0 text-xs text-[#680099] cursor-pointer hover:underline" onClick={() => setOpenTaskTime({ ...openTaskTime, [i + '-' + part]: true })}>Add Task</span>
                            {/* Show add task form for this time frame if open */}
                            {openTaskTime[i + '-' + part] && (
                              <form className="flex flex-wrap gap-2 mt-2 items-end" onSubmit={e => {
                                e.preventDefault();
                                if (!taskForm[part].name) return;
                                setForm((prev) => ({
                                  ...prev,
                                  days: prev.days.map((d, idx) => {
                                    if (idx !== i) return d;
                                    const newActivity = { name: taskForm[part].name, description: taskForm[part].description, partOfDay: part };
                                    return {
                                      ...d,
                                      activities: [...(d.activities || []), newActivity]
                                    };
                                  }),
                                }));
                                setTaskForm(f => ({ ...f, [part]: { name: '', description: '' } }));
                                setOpenTaskTime(t => ({ ...t, [i + '-' + part]: false }));
                              }}>
                                <input type="text" className="border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" placeholder="Task Name" value={taskForm[part].name} onChange={e => setTaskForm(f => ({ ...f, [part]: { ...f[part], name: e.target.value } }))} required />
                                <input type="text" className="border border-[#936FE0] rounded px-2 py-1 text-black min-w-[120px]" placeholder="Description" value={taskForm[part].description} onChange={e => setTaskForm(f => ({ ...f, [part]: { ...f[part], description: e.target.value } }))} />
                                <button type="submit" className="bg-[#936FE0] hover:bg-[#680099] text-white px-3 py-1 rounded text-xs">Add</button>
                              </form>
                            )}
                            {/* List activities for this time frame */}
                            <ul className="list-disc ml-4 mt-1">
                              {day.activities && day.activities.filter(a => a.partOfDay === part && a.name).map((a, idx) => (
                                <li key={idx} className="mb-1 flex items-center gap-2">
                                  <span className="text-[#321E5D] font-semibold">{a.name}</span>
                                  {a.description && <span className="text-[#321E5D]">: {a.description}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button type="button" className="bg-gray-400 text-white px-6 py-2 rounded" onClick={prevStep} disabled={step === 0}>Back</button>
            {step < steps.length - 1 ? (
              <button type="submit" className="bg-[#936FE0] hover:bg-[#680099] text-white px-6 py-2 rounded text-lg">Next</button>
            ) : (
              <button type="submit" className="bg-[#936FE0] hover:bg-[#680099] text-white px-6 py-2 rounded text-lg">Submit</button>
            )}
          </div>
        </form>
      </div>
      {/* Datalists for suggestions */}
      <datalist id="city-suggestions">
        <option value="Delhi" />
        <option value="Mumbai" />
        <option value="Kolkata" />
        <option value="Bangalore" />
        <option value="Chennai" />
        <option value="Hyderabad" />
        <option value="Singapore" />
        <option value="Bangkok" />
        <option value="Dubai" />
        <option value="London" />
        <option value="New York" />
        <option value="Paris" />
      </datalist>
      <datalist id="airline-suggestions">
        <option value="Air India" />
        <option value="IndiGo" />
        <option value="Vistara" />
        <option value="SpiceJet" />
        <option value="Emirates" />
        <option value="Singapore Airlines" />
        <option value="Qatar Airways" />
        <option value="Lufthansa" />
        <option value="British Airways" />
      </datalist>
      <datalist id="activity-suggestions">
        <option value="City Tour" />
        <option value="Museum Visit" />
        <option value="Beach Day" />
        <option value="Theme Park" />
        <option value="Shopping" />
        <option value="Boat Ride" />
        <option value="Hiking" />
        <option value="Food Tasting" />
        <option value="Night Safari" />
        <option value="Cultural Show" />
      </datalist>
      <datalist id="hotel-suggestions">
        <option value="Taj" />
        <option value="Marriott" />
        <option value="Hilton" />
        <option value="Oberoi" />
        <option value="ITC" />
        <option value="Hyatt" />
        <option value="Leela" />
        <option value="Radisson" />
        <option value="Novotel" />
        <option value="Holiday Inn" />
      </datalist>
    </div>
  );
}

export default ItineraryForm; 