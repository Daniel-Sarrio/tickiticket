function loadEventos() {
    ajaxPromise('/tickiticket_v7/module/home/controller/controller_home.php?op=homePageGames', 'GET', 'JSON')
        .then(function (data) {
            for (let row = 0; row < data.length; row++) {
                let imagenUrl = data[row].imagen_evento.replace(
                    '/opt/lampp/htdocs/tickiticket_v7',
                    '/tickiticket_v7'
                );

                let slide = `
                <div class='swiper-slide event-detail' data-event='${data[row].id_evento}' style='position:relative; height:500px; overflow:hidden; cursor:pointer; background:#0f172a;'>
                    <img src='${imagenUrl}' style='width:100%; height:100%; object-fit:contain; object-position:center; display:block; transform:scale(1.22);' alt='${data[row].nombre_evento}'>
                    <div style='position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.75)); display:flex; flex-direction:column; justify-content:flex-end; padding:40px;'>
                        <h2 style='color:white; font-size:2.5rem; font-weight:900; margin-bottom:10px;'>
                            ${data[row].nombre_evento}
                        </h2>
                        <p style='color:rgba(255,255,255,0.85); font-size:1rem; margin-bottom:20px;'>
                            ${data[row].fecha_evento}
                        </p>
                        <button style='width:fit-content; padding:12px 32px; background:#22c55e; color:#000; font-weight:700; border:none; border-radius:8px; font-size:1rem; cursor:pointer;'>
                            Comprar Entradas
                        </button>
                    </div>
                </div>
                `;
                $('#containerGames').append(slide);
            }

            new Swiper('.swiper-eventos', {
                loop: true,
                autoplay: { delay: 4000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-eventos .swiper-button-next', prevEl: '.swiper-eventos .swiper-button-prev' }
            });

        }).catch(function (err) {
            console.log('Error:', err);
        });
}

function loadCategorias() {
    ajaxPromise('/tickiticket_v7/module/home/controller/controller_home.php?op=homePageCategories', 'GET', 'JSON')
        .then(function (data) {
            for (let row = 0; row < data.length; row++) {
                let imagenUrl = data[row].imagen_categoria.replace(
                    '/opt/lampp/htdocs/tickiticket_v7',
                    '/tickiticket_v7'
                );

                let slide =
                    "<div class='swiper-slide category-filter' data-category='" + data[row].tipo_categoria + "' style='height:220px; border-radius:12px; overflow:hidden; cursor:pointer; position:relative;'>" +
                    "<img src='" + imagenUrl + "' style='width:100%; height:100%; object-fit:cover; object-position:center; display:block;' alt='" + data[row].tipo_categoria + "'>" +
                    "<div style='position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(transparent 40%, rgba(0,0,0,0.75)); display:flex; align-items:flex-end; padding:16px;'>" +
                    "<h3 style='color:white; font-size:1.2rem; font-weight:800; text-shadow:0 1px 4px rgba(0,0,0,0.5);'>" + data[row].tipo_categoria + "</h3>" +
                    "</div>" +
                    "</div>";

                $('#containerCategories').append(slide);
            }

            new Swiper('.swiper-categories', {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: { nextEl: '.swiper-categories .swiper-button-next', prevEl: '.swiper-categories .swiper-button-prev' },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 }
                }
            });

        }).catch(function (err) {
            console.log('Error categorias:', err);
        });
}

function loadEquipos() {
    ajaxPromise('/tickiticket_v7/module/home/controller/controller_home.php?op=homePageEquipos', 'GET', 'JSON')
        .then(function (data) {
            for (let row = 0; row < data.length; row++) {
                let imagenUrl = data[row].imagen_equipo.replace(
                    '/opt/lampp/htdocs/tickiticket_v7',
                    '/tickiticket_v7'
                );

                let slide =
                    "<div class='swiper-slide team-filter' data-team='" + data[row].nombre_equipo + "' style='height:200px; border-radius:12px; overflow:hidden; cursor:pointer; background:#1a1a2e; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px;'>" +
                    "<div style='width:100px; height:100px; display:flex; align-items:center; justify-content:center; margin-bottom:12px;'>" +
                    "<img src='" + imagenUrl + "' style='max-width:100%; max-height:100%; object-fit:contain;' alt='" + data[row].nombre_equipo + "'>" +
                    "</div>" +
                    "<h3 style='color:white; font-size:1rem; font-weight:700; text-align:center;'>" + data[row].nombre_equipo + "</h3>" +
                    "</div>";

                $('#containerTeams').append(slide);
            }

            new Swiper('.swiper-teams', {
                slidesPerView: 2,
                spaceBetween: 16,
                navigation: { nextEl: '.swiper-teams .swiper-button-next', prevEl: '.swiper-teams .swiper-button-prev' },
                breakpoints: {
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 5 }
                }
            });

        }).catch(function (err) {
            console.log('Error equipos:', err);
        });
}

function loadEstadios() {
    ajaxPromise('/tickiticket_v7/module/home/controller/controller_home.php?op=homePageEstadios', 'GET', 'JSON')
        .then(function (data) {
            for (let row = 0; row < data.length; row++) {
                let imagenUrl = data[row].imagen_estadio.replace(
                    '/opt/lampp/htdocs/tickiticket_v7',
                    '/tickiticket_v7'
                );

                let slide =
                    "<div class='swiper-slide stadium-filter' data-stadium='" + data[row].id_estadio + "' style='height:220px; border-radius:12px; overflow:hidden; cursor:pointer; position:relative;'>" +
                    "<img src='" + imagenUrl + "' style='width:100%; height:100%; object-fit:cover; object-position:center; display:block;' alt='" + data[row].nombre_estadio + "'>" +
                    "<div style='position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(transparent 40%, rgba(0,0,0,0.75)); display:flex; align-items:flex-end; padding:16px;'>" +
                    "<h3 style='color:white; font-size:1.2rem; font-weight:800; text-shadow:0 1px 4px rgba(0,0,0,0.5);'>" + data[row].nombre_estadio + "</h3>" +
                    "</div>" +
                    "</div>";

                $('#containerEstadios').append(slide);
            }

            new Swiper('.swiper-estadios', {
                slidesPerView: 1,
                spaceBetween: 16,
                navigation: { nextEl: '.swiper-estadios .swiper-button-next', prevEl: '.swiper-estadios .swiper-button-prev' },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 }
                }
            });

        }).catch(function (err) {
            console.log('Error estadios:', err);
        });
}

$(document).ready(function () {
    loadEventos();
    loadCategorias();
    loadEquipos();
    loadEstadios();

    function resetHomeFilters() {
        localStorage.removeItem('filter');
        localStorage.removeItem('filter_category');
        localStorage.removeItem('filter_estado');
        localStorage.removeItem('filter_estadio');
        localStorage.removeItem('filter_order');
        localStorage.removeItem('filter_price_min');
        localStorage.removeItem('filter_price_max');
        localStorage.removeItem('filter_extras');
        localStorage.removeItem('filter_equipo');
    }

    $(document).on('click', '.team-filter', function () {
        var team = $(this).data('team');

        resetHomeFilters();

        localStorage.setItem('filter_equipo', JSON.stringify([team]));
        localStorage.setItem('filter', JSON.stringify([['nombre_equipo', [team]]]));


        window.location.href = 'index.php?page=controller_shop';
    });

    $(document).on('click', '.category-filter', function () {
        var category = $(this).data('category');

        resetHomeFilters();

        localStorage.setItem('filter_category', category);
        localStorage.setItem('filter', JSON.stringify([['tipo_categoria', category]]));

        window.location.href = 'index.php?page=controller_shop';
    });

    $(document).on('click', '.stadium-filter', function () {
        var stadium = String($(this).data('stadium'));

        resetHomeFilters();

        localStorage.setItem('filter_estadio', JSON.stringify([stadium]));
        localStorage.setItem('filter', JSON.stringify([['id_estadio', [stadium]]]));

        window.location.href = 'index.php?page=controller_shop';
    });

    $(document).on('click', '.event-detail', function () {
        var eventId = $(this).data('event');
        if (!eventId) {
            return;
        }

        resetHomeFilters();
        localStorage.setItem('detail_event_id', String(eventId));

        window.location.href = 'index.php?page=controller_shop';
    });
});
