# Itinerary Builder

A modern, customizable itinerary builder web app that allows users to create, preview, and export beautiful, multi-day travel itineraries as PDFs. Built with React and Tailwind CSS.
---

## Features

- **Multi-step, user-friendly form** for entering trip details, day-by-day activities, flights, and hotels.
- **Dynamic day-by-day itinerary**: Add, group, and view activities for morning, afternoon, and evening.
- **Scenic images**: Each day in the PDF features a random scenic image.
- **PDF export**: Live preview and export of the itinerary as a paginated, print-ready PDF.
- **Smart pagination**: No section or day is ever cut off; content automatically moves to the next page.
- **Responsive design**: Works beautifully on desktop and tablet.
- **Customizable**: Easily add or remove activities, flights, and hotels.
- **Clear UI**: All form fields are clearly labeled for ease of use.
---

## How It Works

1. **Enter Trip Info**: Traveler name, number of days, departure, destination, etc.
2. **Add Flights & Hotels**: Enter all relevant details, with clear labels for each field.
3. **Plan Each Day**: For each day, add a main plan for morning, afternoon, and evening, and add multiple bullet-point tasks for each time slot.
4. **Preview & Export**: Instantly preview your itinerary as a PDF and download it with one click.
---
## Installation

```bash
git clone https://github.com/Aryan4884/Itinerary-Builder.git
cd Itinerary-Builder
npm install
npm run dev
```
---
## Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Fill out the form step by step.
- Add as many activities, flights, and hotels as you need.
- Preview your itinerary and download the PDF.
---
## Technologies Used

- React
- Tailwind CSS
- jsPDF & html2canvas (for PDF export)
- Day.js (for date calculations)
---
## Customization

- To add more scenic images, place them in `public/scenic_images/`.
- To change the color scheme, edit the Tailwind classes in the components.
---
## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
---
## License

[MIT](LICENSE)

---

Created by Aryan Raj (2025)
