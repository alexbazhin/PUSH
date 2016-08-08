window.vkAsyncInit = function() {
    VK.init({
        apiId: 5565886
    });

    VK.Auth.getLoginStatus(function(response) {
        if (response.session) {
            console.log("авторизован")
        } else {
            VK.Auth.login(function(response) {
                if (response.session) {
                    /* Пользователь успешно авторизовался */
                    if (response.settings) {
                        /* Выбранные настройки доступа пользователя, если они были запрошены */
                    }
                } else {
                    /* Пользователь нажал кнопку Отмена в окне авторизации */
                }
            }, VK.access.AUDIO);
        }
    });    

    VK.Api.call('audio.get', {offset: 0}, function(r) {
        if(r.response) {
            console.log("before");            
            for (var i=0; i<r.response.length; i++) {
                $(document).ready(function(){
                    $(".middle_block__playlist").append('<li class="playlist__element">'+r.response[i].artist + " - "+r.response[i].title+'</li>');
                });                
            }

            /*NEw library*/
            $(document).ready(function(){
                var cssSelector = {
                    jPlayer: "#jquery_jplayer_1",
                    cssSelectorAncestor: "#jp_container_1"
                };

                var playlist = [];

                for (var i=0; i<r.response.length; i++) {
                    var tempObj= {};
                    tempObj.author = r.response[i].artist;
                    tempObj.title = r.response[i].title;
                    tempObj.mp3 = r.response[i].url;
                    playlist.push(tempObj);
                }                

                var options = {
                    swfPath: "js",
                    supplied: "mp3",
                    wmode: "window",
                    smoothPlayBar: false,
                    keyEnabled: true
                };

                new jPlayerPlaylist(cssSelector, playlist, options);
            });

            $(document).ready(function(){
                $(".top_block__current_song").html(r.response[0].artist + " - "+r.response[0].title);               
                console.log(r.response[0].url);
                console.log(r.response[1].url);
                console.log(r.response[2].url);
                $(".playlist__element").dblclick(function() {
                    $(".current_song").html($(this).html());
                    $("audio.player").attr("src", r.response[0].url);
                });
            });
            console.log("after");
        }
    });
};

setTimeout(function() {
    var el = document.createElement("script");
    el.type = "text/javascript";
    el.src = "//vk.com/js/api/openapi.js";
    el.async = true;
    document.getElementById("vk_api_transport").appendChild(el);
}, 0);

