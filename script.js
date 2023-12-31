const tgl = document.getElementById("darkModeBtn");
const savedDarkMode = localStorage.getItem('darkMode');

let iconElement, buttonName;

if (savedDarkMode === 'true') {
  document.body.classList.add('darkTheme');
  iconElement = document.querySelector(".custom-icon");
  iconElement.setAttribute("name", "sunny-outline");
  buttonName = document.querySelector(".buttonName");
  buttonName.textContent = 'Light Mode';
} else {
  document.body.classList.remove('darkTheme');
  iconElement = document.querySelector(".custom-icon");
  iconElement.setAttribute("name", "moon-outline");
  buttonName = document.querySelector(".buttonName");
  buttonName.textContent = 'Dark Mode';
}

tgl.onclick = function () {
  document.body.classList.toggle("darkTheme");

  const isDarkMode = document.body.classList.contains("darkTheme");
  localStorage.setItem('darkMode', isDarkMode);

  if (isDarkMode) {
    iconElement.setAttribute('name', 'sunny-outline');
    buttonName.textContent = 'Light Mode';
  } else {
    iconElement.setAttribute('name', 'moon-outline');
    buttonName.textContent = 'Dark Mode';
  }
};


const favouriteBtn = document.getElementById('favouriteBtn');
const favouritesArea = document.getElementById('favouritesArea');

favouriteBtn.addEventListener('click', function () {
  favouritesArea.classList.toggle('hidden');
});



let data;
// Debounce function to delay API requests
function debounce(func, delay) {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

//function to make the cards clickable and return the unique class number and call the fetch detailes
function addCardClickEventListeners() {
  const cards = document.querySelectorAll('.allCourses .course');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      const uniqueClassNumber = extractClassNumber(card);
      fetchDetailes(uniqueClassNumber);

    });
  });
}
//return the unique class number for each card get clicked
function extractClassNumber(element) {
  const classes = element.classList;
  for (const i = 0; i < classes.length; i++) {
    const className = classes[i];
    if (className.startsWith('course-')) {
      return className.replace('course-', '');
    }
  }
  return null;
}
// Function to extract the id from the URL
function getIdFromUrl() {
  const currentUrl = window.location.href;
  const match = currentUrl.match(/id=(\d+)/);

  if (match) {
    return match[1];
  } else {
    /*       console.error("No 'id' found in the URL"); */
    return null;
  }
}

// Function to fetch and render details
async function fetchAndRenderDetails() {
  try {
    const id = getIdFromUrl();

    if (id !== null) {
      const detailsData = await fetchDetailes(id);
      renderDetailes(detailsData);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
fetchAndRenderDetails();



async function fetchDetailes(uniqueClassNumber) {
  try {
    const response = await fetch(`https://tap-web-1.herokuapp.com/topics/details/${uniqueClassNumber}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const detailesData = await response.json();

    return detailesData;

  } catch (error) {
    console.error("Error fetching DETAILES data:", error.message);
    throw error;
  }
}



//Function That Render The Detailes Page 
function renderDetailes(detailesData) {

  try {
    const aboutDiv = document.querySelector('.aboutCourse');

    const categoryR = document.createElement('h3');
    categoryR.innerText = detailesData.category;
    aboutDiv.appendChild(categoryR);

    const topicR = document.createElement('h4');
    topicR.innerText = detailesData.topic;
    aboutDiv.appendChild(topicR);



    const ratingR = document.createElement('div');
    ratingR.classList.add('rating');



    for (let i = 0; i < detailesData.rating; i++) {
      const star = document.createElement('ion-icon');
      star.name = 'star';
      aboutDiv.appendChild(star);
    }

    for (let i = detailesData.rating; i < 4; i++) {
      const starOutline = document.createElement('ion-icon');
      starOutline.name = 'star-outline';
      aboutDiv.appendChild(starOutline);
    }

    const descriptionR = document.createElement('p');
    descriptionR.innerText = detailesData.description;
    aboutDiv.appendChild(descriptionR);

    const iamgeDiv = document.querySelector('.courseCardImage');
    const detailesImage = document.createElement('img');
    detailesImage.src = `./assets/images/${detailesData.image}`;
    detailesImage.alt = detailesData.name;
    iamgeDiv.appendChild(detailesImage);

    const madeBy = document.querySelector('.subtitle2');
    const authorTopic = document.createElement('span');
    const autherName = document.createElement('a');
    autherName.href = "#";
    authorTopic.innerText = detailesData.topic + " by ";
    autherName.innerText = detailesData.name;
    madeBy.appendChild(authorTopic);
    madeBy.appendChild(autherName);

    const listSubTopics = document.querySelector('.listSubTopic');

    const listHeader = document.createElement('li');
    const listTitle = document.createElement('div');
    listTitle.classList.add("listTitle");
    listTitle.innerText = detailesData.topic + " Sub Topics";
    listHeader.appendChild(listTitle);
    listSubTopics.appendChild(listHeader);

    for (let i = 0; i < detailesData.subtopics.length; i++) {
      const listItem = document.createElement('li');
      const checkSign = document.createElement('ion-icon');
      const listContent = document.createElement('p');
      listContent.innerText = detailesData.subtopics[i];
      checkSign.classList.add('checkMark');
      checkSign.name = 'checkmark-circle-outline';
      listSubTopics.appendChild(listItem);
      listItem.appendChild(checkSign);
      listItem.appendChild(listContent);
    }

  } catch (error) {
    console.error("Error rendering data:", error.message);
  }
}

async function renderFavourites(urlID) {
  const favDetailes = await fetchDetailes(urlID);
  try {

    const favContent = document.querySelector('.favouriteCourses');

    const favContainer = document.createElement('a');
    favContainer.classList.add('course');
    favContainer.href = `details.html?id=${favDetailes.id}`;

    const favImg = document.createElement('img');
    favImg.src = `./assets/images/${favDetailes.image}`;
    favImg.alt = favDetailes.name;
    favContainer.appendChild(favImg);
    favContent.appendChild(favContainer);

    const favContentDetailes = document.createElement('div');
    favContentDetailes.classList.add('courseContent');

    const favTitle = document.createElement('h3');
    favTitle.classList.add('courseTitle');
    favTitle.textContent = favDetailes.topic;
    favContentDetailes.appendChild(favTitle);
    favContainer.appendChild(favContentDetailes);

    const favRating = document.createElement('div');
    favRating.classList.add('courseRating');
    favContentDetailes.appendChild(favRating);


    for (let i = 0; i < favDetailes.rating; i++) {
      const star = document.createElement('ion-icon');
      star.name = 'star';
      favRating.appendChild(star);
    }

    for (let i = favDetailes.rating; i < 4; i++) {
      const starOutline = document.createElement('ion-icon');
      starOutline.name = 'star-outline';
      favRating.appendChild(starOutline);
    }

  } catch {
    console.error("Error rendering Favourites:", error.message);

  }
}

// Fetch the data from the API and call the renderData function
async function render() {
  try {
    const response = await fetch("https://tap-web-1.herokuapp.com/topics/list");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    data = await response.json();
    renderData(data);

  } catch (error) {
    console.error("Error fetching data:", error.message);
    alert("Error Loading Website")
  }
}
let counter;
// Rendering data function 
function renderData(data) {
  const currentUrl = window.location.href;

  if (currentUrl.endsWith("index.html") || currentUrl.endsWith("") ) {
    try {
      counter = 0;
      const allCourses = document.querySelector('.allCourses');
      allCourses.innerHTML = '';

      for (let card of data) {
        const course = document.createElement('a');
        course.href = `details.html?id=${card.id}`;
        course.classList.add('course');
        course.classList.add(`course-${card.id}`);
        const image = document.createElement('img');
        image.src = `./assets/images/${card.image}`;
        image.alt = card.name;
        course.appendChild(image);

        const courseContent = document.createElement('div');
        courseContent.classList.add('courseContent');

        const cardCategory = document.createElement('p');
        cardCategory.classList.add('courseSubTitle');
        cardCategory.innerText = card.category;
        courseContent.appendChild(cardCategory);

        const courseTitle = document.createElement('h3');
        courseTitle.classList.add('courseTitle');
        courseTitle.innerText = card.topic;
        courseContent.appendChild(courseTitle);

        const courseRating = document.createElement('div');
        courseRating.classList.add('courseRating');

        for (let i = 0; i < card.rating; i++) {
          const star = document.createElement('ion-icon');
          star.name = 'star';
          courseRating.appendChild(star);
        }

        for (let i = card.rating; i < 4; i++) {
          const starOutline = document.createElement('ion-icon');
          starOutline.name = 'star-outline';
          courseRating.appendChild(starOutline);
        }

        courseContent.appendChild(courseRating);

        const courseAuthor = document.createElement('p');
        courseAuthor.classList.add('courseAuthor');
        courseAuthor.innerText = 'Author: ' + card.name;
        courseContent.appendChild(courseAuthor);

        course.appendChild(courseContent);
        allCourses.appendChild(course);

        counter++;
        const countResult = document.querySelector('.resultsNumber');
        countResult.innerHTML = counter;
      }
      addCardClickEventListeners();

    } catch (error) {
      console.error("Error rendering data:", error.message);
    }
  } else {}
}



const handleSearch = debounce(async () => {
  try {
    const searchQuery = document.getElementById("searchInput").value;

    const response = await fetch(`https://tap-web-1.herokuapp.com/topics/list?phrase=${searchQuery}`);
    if (!response.ok) {
      throw new Error("Failed to fetch search data");
    }
    const searchData = await response.json();
    renderData(searchData);

    const sortList = document.getElementById('sortList');
    applySorting(sortList.value);

  } catch (error) {
    console.error("Error handling search:", error.message);
  }
}, 300);

function applySorting(selectedValue) {
  const searchQuery = document.getElementById("searchInput").value;
  try {
    const cardsContainer = document.querySelector('.allCourses');
    const cards = Array.from(document.querySelectorAll('.course'));

    if (selectedValue === "topicTitle" || selectedValue === "authorName") {
      cards.sort((a, b) => {
        const comparatorA = (selectedValue === "topicTitle") ? a.querySelector(".courseTitle").textContent.toLowerCase() : a.querySelector(".courseAuthor").textContent.toLowerCase();
        const comparatorB = (selectedValue === "topicTitle") ? b.querySelector(".courseTitle").textContent.toLowerCase() : b.querySelector(".courseAuthor").textContent.toLowerCase();

        if (comparatorA < comparatorB) return -1;
        if (comparatorA > comparatorB) return 1;
        return 0;
      });

      cards.forEach(card => {
        cardsContainer.appendChild(card);
      });
    } else if (selectedValue === "default" && searchQuery === '') {
      render();
    }
  } catch (error) {
    console.error("Error sorting data:", error.message);
  }
}

// SortData Function by topic and by author 
const sortData = function () {
  try {
    const sortList = document.getElementById('sortList');

    // Event listener for the 'change' event
    sortList.addEventListener('change', function () {
      const selectedValue = this.value;
      applySorting(selectedValue);
    });
    applySorting(sortList.value);
  } catch (error) {
    /*  console.error("Error sorting data:", error.message);  */
  }
}

function applyFiltering(selectedFilterValue) {
  const cards = Array.from(document.querySelectorAll('.course'));
  counter = 0;
  try {

    cards.forEach(card => {
      const courseSubTitle = card.querySelector('.courseSubTitle');
      if (selectedFilterValue === 'Default') {
        card.style.display = 'block';
      } else if (courseSubTitle.textContent === selectedFilterValue) {
        card.style.display = 'block';
        counter++;
      } else {
        card.style.display = 'none';
      }
      const countResult = document.querySelector('.resultsNumber');
      countResult.innerHTML = counter;
    });


  } catch (error) {
    console.error("Error Filtering data:", error.message);
  }
}

const filterData = function () {
  try {
    const filterList = document.getElementById('filterList');

    filterList.addEventListener('change', function () {
      const selectedOption = filterList.selectedOptions[0];

      if (selectedOption) {
        const selectedFilterText = selectedOption.textContent;
        applyFiltering(selectedFilterText);
      }
    });

    // Apply filtering when the page loads
    if (filterList.selectedOptions.length > 0) {
      const selectedFilterText = filterList.selectedOptions[0].textContent;
      applyFiltering(selectedFilterText);
    }
  } catch (error) {
    /*     console.error("Error filtering data:", error.message); */
  }
};
render();
sortData();
filterData();

const getCurrentUrl = function () {
  return window.location.href;

}

function favouriteButton() {
  const Url = getCurrentUrl();

  if (Url.includes('details.html')) {

    const favouritesButton = document.querySelector(".favouritesButton");

    favouritesButton.addEventListener("click", handleClick);

    function handleClick() {

      const favButton = document.querySelector(".favouritesButton");
      const favButtonContent= favButton.textContent.toLowerCase();
      const urlID = getIdFromUrl();
    if(favButtonContent.includes('add')){
      renderFavourites(urlID);
      favButton.innerText="Remove From Favourites ";
      const filledHeart= document.createElement('ion-icon');
      filledHeart.name = 'heart';
      filledHeart.classList.add('heartLogo');
      favButton.appendChild(filledHeart);
      
    } else{
      removeFromFavourite(urlID);
      favButton.innerText="Add to Favourites ";
      const filledHeart= document.createElement('ion-icon');
      filledHeart.name = 'heart-outline';
      filledHeart.classList.add('heartLogo');
      favButton.appendChild(filledHeart);
    }
    }

  };
}
function removeFromFavourite(urlID){
    const removeItem = document.querySelectorAll('.course');
    removeItem.forEach(anchor => {
      const hrefValue = anchor.getAttribute('href');
      if (hrefValue === `details.html?id=${urlID}`){
        anchor.remove();

      }
    });    
}

favouriteButton();
