/**
 * EDLOIDAS DEVPAGE
 * ANGULAR.JS CONTROLLERS
 *
 * @author edloidas
 * @link edloidas@gmail.com
 */

function HomeController($scope) {
    $scope.links = {
        profile    : "http://edloidas.github.io",

        github     : "https://github.com/edloidas",
        twitter    : "https://twitter.com/edloidas",
        // facebook   : "",
        googleplus : "https://plus.google.com/100081532988366318441",
        vkontakte  : "http://vk.com/edloidas",

        work       : "http://www.sam-solutions.by"
    };

    $scope.avatar = {
        source : "img/fallout_like_me.png",
        width  : 256, // px, preferable <= 256
        height : 256, // px
    };

    $scope.resume = [
        {"title" : "Name",
         "data" : "Tolkachev Nikita"}
    ];
}
