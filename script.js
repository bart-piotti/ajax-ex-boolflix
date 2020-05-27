var source = $('#movie-card-template').html();
var template = Handlebars.compile(source);
var url_base = 'https://image.tmdb.org/t/p/';
var dimensione_poster = 'w500';

$(document).ready(function() {
    $('.fa-search').click(ricerca)
    $('input').keypress(function(e){
        if (e.which == 13) {
            ricerca()
        }
    })
})

function ricerca() {
    $('.main *').remove()
    cerca('movie')
    cerca('tv')
}

function cerca(daCercare) {
    if ($('input').val() != '') {
        $('h3').show()
        film_cercato = $('.ricerca input').val()
        $.ajax({
            'url': 'https://api.themoviedb.org/3/search/' + daCercare,
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
                console.log(film_trovati);



                for (var i = 0; i < film_trovati.length; i++) {
                    //Salvo in una variabile l'immagine da usare come poster
                    if (film_trovati[i].poster_path != null) {
                        var poster_path = url_base + dimensione_poster + film_trovati[i].poster_path
                    } else {
                        poster_path = 'img/poster_not_available.jpg'
                    }

                    //Se c'è l'overview la inserisco in una variabile
                    var overview = film_trovati[i].overview.substr(0, 120);
                    //Se non c'è l'overview => con handlebars aggiungo la classe 'hidden' al <p class='overview'>
                    if (overview.length == 0) {
                        var is_hidden = 'hidden';
                    } else {
                        is_hidden = '';
                    }
                    context = {
                        img_url: poster_path,
                        titolo: film_trovati[i].title,
                        lingua: film_trovati[i].original_language.toUpperCase(),
                        card_class: 'film' + i,
                        originale: film_trovati[i].original_title,
                        overview: overview + '...',
                        hidden: is_hidden
                    }
                    //Se .title è undefined allora è una serie, title ==> name
                    if (film_trovati[i].title == undefined) {
                        context.titolo = film_trovati[i].name
                        context.originale = film_trovati[i].original_name
                        context.card_class = 'serie' + i
                        $('.serie-container').append(template(context))
                    } else {
                        $('.film-container').append(template(context))
                    }

                    //Salvo il voto del film da 1 a 5 in una variabile
                    voto = Math.round(film_trovati[i].vote_average / 2)
                    stelle(voto, 'film', i)
                    stelle(voto, 'serie', i)

                    mostraLingua('film', i)
                    mostraLingua('serie', i)

                    if (
                        (film_trovati[i].title != undefined && film_trovati[i].title == film_trovati[i].original_title)
                        || (film_trovati[i].name != undefined && film_trovati[i].name == film_trovati[i].original_name)
                    ) {
                        if (film_trovati[i].title == undefined) {
                            $('.serie' + i + ' .ori').hide()
                        }else {
                            $('.film' + i + ' .ori').hide()
                        }
                    }

                }// /for
                if ( $('.film0').length > 0 ) {
                    $('.film p').hide()
                }else {
                    $('.film p').show()
                }
                if ( $('.serie0').length > 0 ) {
                    $('.serie p').hide()
                }else {
                    $('.serie p').show()
                }
            }// /Success
        })// /ajax
    }
}

function stelle(quantita, selettore, selettore2) {
    if ($('.' + selettore + selettore2 + ' .voto').html() == '') {
        //Aggiungo tante stelline quante ne indica la var voto
        for (var x = 0; x < voto; x++) {
            $('.' + selettore + selettore2 + ' .voto').append('<i class="fas fa-star"></i>')
        }
        for (var y = 0; y < 5 - voto; y++) {
            $('.' + selettore + selettore2 + ' .voto').append('<i class="far fa-star"></i>')
        }
    }
}

function mostraLingua(selettore, indice) {
    lingue = {
        en: 'img/eng.png',
        it: 'img/ita.png',
        fr: 'img/fra.png',
    }

    for (var key in lingue) {
        if ($('.' + selettore + indice + ' .lingua img').attr('src') == '') {
            if (key == film_trovati[indice].original_language) {
                $('.' + selettore + indice + ' .lingua span').remove()
                $('.' + selettore + indice + ' .lingua img').attr('src', lingue[key])
            }
        }
    }

}
