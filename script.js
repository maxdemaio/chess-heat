/* Create svgs day boxes for each month (default as current year) */
const maxDaysInMonthArr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

generateTable();

// Default the form year to the current year
let yearField = document.getElementById("form-input-year");
let currentYear = new Date().getFullYear();
if (yearField) yearField.value = currentYear;

// User and year query parameters
const mySearchParams = new URLSearchParams(window.location.search);
const user = mySearchParams.get("user");
let year = mySearchParams.get("year");

function setUserField(user) {
  let userField = document.getElementById("form-input-user");
  userField.value = user.trim();
}

function setYearField(year) {
  let yearField = document.getElementById("form-input-year");
  yearField.value = year;
}

if (user && year) {
  // User and year both provided
  // Validate year
  year = parseInt(year);
  const minYear = 2007;
  if (!isNaN(year) && year >= minYear && year <= currentYear) {
    // Year is valid and within the range
    fetchData(user, year);
    setUserField(user);
    setYearField(year);
  } else {
    // Year is not valid or outside of the range
    console.error("Invalid year query param, defaulting to current year");
    fetchData(user, currentYear);
    setUserField(user);
  }
} else if (user) {
  // Just user provided
  fetchData(user, currentYear);
  setUserField(user);
}

function generateTable(){
  const table = document.createElement("table");
  const tableCaption = document.createElement("caption");
  const tableHeader = document.createElement("thead");
  const tableBody   = document.createElement("tbody");
  tableCaption.classList.add("sr-only");
  table.style.width = "max-content";
  table.style.borderSpacing = "4px";
  table.style.borderCollapse = "separate";
  table.style.overflow = "hidden";
  table.style.position = "relative";
  table.appendChild(tableCaption);
  table.appendChild(tableHeader);
  table.appendChild(tableBody);

  for (let i = 0; i < 7; i++) {
    const tr = document.createElement("tr");
    tr.style.height = "13px";

    const tdLabel = document.createElement("td");
    const tdLabelSpan = document.createElement("span");
    const tdLabelSpanHidden = document.createElement("span");
    tdLabelSpanHidden.classList.add("sr-only");
    tdLabelSpan.setAttribute("aria-hidden", "true");
    tdLabelSpan.style.position = "absolute";
    tdLabelSpan.style.bottom = "-2px";
    tdLabelSpan.style.lineHeight = "1rem";
    tdLabel.style.position = "relative";
    tdLabel.style.padding = "0.125em 0.5em 0.125em 0";
    tdLabel.style.fontSize = "12px";
    tdLabel.style.textAlign = "left";
    tdLabel.style.width = "27px"
    if (i === 0) { 
      tdLabelSpanHidden.innerText = "Sunday";
      tdLabelSpan.innerText = "Sun";
      tdLabelSpan.style.clipPath = "Circle(0)";
    }
    if (i === 1) { 
      tdLabelSpanHidden.innerText = "Monday";
      tdLabelSpan.innerText = "Mon";
      tdLabelSpan.style.clipPath = "None";
    }
    if (i === 2) { 
      tdLabelSpanHidden.innerText = "Tuesday";
      tdLabelSpan.innerText = "Tue";
      tdLabelSpan.style.clipPath = "Circle(0)";
    }
    if (i === 3) { 
      tdLabelSpanHidden.innerText = "Wednesday";
      tdLabelSpan.innerText = "Wed";
      tdLabelSpan.style.clipPath = "None";
    }
    if (i === 4) { 
      tdLabelSpanHidden.innerText = "Thursday";
      tdLabelSpan.innerText = "Thu";
      tdLabelSpan.style.clipPath = "Circle(0)";
    }
    if (i === 5) { 
      tdLabelSpanHidden.innerText = "Friday";
      tdLabelSpan.innerText = "Fri";
      tdLabelSpan.style.clipPath = "None";
    }
    if (i === 6) { 
      tdLabelSpanHidden.innerText = "Saturday";
      tdLabelSpan.innerText = "Sat";
      tdLabelSpan.style.clipPath = "Circle(0)";
    }

    tdLabel.appendChild(tdLabelSpan);
    tr.appendChild(tdLabel)

    for (let j = 0; j < 53; j ++) {
      const td = document.createElement("td");
      const tdSpan = document.createElement("span");
      td.style.width = "11px";
      td.style.borderRadius = "2px";
      td.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)";
      td.setAttribute("data-coord", `x${j}-y${i}`);
      td.setAttribute("tabindex", "-1");
      td.setAttribute("aria-selected", "false");
      tdSpan.classList.add("sr-only");
      tdSpan.innerText = "No Games Played";

      td.appendChild(tdSpan)
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }

  const container = document.getElementById("heatmap");
  container.style.maxWidth = "100%";
  container.style.overflowX = "auto";
  container.style.overflowY = "hidden";
  container.appendChild(table);
}

function easeInPowerBounded(x, yMin, yMax, power = 1) {
  // Ensure that x is within the range of 0 and 1
  x = Math.max(0, Math.min(1, x));

  // Calculate y, the output value of the "ease in" function
  // Scale and shift y to fit within the range of yMin and yMax
  return (x ** power) * (yMax - yMin) + yMin;
}

async function fetchData(user, year) {
  const dateArray = [];
  const gameData = {}
  const nextMonth = new Date().getMonth() + 2;
  const today = new Date();
  const oneYearAgo = (new Date()).setFullYear(today.getFullYear() - 1);
  let firstDayDate = today;
  let firstDayOffset = 0;
  let maxGamesPlayed = 0;

  for (let i = 0; i < 12; i++) {
    let loopMonth;
    let loopYear;
    if (nextMonth + i <= 12) {
      loopMonth = String(nextMonth + i).padStart(2, '0');
      loopYear = String(year - 1);
    } else {
      loopMonth = String(nextMonth + i - 12).padStart(2, '0');
      loopYear = String(year);
    }

    const url = `https://api.chess.com/pub/player/${user}/games/${loopYear}/${loopMonth}/pgn`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.text();

    const pgns = data.split("\n\n\n");
    if (!pgns || pgns[0] === '') continue; // Skip months with no games

    for (let j = 0; j < pgns.length; j++) {
      const annotationRegex = /\[(\w+)\s+\"(.+?)\"\]/g;
      const annotations = {};
      let match;

      // Process the PGN string using the exec() method of the annotationRegex.
      // Each time the loop executes, it finds the next match
      // in the string and assigns it to the match variable.
      // The loop continues as long as match is not null.
      while ((match = annotationRegex.exec(pgns[j])) !== null) {
        // Extract the key and value of the annotation
        // from the match variable using match[1] and match[2], respectively.
        // It then assigns the value to a property of the annotations object
        // with the key as the property name.
        annotations[match[1]] = match[2];
      }

      // If these specific annotations aren't found on the pgn, skip
      if (!annotations.hasOwnProperty("Black") || !annotations.hasOwnProperty("White") || !annotations.hasOwnProperty("Date") || !annotations.hasOwnProperty("Result")) {
        console.error(`Needed annotations not found on PGN ${j}`);
        continue;
      }

      const currentAnnotationDate = new Date(annotations.Date);

      // Remove Games Outside of Lower Bound Month
      if (currentAnnotationDate < oneYearAgo) continue;

      // Get Oldest Date
      if (currentAnnotationDate < firstDayDate) firstDayDate = currentAnnotationDate;

      const playerBlack = annotations.Black.toLowerCase();
      const playerWhite = annotations.White.toLowerCase();
      let win = 0;
      let loss = 0;
      let draw = 0;

      if (annotations.Result === "1-0"){ // White Wins
        if (playerWhite === user.toLowerCase()) win = 1;
        if (playerBlack === user.toLowerCase()) loss = 1;
      }
      if (annotations.Result === "0-1"){ // Black Wins
        if (playerWhite === user.toLowerCase()) loss = 1;
        if (playerBlack === user.toLowerCase()) win = 1;
      }
      if (annotations.Result === "1/2-1/2") draw = 1

      if(gameData[annotations.Date]) {
        gameData[annotations.Date]['win'] += win;
        gameData[annotations.Date]['loss'] += loss;
        gameData[annotations.Date]['draw'] += draw;
        gameData[annotations.Date]['total'] += 1;

        if (gameData[annotations.Date]['total'] > maxGamesPlayed) maxGamesPlayed = gameData[annotations.Date]['total'];
      } else {
        gameData[annotations.Date] = {
          win: win,
          loss: loss,
          draw: draw,
          total: 1
        }
      }
    }
  }
  firstDayOffset = firstDayDate.getDay();

  let currentDate = firstDayDate;
  while (currentDate < today) {
    dateArray.push(currentDate.toISOString().substring(0, 10).replace(/-/g, '.'));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const lightnessCiel = 66;
  const lightnessFloor = 11;
  const saturationCiel = 70;
  const saturationFloor = 50;
  const threshold = 4;

  for (const dateString of dateArray) {
    const dataCell = document.querySelector(`[data-coord="x${Math.floor(firstDayOffset / 7)}-y${firstDayOffset % 7}"]`);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const datePretty = new Date(dateString).toLocaleDateString('en-US', options);

    if (gameData.hasOwnProperty(dateString)) {
      const totalGames = gameData[dateString]['total'];
      const lightness = Math.floor(easeInPowerBounded(1 - ((totalGames - threshold) / (maxGamesPlayed - threshold)), lightnessFloor, lightnessCiel, 5));
      const saturation = Math.floor(easeInPowerBounded(1 - ((totalGames - threshold) / (maxGamesPlayed - threshold)), saturationFloor, saturationCiel, 3));
      const text = `Wins: ${gameData[dateString]['win']}, Draws: ${gameData[dateString]['draw']}, Losses: ${gameData[dateString]['loss']} on ${datePretty}`;

      dataCell.setAttribute("data-date", dateString);
      dataCell.setAttribute("data-text", text);
      dataCell.querySelector("span").innerHTML = text;

      if (totalGames > 1)         dataCell.style.backgroundColor = `hsl(144, ${saturation}%, ${lightnessCiel}%)`;
      if (totalGames > threshold) dataCell.style.backgroundColor = `hsl(144, ${saturation}%, ${lightness}%)`;
    } else {
      dataCell.querySelector("span").innerHTML = `No Games Played on ${datePretty}`;
      dataCell.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)"
    }

    firstDayOffset += 1;
  }
}

/* Form logic */
document.getElementById("form").addEventListener("submit", (e) => {
  // Prevent the form from refreshing the page
  e.preventDefault();

  // Get the value of the input
  const user = document.getElementById("form-input-user").value.toLowerCase();
  const year = parseInt(document.getElementById("form-input-year").value);
  // Validate user
  if (user === "") {
    alert("Username must not be empty.");
    return;
  }
  // Validate year
  if (year < 2008) {
    alert("Year must be greater than 2007.");
    return;
  }
  if (year > new Date().getFullYear()) {
    alert("Year must not be in the future.");
    return;
  }

  // Call the function that handles the Chess.com requests
  fetchData(user, year);

  // Update Query Param without Reload
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("user", user);
  newUrl.searchParams.set("year", year);
  history.pushState({}, "", newUrl.toString());
});

/* Copy link logic */
document.getElementById("copy-button").addEventListener("click", async function () {
  // Copy URL to clipboard
  await navigator.clipboard.writeText(window.location.href);

  // Alert the user that the link has been copied
  alert("Link copied to clipboard!");
});
