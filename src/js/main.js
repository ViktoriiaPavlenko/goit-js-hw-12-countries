import countryCardTpl from '../templates/country.hbs';
import countriesListTpl from '../templates/list.hbs';
import API from './fetchCountries';
import getRefs from './refs';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';

const debounce = require('lodash.debounce')
const refs = getRefs();
refs.inputRef.addEventListener('input', debounce(onSearch, 500));

function onSearch() {
    if (!refs.inputRef.value) {
    onInputClear();
    return;
  }
    onInputClear();
    const searchQuery = refs.inputRef.value.trim();
    API.fetchCountry(searchQuery)
        .then(country => {
            if (country.length > 10) {
                error({
                    text: 'Ooops, specify your query🤔',
                    delay: 2000,
                });
            } else if (country.status === 404) {
                error({
                    text: 'I`m not a magician!🙄',
                    delay: 2000,
                });
            } else if (country.length === 1) {
                onRenderCountryCard(country);
            } else if (country.length <= 10) {
                onRenderCountriesList(country);
            }
        })
        .catch(onFetchError)
}

function onRenderCountryCard(country) {
    const markup = countryCardTpl(country);
    refs.containerRef.innerHTML = markup;
}

function onRenderCountriesList(country) {
    const listMarkup = countriesListTpl(country);
    refs.countriesListRef.innerHTML = listMarkup;
}

function onInputClear() {
    refs.containerRef.innerHTML = '';
    refs.countriesListRef.innerHTML = '';
}

function onFetchError(Error) {
    Error;
}