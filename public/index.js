// init model in app namespace
const APP_MODEL = {};

(function (model) {
  fetch('films.json')
    .then((response) => response.json())
    .then((data) => data.sort((a, b) => (a.Year > b.Year ? 1 : -1)))
    .then((data) =>
      data.map((i) => {
        i.highlight = i.Year > '1999' ? true : false;
        return i;
      })
    )
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
        return ko.utils.arrayFilter(
          data,
          (film) =>
            (genre === BLANK || film.Genre.indexOf(genre) >= 0) &&
            (country === BLANK || film.Country.indexOf(country) >= 0)
        );
      }, model);

      model.myPostProcessingLogic = () => {
        const index = model.scrollIndex;
        console.log(`myPostProcessingLogic: ${index}`);
        const rows = document.querySelectorAll('tbody tr');

        const rowOffset = 5; // rows to display before first highlighted row
        if (index > rowOffset - 1) {
          // adjust scroll to account for sticky header
          const dy =
            rows[index - rowOffset].getBoundingClientRect().top -
            rows[0].getBoundingClientRect().top;
          window.scrollTo(0, dy);
        } else {
          console.log('window scroll top');
          window.scrollTo(0, 0);
        }
      };

      const findFirstHighlightIndex = (arr) =>
        arr.map((i) => i.highlight).findIndex((i) => i === true);

      model.scrollIndex = findFirstHighlightIndex(data);

      model.filmsToShow.subscribe((updated) => {
        //console.log(updated);
        model.scrollIndex = findFirstHighlightIndex(updated);
        console.log(`model.scrollIndex: ${model.scrollIndex}`);
      });

      ko.applyBindings(model);
    });
})(APP_MODEL);
