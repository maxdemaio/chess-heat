const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const daysInMonthArr = [];

// Loop through each month of the current year 
// and append the number of days to the array
for (let month = 0; month < 12; month++) {
  const days = new Date(currentYear, month + 1, 0).getDate();
  daysInMonthArr.push(days);
}

// Create svgs day boxes for each month
for (let i = 0; i < daysInMonthArr.length; i++) {

  // Get the element with the heatmap-id="0"
  const heatmapElement = document.querySelector(`[heatmap-id="${i}"]`);

  console.log(daysInMonthArr);
  console.log(heatmapElement);

  for (let j = 0; j < daysInMonthArr[i]; j++) {
      // Create the elements using the createElement() method
      const dayBoxContainer = document.createElement('div');
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      
      // Add the classes and attributes to the elements
      dayBoxContainer.classList.add('dayBoxContainer');
      svgElement.classList.add('dayBox', 'grayBox');
      rectElement.classList.add('fill-current');
      rectElement.setAttribute('width', '100%');
      rectElement.setAttribute('height', '100%');
      

      svgElement.setAttribute("daybox-id", j);
      const popup = document.createElement('div');
      popup.classList.add('popup-content');
      popup.setAttribute("popup-id", j)

      // Hide the popup span initially
      popup.style.display = 'none';

      // Add mouse enter listener to show the popup span
      svgElement.addEventListener('mouseenter', () => {
        popup.style.display = 'inline';
      });

      // Add mouse leave listener to hide the popup span
      svgElement.addEventListener('mouseleave', () => {
        popup.style.display = 'none';
      });

      // Append the elements to each other
      svgElement.appendChild(rectElement);
      dayBoxContainer.appendChild(svgElement);
      svgElement.insertAdjacentElement('afterend', popup);

      heatmapElement.appendChild(dayBoxContainer);
  }
}

// Create popup for each day box


// Each month has an array of day metadata objects
let monthDayMetaArr = [];
for (let i = 0; i < daysInMonthArr.length; i++) {
  let temp = [];
  for (let j = 0; j < daysInMonthArr[i]; j++) {
    let monthDayMeta = {
      day: j,
      wins: 0,
      losses: 0,
      draws: 0
    }
    temp.push(monthDayMeta);
  }
  monthDayMetaArr.push(temp);
}

const baseUrl = 'https://api.chess.com/pub/player/max_mayo/games/2023/';
const monthNumbers = Array.from({ length: 12 }, (_, i) => i + 1);
monthNumbers.forEach((month) => 
console.log(`${baseUrl}${month.toString().padStart(2, '0')}/pgn`));

// Query the chesscom API
fetch('https://api.chess.com/pub/player/max_mayo/games/2023/03/pgn')
  .then(response => response.text())
  .then(data => {
    const pgns = data.split('\n\n\n');
    // iterate over the pgn annotations
    for (let i = 0; i < pgns.length; i++) {
      const currPgn = pgns[i];
      const annotationRegex = /\[(\w+)\s+\"(.+?)\"\]/g;
      const annotations = {};
      let match;

      /* 
      Process the PGN string using the exec() method of the annotationRegex. 
      Each time the loop executes, it finds the next match 
      in the string and assigns it to the match variable. 
      The loop continues as long as match is not null. 
      */
      while ((match = annotationRegex.exec(currPgn)) !== null) {
        /* 
        Extract the key and value of the annotation 
        from the match variable using match[1] and match[2], respectively. 
        It then assigns the value to a property of the annotations object 
        with the key as the property name. 
        */
        annotations[match[1]] = match[2];
      }
      console.log(annotations);

      // If these specific annotations aren't found on the pgn, skip
      if (!annotations.hasOwnProperty('Black')
        || !annotations.hasOwnProperty('White')
        || !annotations.hasOwnProperty('Date')
        || !annotations.hasOwnProperty('Result')) {
        console.log("Needed annotations not found on current PGN");
        continue;
      }

      // TODO: remove hardcode
      const user = "max_mayo"

      // Extract day integer from the date property
      // There may be many matches on the same day
      // So, we use that as the index
      // We subtract 1 because the array is 0-indexed
      const day = parseInt(annotations.Date.split('.')[2]) - 1;

      // update meta
      if (annotations.Black === user && annotations.Result === "0-1") {
        monthDayMetaArr[2][day].wins += 1
      }
      if (annotations.Black === user && annotations.Result === "1-0") {
        monthDayMetaArr[2][day].losses += 1
      }
      if (annotations.White === user && annotations.Result === "1-0") {
        monthDayMetaArr[2][day].wins += 1
      }
      if (annotations.White === user && annotations.Result === "0-1") {
        monthDayMetaArr[2][day].losses += 1
      }
      if (annotations.Result === "1/2-1/2") {
        monthDayMetaArr[2][day].draws += 1
      }
    }
  }).then(() => {

    // TODO, do it for curr month
    // Get the element with the heatmap-id="3"
    const heatmapElement = document.querySelector('[heatmap-id="2"]');

    // Select all elements with the class name ".dayBox" within the heatmapElement
    const monthDaySquares = heatmapElement.querySelectorAll('.dayBox');
    // update squares
    for (let i = 0; i < monthDayMetaArr[2].length; i++) {
      if (monthDayMetaArr[2][i].wins + monthDayMetaArr[2][i].losses + monthDayMetaArr[2][i].draws > 0) {
        monthDaySquares[i].classList.remove("grayBox");
        monthDaySquares[i].classList.add("greenBox");

        // update popup content
        const popup = heatmapElement.querySelector(`[popup-id="${i}"]`);
        popup.textContent = `wins ${monthDayMetaArr[2][i].wins}, losses ${monthDayMetaArr[2][i].losses}, draws ${monthDayMetaArr[2][i].draws}`;
      }
    }

  }
  )
  .catch(error => {
    console.error('Error has occurred: ', error);
  });
