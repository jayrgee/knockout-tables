const APPNS = {};
(function (app) {
  //statements
  fetch('films.json')
    .then((response) => response.json())
    .then((data) => {
      app.films = ko.observableArray(data);

      app.genreToShow = ko.observable("");

      app.filmsToShow = ko.computed(function() {
        // Represents a filtered list of films
        // i.e., only those matching the "genreToShow" condition
        var genre = app.genreToShow();
        if (genre == "") return app.films();
        return ko.utils.arrayFilter(app.films(), function(film) {
            return film.Genre == genre;
        });
    }, app);

      //   console.log(data);
      ko.applyBindings(app);
    });
})(APPNS);
