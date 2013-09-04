/**
 * EDLOIDAS DEVPAGE
 * ANGULAR.JS CONTROLLERS
 *
 * @author edloidas
 * @link edloidas@gmail.com
 */

function HomeController($scope, $http) {
    $scope.links = {
        profile: "http://edloidas.github.io",
        work:    "http://sam-solutions.com",
        social:  [
            {name:  "GitHub",
             class: "github",
             url:   "https://github.com/edloidas"},
            {name:  "Twitter",
             class: "twitter",
             url:   "https://twitter.com/edloidas"},
            {name:  "VKontakte",
             class: "vkontakte",
             url:   "https://vk.com/edloidas"},
            {name:  "Google+",
             class: "googleplus",
             url:   "https://plus.google.com/100081532988366318441"},
        ]
    };

    $scope.profile = {
        hello:     "Hello. I'm Nikita",
        avatar:    "img/fallout_like_me.png",
        quote :    "\"...\"",
        quoteRef : ""
    };

    $http.get('data/quotes.json').success(function(data) {
        var i = Math.floor(Math.random() * data.length);

        if(typeof(Storage) !== "undefined") {
            while (data.length > 1 && i === parseInt(localStorage.devpage_quote)) {
                i = Math.floor(Math.random() * data.length);
            }
            localStorage.devpage_quote = i;
        }

        $scope.profile.quote = "\"" + data[i].quote + "\"";
        $scope.profile.quoteRef = data[i].ref;
    });
}
