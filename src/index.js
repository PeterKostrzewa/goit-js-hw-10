import * as _ from 'lodash';
import Notiflix from 'notiflix';

const textInput = document.getElementById('textInput');

textInput.addEventListener('input', _.debounce(handleInputChange, 300));

function handleInputChange() {
  const inputValue = textInput.value;

  fetch('https://restcountries.com/v3.1/name/' + inputValue, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          Notiflix.Notify.warning(
            'Not Found',
            'No country found for input: ' + inputValue
          );
        } else {
          throw new Error('Network response was not ok');
        }
      }
      return response.json();
    })
    .then(data => {
      if (data.length == 1) {
        const country = data[0];
        const itemListContainer = document.getElementById('itemList');
        const countryCard = `
          <div class="country-card">
            <img src="${country.flags.svg}" alt="${
          country.name
        }" width="60px" height="40px">
            <h2>${country.name.official}</h2>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Languages: ${Object.entries(country.languages)
              .map(lang => lang[1])
              .join(', ')}</p>
          </div>
        `;
        itemListContainer.innerHTML = countryCard;
      } else if (data.length > 1 && data.length <= 10) {
        displayItemList(data, inputValue);
      } else {
        Notiflix.Notify.info(
          'To many matches',
          'Please enter more specific name'
        );
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayItemList(items, inputValue) {
  const itemListContainer = document.getElementById('itemList');

  itemListContainer.innerHTML = '';

  const itemList = document.createElement('ul');
  for (let i = 0; i < Math.min(items.length, 10); i++) {
    const item = items[i];

    const listItem = document.createElement('li');

    const imageElement = document.createElement('img');
    imageElement.width = 40;
    imageElement.height = 30;
    imageElement.src = item.flags.svg;
    imageElement.alt = 'Flag Image';

    const textElement = document.createElement('span');
    textElement.textContent = item.name.official;

    listItem.appendChild(imageElement);
    listItem.appendChild(textElement);

    itemList.appendChild(listItem);
  }

  itemListContainer.appendChild(itemList);
}
