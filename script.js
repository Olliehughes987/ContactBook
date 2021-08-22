"use strict";
let peopleData;
let button;

const userGen = () => {
  fetch('https://randomuser.me/api/?results=50&nat=gb')
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      peopleData = data;
      renderPeople();
    });
}

/*
  metafunction that tells the compare function what to compare based off the value
  of the select element.

*/
function newAttributeExtractor(sortValue) {
  switch(sortValue) {
    //checks what value the select element has, and then returns the respective
    //string for the compare value
    case "first":
      return (person => person.name.first);
    case "last":
      return (person => person.name.last);
    case "state":
      return (person => person.location.state);
  }
}

function renderPeople() {
  container.innerHTML = "";
  let people = peopleData['results'];
  const query = search.value.toLowerCase();

  /*
    Aslong as the search box isnt empty, it performs a function to filter
    the contacts by the query.
  */
  if(query) {
    people = people.filter(person =>

      // filters the array for any values containing the search query
      // this checks first and last name, aswell as location
      person.name.first.toLowerCase().includes(query)       ||
      person.name.last.toLowerCase().includes(query)        ||
      person.location.state.toLowerCase().includes(query)   ||
      person.location.country.toLowerCase().includes(query)
    );
  }


  const extractor = newAttributeExtractor(sort.value);
  people = people.sort((a,b) => {
    if(extractor(a) < extractor(b)) { return -1; }
    if(extractor(a) > extractor(b)) { return 1; }
    return 0;
  })

  people.forEach((person) => {
    // iterates through array and dynamically creates elements to be filled
    // with the data from the API
    populatePerson(person);
  });
}

function togglePanel() {
  document.getElementById("panel").classList.toggle('open');
}

function loadPanel(person) {
  // function takes in a person so that it can access the data,
  // populates the contact panel with the relevant information.
  document.getElementById("panelName").innerHTML = person.name.first + " " + person.name.last;
  document.getElementById("panelPhoto").style.backgroundImage="url(" + person.picture.large + ")";
  document.getElementById("age").innerHTML = "Age: <b>" + person.dob.age + "</b>";
  document.getElementById("email").innerHTML = "Email: <b>" + person.email + "</b>";
  document.getElementById("mobile").innerHTML = "Mobile: <b>" + person.cell + "</b>";
  document.getElementById("phone").innerHTML = "Phone: <b>" + person.phone + "</b>";
  document.getElementById("address").innerHTML =
  "Address: <b>" + person.location.street.number + " " + person.location.street.name
   + "<br>" + person.location.city + "<br>" + person.location.state + "<br>" +
   person.location.postcode + " " + person.location.country + "</b>";

  //toggles the panel so that it can be visible/hidden
  togglePanel();
}


function populatePerson(person) {
  // dynamically creates elements containing the respective information from
  // the person.
  let pic = document.createElement('img');
  let cont = document.createElement('div');
  let list = document.createElement('ul');
  let det = document.createElement('div');
  let names = document.createElement('h2');
  let place = document.createElement('p');

  cont.setAttribute("id","contact");
  det.setAttribute("id", "details");

  pic.setAttribute("id", "portrait");
  pic.setAttribute("src", person.picture.thumbnail);

  names.setAttribute("id", "name");
  names.innerHTML = person.name.first + " " + person.name.last;

  place.setAttribute("id", "location");
  place.innerHTML = person.location.state + "/" + person.location.country;

  cont.appendChild(pic);
  cont.appendChild(det);
  det.appendChild(names);
  det.appendChild(place);

// attatches an event handler to each contact so that the respective person con
// be passed through to the loadPanel function.
  cont.addEventListener("click", function() {
    loadPanel(person);
  });

  //appends the contact to the main container
  container.appendChild(cont);
}

//runs the API fetch function on load
window.addEventListener('load', () => {
    userGen();
})
