// init model in app namespace
const APP_MODEL = {};

(function (model) {
  fetch('films.json')
    .then((response) => response.json())
    .then((data) => data.sort((a, b) => (a.Year > b.Year ? 1 : -1)))
    .then((data) => {
      model.data = data;

      const collections = [
        'alpha',
        'bravo',
        'charlie',
        'delta',
        'echo',
        'foxtrot',
        'golf',
      ];
      model.collections = ko.observableArray(
        collections.map((c) => `${c} collection`)
      );

      const BLANK = '';

      const removeDupes = (arr) =>
        arr.reduce(
          (unique, item) =>
            unique.includes(item) ? unique : [...unique, item],
          []
        );

      const genres = data.flatMap((i) => i.Genre.split(', '));
      model.genres = ko.observableArray([BLANK, ...removeDupes(genres).sort()]);

      const countries = data.flatMap((i) => i.Country.split(', '));
      model.countries = ko.observableArray([
        BLANK,
        ...removeDupes(countries).sort(),
      ]);

      model.genreToShow = ko.observable(BLANK);
      model.countryToShow = ko.observable(BLANK);

      model.filmsToShow = ko.pureComputed(function () {
        // Returns a filtered list of films

        // get selection criteria
        const genre = model.genreToShow();
        const country = model.countryToShow();

        model.filterResult = ko.utils.arrayFilter(data, function (film) {
          return (
            (genre === BLANK || film.Genre.indexOf(genre) >= 0) &&
            (country === BLANK || film.Country.indexOf(country) >= 0)
          );
        });

        return model.filterResult;
      }, model);

      model.myPostProcessingLogic = () => {
        const index = model.filterResult.map(i => i.Year).findIndex(i => i > '1999');
        console.log(`myPostProcessingLogic: ${index}`);
        const rows = document.querySelectorAll('tbody tr');
        if (index > 4 & rows.length > 4) {
          rows[index - 4].scrollIntoView();
        } else {
          window.scrollTo(0,0);
        }
      };

      ko.applyBindings(model);
    });
})(APP_MODEL);
