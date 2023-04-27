/* Create svgs day boxes for each month (default as current year) */
const maxDaysInMonthArr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsLong = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

generateTable();

// Default the form year to the current year
let yearField = document.getElementById("form-input-year");
let currentYear = new Date().getFullYear();
if (yearField) yearField.value = currentYear;

// User and year query parameters
const mySearchParams = new URLSearchParams(window.location.search);
const user = mySearchParams.get("user");
const year = mySearchParams.get("year");

// User and Year both provided
if (user && year) {
  // Validate year
  const yearInt = parseInt(year);
  const minYear = 2007;
  if (!isNaN(yearInt) && yearInt >= minYear && yearInt <= currentYear) {
    // Year is valid and within the range
    fetchData(user, yearInt);
    setUserField(user);
    setYearField(yearInt);
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

const currentTooltip = document.createElement('div');
currentTooltip.classList.add('svg-tip', 'svg-tip-one-line');
// Remove pointer events to prevent tooltip flickering
currentTooltip.style.pointerEvents = 'none';
currentTooltip.hidden = true;

// Add the tooltip to
document.body.appendChild(currentTooltip);

function setUserField(user) {
  let userField = document.getElementById("form-input-user");
  userField.value = user.trim();
}

function setYearField(year) {
  let yearField = document.getElementById("form-input-year");
  yearField.value = year;
}

function generateTable() {
  const table = document.createElement("table");
  const tableCaption = document.createElement("caption");
  const tableHeader = document.createElement("thead");
  const tableBody = document.createElement("tbody");
  tableCaption.innerText = "Games Played Graph";
  tableCaption.classList.add("sr-only");
  table.setAttribute("aria-readonly", "true");
  table.setAttribute("aria-describedby", "games-played-graph-description");
  table.style.width = "max-content";
  table.style.margin = "auto";
  table.style.borderSpacing = "4px";
  table.style.borderCollapse = "separate";
  table.style.overflow = "hidden";
  table.style.position = "relative";
  table.appendChild(tableCaption);
  table.appendChild(tableHeader);
  table.appendChild(tableBody);

  const tableHeaderTR = document.createElement("tr");
  tableHeaderTR.style.height = "15px";
  const tableHeaderTD = document.createElement("td");
  tableHeaderTD.style.width = "27px";
  const tableHeaderSpan = document.createElement("span");
  tableHeaderSpan.classList.add("sr-only");
  tableHeaderSpan.innerText = "Day of Week";

  tableHeaderTD.appendChild(tableHeaderSpan);
  tableHeaderTR.appendChild(tableHeaderTD);

  for (let i = 0; i < 12; i++) {
    const tdHeader = document.createElement("td");
    tdHeader.setAttribute("data-month", `month${i}`);
    tdHeader.setAttribute("colspan", "3");
    tdHeader.style.position = "relative";
    tdHeader.style.fontSize = "12px";
    tdHeader.style.textAlign = "left";
    tdHeader.style.padding = "0.125em 0.5em 0.125em 0";

    const tdHeaderSpan = document.createElement("span");
    const tdHeaderSpanHidden = document.createElement("span");
    tdHeaderSpan.setAttribute("aria-hidden", "true");
    tdHeaderSpan.style.position = "absolute";
    tdHeaderSpan.style.top = "0";
    tdHeaderSpanHidden.classList.add("sr-only");

    tdHeader.appendChild(tdHeaderSpanHidden);
    tdHeader.appendChild(tdHeaderSpan);
    tableHeaderTR.appendChild(tdHeader);
  }

  tableHeader.appendChild(tableHeaderTR);

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
    tdLabel.style.width = "27px";
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
    tr.appendChild(tdLabel);

    for (let j = 0; j < 53; j++) {
      const td = document.createElement("td");
      const tdSpan = document.createElement("span");
      td.style.width = "11px";
      td.style.borderRadius = "2px";
      td.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)";
      td.setAttribute("data-coord", `x${j}-y${i}`);
      td.setAttribute("tabindex", "-1");
      td.setAttribute("aria-selected", "false");
      tdSpan.classList.add("sr-only");
      tdSpan.innerText = "No Data";

      td.classList.add(`anim${((i + j) % 4) + 1}`);

      td.addEventListener("mouseover", showTooltip);
      td.addEventListener("mouseleave", hideTooltip);

      td.appendChild(tdSpan);
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }

  const container = document.getElementById("heatmap");
  container.style.maxWidth = "100%";
  container.style.overflowX = "auto";
  container.style.overflowY = "hidden";
  container.appendChild(table);

  const descriptorSpan = document.createElement("span");
  descriptorSpan.classList.add("sr-only");
  descriptorSpan.setAttribute("id", "games-played-graph-description");
  descriptorSpan.setAttribute("aria-hidden", "true");
  descriptorSpan.innerText = "User activity over one year of time. Each column is one week, with older weeks to the left.";
  container.appendChild(descriptorSpan);

  // const observerOptions = {
  //   childList: true,
  //   subtree: true
  // };

  // const observer = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     if (mutation.target.hasAttribute("data-text")) {
  //       console.log(mutation.target);

  //     }
  //   });
  // });

  // observer.observe(table, observerOptions);
}

function hideTooltip() {
  if(currentTooltip) {
    currentTooltip.hidden = true;
    currentTooltip.innerText = "No Data";
  }
}

function showTooltip(event) {
  const el = event.target;
  if (!(el instanceof HTMLElement || el instanceof SVGElement)) return

  function isTooFarLeft(graphContainerBounds, tooltipX) {
    return graphContainerBounds.x > tooltipX
  }
  
  function isTooFarRight(graphContainerBounds, tooltipX) {
    return graphContainerBounds.x + graphContainerBounds.width < tooltipX + currentTooltip.offsetWidth
  }

  currentTooltip.hidden = false;

  const elCollection = el.getElementsByTagName("span");
  if (elCollection.length > 0) {
    currentTooltip.innerText = elCollection[0].innerText;
  } else {
    currentTooltip.innerText = "No Data";
  }

  const bounds = el.getBoundingClientRect();
  const x = bounds.left + window.pageXOffset - currentTooltip.offsetWidth / 2 + bounds.width / 2;
  const y = bounds.bottom + window.pageYOffset - currentTooltip.offsetHeight - bounds.height * 2;
  const graphContainer = document.getElementById("heatmap")
  const graphContainerBounds = graphContainer.getBoundingClientRect();

  currentTooltip.style.top = `${y}px`;

  if(isTooFarLeft(graphContainerBounds, x)) {
    currentTooltip.style.left = `${x + (currentTooltip.offsetWidth / 2) - bounds.width}px`;
    currentTooltip.classList.add('left');
    currentTooltip.classList.remove('right');
  } else if (isTooFarRight(graphContainerBounds, x)) {
    currentTooltip.style.left = `${x - (currentTooltip.offsetWidth / 2) + bounds.width}px`;
    currentTooltip.classList.add('right');
    currentTooltip.classList.remove('left');
  } else {
    currentTooltip.style.left = `${x}px`;
    currentTooltip.classList.remove('left');
    currentTooltip.classList.remove('right');
  }
}

function pulseCells() {
  const targetDiv = document.getElementById("heatmap");
  const tbodyCollection = targetDiv.getElementsByTagName("tbody")[0].children;

  Array.from(tbodyCollection).map((elem) => {
    const tdToUpdate = Array.from(elem.children).slice(1);
    tdToUpdate.map((item) => {
      item.classList.add("pulseOpacity");
    });
  });
}

function clearTable() {
  const targetDiv = document.getElementById("heatmap");
  const tbodyCollection = targetDiv.getElementsByTagName("tbody")[0].children;

  Array.from(tbodyCollection).map((elem) => {
    const tdToUpdate = Array.from(elem.children).slice(1);
    tdToUpdate.map((item) => {
      item.classList.remove("pulseOpacity");
      item.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)";
      item.getElementsByTagName("span")[0].innerText = "No Data";
    });
  });
}

function easeInPowerBounded(x, yMin, yMax, power = 1) {
  // Ensure that x is within the range of 0 and 1
  x = Math.max(0, Math.min(1, x));

  // Calculate y, the output value of the "ease in" function
  // Scale and shift y to fit within the range of yMin and yMax
  return x ** power * (yMax - yMin) + yMin;
}

function roundReturnUpOrDown(num) {
  if (Math.round(num) > num) {
    return 1; // number was rounded up
  } else {
    return 0; // number was rounded down or was already an integer
  }
}

function getDateStrings(currentDate) {
  const startDate = new Date(currentDate); // start date
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1);

  const dateStrings = [];
  for (let d = startDate; d <= currentDate; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateString = `${year}.${month}.${day}`;
    dateStrings.push(dateString);
  }

  return dateStrings;
}

async function fetchData(username, year) {
  const user = String(username).trim().toLocaleLowerCase();
  const gameData = {};
  const nextMonth = new Date().getMonth() + 2;
  const today = new Date();
  today.setFullYear(year);
  const oneYearAgo = new Date().setFullYear(today.getFullYear() - 1);
  const dateArray = getDateStrings(today);
  let firstDayDate = today;
  let maxGamesPlayed = 0;

  pulseCells();

  for (let i = 0; i < 12; i++) {
    let loopMonth;
    let loopYear;
    if (nextMonth + i <= 12) {
      loopMonth = String(nextMonth + i).padStart(2, "0");
      loopYear = String(year - 1);
    } else {
      loopMonth = String(nextMonth + i - 12).padStart(2, "0");
      loopYear = String(year);
    }

    const url = `https://api.chess.com/pub/player/${user}/games/${loopYear}/${loopMonth}/pgn`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.text();

    const pgns = data.split("\n\n\n");
    if (!pgns || pgns[0] === "") continue; // Skip months with no games

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

      if (annotations.Result === "1-0") {
        // White Wins
        if (playerWhite === user.toLowerCase()) win = 1;
        if (playerBlack === user.toLowerCase()) loss = 1;
      }
      if (annotations.Result === "0-1") {
        // Black Wins
        if (playerWhite === user.toLowerCase()) loss = 1;
        if (playerBlack === user.toLowerCase()) win = 1;
      }
      if (annotations.Result === "1/2-1/2") draw = 1;

      if (gameData[annotations.Date]) {
        gameData[annotations.Date]["win"] += win;
        gameData[annotations.Date]["loss"] += loss;
        gameData[annotations.Date]["draw"] += draw;
        gameData[annotations.Date]["total"] += 1;

        if (gameData[annotations.Date]["total"] > maxGamesPlayed) maxGamesPlayed = gameData[annotations.Date]["total"];
      } else {
        gameData[annotations.Date] = {
          win: win,
          loss: loss,
          draw: draw,
          total: 1,
        };
      }
    }
  }

  let firstDayOffset = new Date(firstDayDate.setDate(1)).getDay();

  clearTable();

  const lightnessCiel = 66;
  const lightnessFloor = 11;
  const saturationCiel = 70;
  const saturationFloor = 50;
  const threshold = 4;

  // Loop over all the dates in the rolling year
  for (const dateString of dateArray) {
    const cellId = `x${Math.floor(firstDayOffset / 7)}-y${firstDayOffset % 7}`;
    const dataCell = document.querySelector(`[data-coord="${cellId}"`);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const datePretty = new Date(dateString).toLocaleDateString("en-US", options);

    if (gameData.hasOwnProperty(dateString)) {
      const totalGames = gameData[dateString]["total"];
      const lightness = Math.floor(easeInPowerBounded(1 - (totalGames - threshold) / (maxGamesPlayed - threshold), lightnessFloor, lightnessCiel, 5));
      const saturation = Math.floor(easeInPowerBounded(1 - (totalGames - threshold) / (maxGamesPlayed - threshold), saturationFloor, saturationCiel, 3));
      const text = `Wins: ${gameData[dateString]["win"]}, Draws: ${gameData[dateString]["draw"]}, Losses: ${gameData[dateString]["loss"]} on ${datePretty}`;

      dataCell.setAttribute("data-date", dateString);
      dataCell.setAttribute("data-text", text);

      // Update popup text
      dataCell.querySelector("span").innerHTML = text;

      if (totalGames > 1) dataCell.style.backgroundColor = `hsl(144, ${saturation}%, ${lightnessCiel}%)`;
      if (totalGames > threshold) dataCell.style.backgroundColor = `hsl(144, ${saturation}%, ${lightness}%)`;
    } else {
      dataCell.querySelector("span").innerHTML = `No Games Played on ${datePretty}`;
      dataCell.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)";
    }

    firstDayOffset += 1;
  }

  let daySum = 0;
  let rawSum = 0;

  for (let i = nextMonth - 1; i < nextMonth - 1 + maxDaysInMonthArr.length; i++) {
    const monthIndex = i % 12;
    const zeroIndex = i - nextMonth + 1;
    const prevSum = daySum;

    rawSum += maxDaysInMonthArr[monthIndex] / 7;
    daySum += Math.floor(maxDaysInMonthArr[monthIndex] / 7) + roundReturnUpOrDown(rawSum);

    const colWidth = daySum - prevSum;

    const headElem = document.querySelector(`[data-month="month${zeroIndex}"]`);
    headElem.setAttribute("colspan", String(colWidth));
    headElem.childNodes[0].innerText = monthsLong[monthIndex];
    headElem.childNodes[1].innerText = monthsShort[monthIndex];
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
