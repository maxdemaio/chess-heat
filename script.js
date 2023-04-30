/* Hue slider logic */
const rangeInput = document.querySelector("#form-input-hue");
let outputHue = document.querySelector("#output-hue");
let colorRangeHolder = document.querySelector(".c-range");
let dataCells; // updated in fetchData to all cells with data
let exampleCells = document.querySelectorAll(".exampleBox");
let timerId = null;

rangeInput.addEventListener("input", function () {
  // Throttle setHue to prevent excessive calls
  clearTimeout(timerId);
  timerId = setTimeout(function () {
    setHue();
  }, 80);
});

function setHue() {
  // Update query parameter
  const newUrl = new URL(window.location.href);
  const hue = rangeInput.value;
  newUrl.searchParams.set("hue", hue);
  history.pushState({}, "", newUrl.toString());
  outputHue.innerText = "(" + hue + "°" + ")";
  colorRangeHolder.style.setProperty("--hue", hue);
  if (dataCells) {
    // Loop through each td element and update its hue
    dataCells.forEach((td) => {
      const hslValues = td.dataset.hsl.split(",");
      const saturation = hslValues[1];
      const lightness = hslValues[2];
      td.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  }
  // Update example cells
  exampleCells.forEach((ex) => {
    const hslValues = ex.dataset.hsl.split(",");
    const saturation = hslValues[1];
    const lightness = hslValues[2];
    ex.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
}
/* End hue slider logic */

const daysInMonthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsLong = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const currentTooltip = document.createElement("div");
currentTooltip.classList.add("svg-tip", "svg-tip-one-line");
currentTooltip.style.pointerEvents = "none"; // Remove pointer events to prevent tooltip flickering
currentTooltip.hidden = true;
document.body.appendChild(currentTooltip); // Add the tooltip to the DOM

generateTable();
queryBasedOnQueryParams();

function queryBasedOnQueryParams() {
  // User, year, and hue query parameters
  const mySearchParams = new URLSearchParams(window.location.search);
  const user = mySearchParams.get("user");
  const year = parseInt(mySearchParams.get("year"));
  let currYear = new Date().getFullYear();
  const hue = parseInt(mySearchParams.get("hue"));
  const defaultHue = 144;

  // Set default of the year field to current year
  // Set default hue to 144
  setYearField(currYear);
  setHueField(defaultHue);

  // Use user, year, and hue query parameters to call the API if valid
  if (user) {
    setUserField(user);
  } else {
    console.log("No user query parameter");
    return;
  }
  if (year) {
    if (isValidChessComYear(year)) {
      setYearField(year);
    } else {
      console.error("Invalid year query parameter");
      return;
    }
  }
  if (hue) {
    if (isValidHue(hue)) {
      setHueField(hue);
      colorRangeHolder.style.setProperty("--hue", hue);
    } else {
      console.error("Invalid hue query parameters");
      return;
    }
  }

  fetchData(user, year || currYear, hue || defaultHue);
}

function setUserField(user) {
  let userField = document.getElementById("form-input-user");
  userField.value = user.trim();
}

function setYearField(year) {
  let yearField = document.getElementById("form-input-year");
  yearField.value = year;
}

function setHueField(hue) {
  const hueField = document.getElementById("form-input-hue");
  const exampleBox1 = document.getElementById("exampleBox1");
  exampleBox1.style.color = `hsl(${hue}, 70%, 66%)`;
  exampleBox1.dataset.hsl = `${hue},70,66`;

  const exampleBox2 = document.getElementById("exampleBox2");
  exampleBox2.style.color = `hsl(${hue}, 62%, 37%)`;
  exampleBox2.dataset.hsl = `${hue},62,37`;

  const exampleBox3 = document.getElementById("exampleBox3");
  exampleBox3.style.color = `hsl(${hue}, 58%, 24%)`;
  exampleBox3.dataset.hsl = `${hue},58,24`;

  const exampleBox4 = document.getElementById("exampleBox4");
  exampleBox4.style.color = `hsl(${hue}, 51%, 11%)`;
  exampleBox4.dataset.hsl = `${hue},51,11`;

  hueField.value = hue;
}

function isPreviousYearFunc(year) {
  const currYear = new Date().getFullYear();
  return year < currYear;
}

function isValidChessComYear(year) {
  const minYear = 2007;
  const currYear = new Date().getFullYear();
  if (!isNaN(year) && year >= minYear && year <= currYear) {
    return true;
  }
  return false;
}

function isValidHue(hue) {
  if (hue > 0 && hue <= 360) {
    return true;
  }
  return false;
}

function generateTable() {
  const container = document.getElementById("heatmap");
  const descriptorSpan = document.createElement("span");
  const table = document.createElement("table");
  const tableCaption = document.createElement("caption");
  const tableHeader = document.createElement("thead");
  const tableHeaderTR = document.createElement("tr");
  const tableHeaderTD = document.createElement("td");
  const tableHeaderSpan = document.createElement("span");
  const tableBody = document.createElement("tbody");

  descriptorSpan.classList.add("sr-only");
  descriptorSpan.setAttribute("id", "games-played-graph-description");
  descriptorSpan.setAttribute("aria-hidden", "true");
  descriptorSpan.innerText = "User activity over one year of time. Each column is one week, with older weeks to the left.";
  table.setAttribute("aria-readonly", "true");
  table.setAttribute("aria-describedby", "games-played-graph-description");
  table.style.width = "max-content";
  table.style.borderSpacing = "4px";
  table.style.borderCollapse = "separate";
  table.style.overflow = "hidden";
  table.style.position = "relative";
  tableCaption.innerText = "Games Played Graph";
  tableCaption.classList.add("sr-only");
  tableHeaderTR.style.height = "15px";
  tableHeaderTD.style.width = "27px";
  tableHeaderSpan.classList.add("sr-only");
  tableHeaderSpan.innerText = "Day of Week";

  tableHeaderTD.appendChild(tableHeaderSpan);
  tableHeaderTR.appendChild(tableHeaderTD);

  for (let i = 0; i < 12; i++) {
    const tdHeader = document.createElement("td");
    const tdHeaderSpan = document.createElement("span");
    const tdHeaderSpanHidden = document.createElement("span");

    tdHeader.setAttribute("data-month", `month${i}`);
    tdHeader.setAttribute("colspan", "3");
    tdHeader.style.position = "relative";
    tdHeader.style.fontSize = "12px";
    tdHeader.style.textAlign = "left";
    tdHeader.style.padding = "0.125em 0.5em 0.125em 0";
    tdHeaderSpan.setAttribute("aria-hidden", "true");
    tdHeaderSpan.style.position = "absolute";
    tdHeaderSpan.style.top = "0";
    tdHeaderSpanHidden.classList.add("sr-only");

    tdHeader.appendChild(tdHeaderSpanHidden);
    tdHeader.appendChild(tdHeaderSpan);
    tableHeaderTR.appendChild(tdHeader);
  }

  for (let i = 0; i < 7; i++) {
    const tr = document.createElement("tr");
    const tdLabel = document.createElement("td");
    const tdLabelSpan = document.createElement("span");
    const tdLabelSpanHidden = document.createElement("span");

    tr.style.height = "13px";
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

    // Because it is possible to have a leap year that starts on a Saturday,
    // the last day of that leap year could appear on column 54
    for (let j = 0; j < 54; j++) {
      const td = document.createElement("td");
      const tdSpan = document.createElement("span");

      td.style.width = "11px";
      td.style.borderRadius = "2px";
      td.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)";
      td.setAttribute("data-coord", `x${j}-y${i}`);
      td.setAttribute("tabindex", "-1");
      td.setAttribute("aria-selected", "false");
      td.classList.add(`anim${((i + j) % 4) + 1}`);
      td.addEventListener("mouseover", showTooltip);
      td.addEventListener("mouseleave", hideTooltip);
      tdSpan.classList.add("sr-only");
      tdSpan.innerText = "No Data";

      td.appendChild(tdSpan);
      tr.appendChild(td);
    }

    tableHeader.appendChild(tableHeaderTR);
    tableBody.appendChild(tr);
  }

  table.appendChild(tableCaption);
  table.appendChild(tableHeader);
  table.appendChild(tableBody);
  container.appendChild(table);
  container.appendChild(descriptorSpan);
}

function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.hidden = true;
    currentTooltip.innerText = "No Data";
  }
}

function showTooltip(event) {
  const el = event.target;
  if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;
  hideTooltip();

  function isTooFarLeft(graphContainerBounds, tooltipX) {
    return graphContainerBounds.x > tooltipX;
  }

  function isTooFarRight(graphContainerBounds, tooltipX) {
    return graphContainerBounds.x + graphContainerBounds.width < tooltipX + currentTooltip.offsetWidth;
  }

  const elCollection = el.getElementsByTagName("span");
  if (elCollection.length > 0) {
    currentTooltip.innerText = elCollection[0].innerText;
  } else {
    currentTooltip.innerText = "No Data";
  }

  // We have to show the tooltip before calculating it's position.
  currentTooltip.hidden = false;

  const tooltipWidth = currentTooltip.offsetWidth;
  const tooltipHeight = currentTooltip.offsetHeight;
  const bounds = el.getBoundingClientRect();
  const x = bounds.left + window.pageXOffset - tooltipWidth / 2 + bounds.width / 2;
  const y = bounds.bottom + window.pageYOffset - tooltipHeight - bounds.height * 2;
  const graphContainer = document.getElementById("heatmap");
  const graphContainerBounds = graphContainer.getBoundingClientRect();

  currentTooltip.style.top = `${y}px`;

  if (isTooFarLeft(graphContainerBounds, x)) {
    currentTooltip.style.left = `${x + currentTooltip.offsetWidth / 2 - bounds.width}px`;
    currentTooltip.classList.add("left");
    currentTooltip.classList.remove("right");
  } else if (isTooFarRight(graphContainerBounds, x)) {
    currentTooltip.style.left = `${x - currentTooltip.offsetWidth / 2 + bounds.width}px`;
    currentTooltip.classList.add("right");
    currentTooltip.classList.remove("left");
  } else {
    currentTooltip.style.left = `${x}px`;
    currentTooltip.classList.remove("left");
    currentTooltip.classList.remove("right");
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
      item.style.visibility = "visible";
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

async function fetchData(username, year, hue) {
  const user = String(username).trim().toLocaleLowerCase();
  const gameData = {};
  let totalWins = 0;
  let totalLosses = 0;
  let totalDraws = 0;
  let totalGames = 0;
  const isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  const isPreviousYear = isPreviousYearFunc(year);
  const today = isPreviousYear ? new Date(year, 11, 31) : new Date();
  const oneYearAgo = isPreviousYear ? new Date(year, 0, 1) : new Date().setFullYear(today.getFullYear() - 1);
  const dateArray = getDateStrings(today);
  let nextMonth = isPreviousYear ? 1 : new Date().getMonth() + 2;
  let firstDayDate = today;
  let maxGamesPlayed = 0;
  let daySum = 0;
  let prevColSum = 0;

  pulseCells();

  for (let i = 0; i < 12; i++) {
    let loopMonth;
    let loopYear;
    if (nextMonth + i <= 12) {
      loopMonth = String(nextMonth + i).padStart(2, "0");
      loopYear = isPreviousYear ? String(year) : String(year - 1);
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
        totalGames++;
        if (playerWhite === user.toLowerCase()) (win = 1), totalWins++;
        if (playerBlack === user.toLowerCase()) (loss = 1), totalLosses++;
      }
      if (annotations.Result === "0-1") {
        // Black Wins
        totalGames++;
        if (playerWhite === user.toLowerCase()) (loss = 1), totalLosses++;
        if (playerBlack === user.toLowerCase()) (win = 1), totalWins++;
      }
      if (annotations.Result === "1/2-1/2") (draw = 1), totalGames++, totalDraws++;

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

  const firstDayOffset = new Date(firstDayDate.setDate(1)).getDay();
  let dayIncrement = firstDayOffset;

  clearTable();

  const lightnessCiel = 66;
  const lightnessFloor = 11;
  const saturationCiel = 70;
  const saturationFloor = 50;
  const threshold = 4;

  // Hide Cells that don't appear in the year (Before)
  for (let cellCountBefore = 0; cellCountBefore < dayIncrement; cellCountBefore++) {
    const dataCellBefore = document.querySelector(`[data-coord="x0-y${cellCountBefore}"`);
    dataCellBefore.style.visibility = "hidden";
  }

  // Loop over all the dates in the rolling year
  for (const dateString of dateArray) {
    const cellId = `x${Math.floor(dayIncrement / 7)}-y${dayIncrement % 7}`;
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

      if (totalGames > 1) {
        dataCell.classList.add("data-cell");
        dataCell.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightnessCiel}%)`;
        // Store the HSL values as a custom attribute on the td element
        dataCell.dataset.hsl = `${hue},${saturation},${lightness}`;
      }
      if (totalGames > threshold) {
        dataCell.classList.add("data-cell");
        dataCell.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        dataCell.dataset.hsl = `${hue},${saturation},${lightness}`;
      }
    } else {
      dataCell.querySelector("span").innerHTML = `No Games Played on ${datePretty}`;
      dataCell.style.backgroundColor = "hsla(0, 0%, 50%, 0.15)";
    }

    dayIncrement += 1;
  }

  // Hide Cells that don't appear in the year (After)
  while (dayIncrement < 54 * 7) {
    const cellId = `x${Math.floor(dayIncrement / 7)}-y${dayIncrement % 7}`;
    const dataCellAfter = document.querySelector(`[data-coord="${cellId}"`);
    dataCellAfter.style.visibility = "hidden";

    dayIncrement += 1;
  }

  // Set Width of Month Headers
  for (let j = 0; j < 12; j++) {
    const monthIndex = (j + nextMonth - 1) % 12;

    daySum += daysInMonthArr[monthIndex] + (j === 0 ? firstDayOffset : 0) + (j === 1 && isLeapYear ? 1 : 0);

    const colWidth = Math.floor(daySum / 7) - prevColSum;

    const headElem = document.querySelector(`[data-month="month${j}"]`);
    headElem.setAttribute("colspan", String(colWidth));
    headElem.childNodes[0].innerText = monthsLong[monthIndex];
    headElem.childNodes[1].innerText = monthsShort[monthIndex];

    prevColSum += colWidth;
  }

  // Set new data cells
  dataCells = document.querySelectorAll(".data-cell");
  // Update total wins/losses/draws/total and user/year
  let winInfo = document.getElementById("winInfo");
  winInfo.innerText = totalWins;
  let yearInfo = document.getElementById("yearInfo");
  if (year == new Date().getFullYear()) {
    yearInfo.innerText = "the past year";
  } else {
    yearInfo.innerText = year;
  }
  let userInfo = document.getElementById("usernameInfo");
  userInfo.innerText = user;
  let lossInfo = document.getElementById("lossInfo");
  lossInfo.innerText = totalLosses;
  let drawInfo = document.getElementById("drawInfo");
  drawInfo.innerText = totalDraws;
  let totalInfo = document.getElementById("totalGameInfo");
  totalInfo.innerText = totalGames;
}

/* Form logic */
document.getElementById("form").addEventListener("submit", (e) => {
  // Prevent the form from refreshing the page
  e.preventDefault();

  // Get the value of the inputs
  const user = document.getElementById("form-input-user").value.toLowerCase();
  const year = parseInt(document.getElementById("form-input-year").value);
  const hue = parseInt(document.getElementById("form-input-hue").value);

  // Validate user
  if (user === "") {
    alert("Username must not be empty.");
    return;
  }
  // Validate year
  if (!isValidChessComYear(year)) {
    alert("Year must be greater than 2007 and not in the future.");
    return;
  }
  // Validate hue
  if (!isValidHue(hue)) {
    alert("Hue must be between values 0 and 360");
    return;
  }

  // Call the function that handles the chess.com requests
  fetchData(user, year, hue);

  // Update query params of user/year without reload
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
