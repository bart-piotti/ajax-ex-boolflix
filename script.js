var source = $('#movie-card-template').html();
var template = Handlebars.compile(source);


$(document).ready(function() {
    $('input').keyup(function(){
        cercaFilm()
    })
})

function cercaFilm() {
    if ($('input').val() != '') {
        film_cercato = $('.ricerca input').val()
        $.ajax({
            'url': 'https://api.themoviedb.org/3/search/movie',
            'method': 'GET',
            'error': function() {
                alert('si è verificato un errore');
            },
            'data': {
                api_key: '04c8010e23bdb4d1bc1337257719bb51',
                query: film_cercato,
                language: 'it'
            },
            'success': function(data){
                film_trovati = data.results

                $('.film-container *').remove()

                for (var i = 0; i < film_trovati.length; i++) {
                    context = {
                        titolo: film_trovati[i].title,
                        lingua: film_trovati[i].original_language.toUpperCase(),
                        voto: film_trovati[i].vote_average,
                        card_class: 'film' + i,
                        originale: film_trovati[i].original_title
                    }

                    $('.film-container').append(template(context))

                    if (film_trovati[i].title == film_trovati[i].original_title) {
                        $('.film' + i + ' .ori').hide()
                    }

                    if (film_trovati[i].vote_average < 7 && film_trovati[i].vote_average >= 4) {
                        $('.film' + i + ' .voto').addClass('giallo')
                    }
                    else if (film_trovati[i].vote_average < 4) {
                        $('.film' + i + ' .voto').addClass('rosso')
                    }
                }// /for
            }// /Success
        })// /ajax
    }
}
