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
                        card_class: 'film' + i,
                        originale: film_trovati[i].original_title
                    }

                    $('.film-container').append(template(context))

                    //Salvo il voto del film da 1 a 5 in una variabile
                    voto = Math.round(film_trovati[i].vote_average / 2)
                    stelle(voto, i)
                    if (film_trovati[i].title == film_trovati[i].original_title) {
                        $('.film' + i + ' .ori').hide()
                    }
                }// /for
            }// /Success
        })// /ajax
    }
}

function stelle(quantita, selettore) {
    //Aggiungo tante stelline quante ne indica la var voto
    for (var x = 0; x < voto; x++) {
        $('.film' + selettore + ' .voto').append('<i class="fas fa-star"></i>')
    }
    for (var y = 0; y < 5 - voto; y++) {
        $('.film' + selettore + ' .voto').append('<i class="far fa-star"></i>')
    }
}
