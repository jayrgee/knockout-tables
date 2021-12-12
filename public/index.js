// init model in app namespace
const APP_MODEL = {};

(function (model) {
  fetch('films.json')
    .then((response) => response.json())
    .then((data) => {
      model.data = data;

      model.collections = ko.observableArray([
        'alpha',
        'bravo',
        'charlie',
        'delta',
        'echo',
        'foxtrot',
        'golf',
      ]);

      const genres = data.flatMap((i) => i.Genre.split(', '));
      model.genres = ko.observableArray([
        '',
        ...genres
          .filter((item, index) => genres.indexOf(item) === index)
          .sort(),
      ]);

      const countries = data.flatMap((i) => i.Country.split(', '));
      model.countries = ko.observableArray([
        '',
        ...countries
          .filter((item, index) => countries.indexOf(item) === index)
          .sort(),
      ]);

      model.genreToShow = ko.observable('');
      model.countryToShow = ko.observable('');

      model.filmsToShow = ko.computed(function () {
        // Returns a filtered list of films

        // get selection criteria
        const genre = model.genreToShow();
        const country = model.countryToShow();

        return ko.utils.arrayFilter(data, function (film) {
          return (
            (film.Genre.indexOf(genre) >= 0 || genre === '') &&
            (film.Country.indexOf(country) >= 0 || country === '')
          );
        });
      }, model);

      ko.applyBindings(model);
    });
})(APP_MODEL);
