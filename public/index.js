// init application namespace
const APPNS = {};

(function (app) {
  fetch('films.json')
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      app.data = data;
      app.films = ko.observableArray(data);

      app.collections = ko.observableArray([
        'alpha',
        'bravo',
        'charlie',
        'delta',
        'echo',
        'foxtrot',
        'golf'
      ]);

      const genres = data.flatMap((i) => i.Genre.split(', '));
      app.genres = ko.observableArray([
        '',
        ...genres
          .filter((item, index) => genres.indexOf(item) === index)
          .sort(),
      ]);

      const countries = data.flatMap((i) => i.Country.split(', '));
      app.countries = ko.observableArray([
        '',
        ...countries
          .filter((item, index) => countries.indexOf(item) === index)
          .sort(),
      ]);

      app.genreToShow = ko.observable('');
      app.countryToShow = ko.observable('');

      app.filmsToShow = ko.computed(function () {
        // Represents a filtered list of films
        // i.e., only those matching the "genreToShow" condition
        const genre = app.genreToShow();
        const country = app.countryToShow();
        // if (genre === '' && country === '') return app.films();
        return ko.utils.arrayFilter(app.films(), function (film) {
          return (
            (film.Genre.indexOf(genre) >= 0 || genre === '') &&
            (film.Country.indexOf(country) >= 0 || country === '')
          );
        });
      }, app);

      ko.applyBindings(app);
    });
})(APPNS);
