function loadEvents() {
    var filtro = JSON.parse(localStorage.getItem('filter') || false);
    if (filtro) {
        ajaxForSearch("/tickiticket_v7/module/shop/controller/controller_shop.php?op=filter", filtro);
    } else {
        ajaxForSearch("/tickiticket_v7/module/shop/controller/controller_shop.php?op=all_events");
    }
}

var leafletAssetsPromise = null;
var eventsLeafletMap = null;
var detailLeafletMap = null;

function ensureLeafletLoaded() {
    if (window.L && typeof window.L.map === 'function') {
        return Promise.resolve();
    }

    if (leafletAssetsPromise) {
        return leafletAssetsPromise;
    }

    leafletAssetsPromise = new Promise(function (resolve, reject) {
        if (!document.getElementById('leaflet-css')) {
            var css = document.createElement('link');
            css.id = 'leaflet-css';
            css.rel = 'stylesheet';
            css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            css.crossOrigin = '';
            document.head.appendChild(css);
        }

        var existingScript = document.getElementById('leaflet-js');
        if (existingScript) {
            existingScript.addEventListener('load', function () { resolve(); }, { once: true });
            existingScript.addEventListener('error', function () { reject(new Error('No se pudo cargar Leaflet')); }, { once: true });
            return;
        }

        var script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = function () { resolve(); };
        script.onerror = function () { reject(new Error('No se pudo cargar Leaflet')); };
        document.body.appendChild(script);
    });

    return leafletAssetsPromise;
}

function parseCoordValue(value) {
    var number = parseFloat(value);
    return Number.isFinite(number) ? number : null;
}

function getCoord(shopItem, keys) {
    for (var i = 0; i < keys.length; i++) {
        if (Object.prototype.hasOwnProperty.call(shopItem, keys[i])) {
            var coord = parseCoordValue(shopItem[keys[i]]);
            if (coord !== null) {
                return coord;
            }
        }
    }
    return null;
}

function geolocalizado_all(shop) {
    if (!Array.isArray(shop) || shop.length === 0) {
        return;
    }

    if (!document.getElementById('event-map-tooltip-style')) {
        var tooltipStyle = document.createElement('style');
        tooltipStyle.id = 'event-map-tooltip-style';
        tooltipStyle.textContent = '.event-map-tooltip{background:#111827;color:#fff;border:0;border-radius:6px;padding:4px 8px;font-size:12px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.2);} .event-map-tooltip:before{border-top-color:#111827 !important;}';
        document.head.appendChild(tooltipStyle);
    }

    if (!document.getElementById('map_events')) {
        $('<h3 id="map_events_title" style="margin-top:28px; margin-bottom:12px; font-size:1.35rem; font-weight:800; color:#dbe4ee;">Encuentra la ubicacion del evento mas cercano a ti</h3>')
            .insertAfter('#list_events_shop');
        $('<div id="map_events" style="width:100%; height:520px; border-radius:14px; overflow:hidden; margin-top:28px; margin-bottom:24px; border:1px solid #dbe4ee; box-shadow:0 10px 25px rgba(15,23,42,0.08);"></div>')
            .insertAfter('#map_events_title');
    }

    if (window.innerWidth < 768) {
        $('#map_events').css('height', '420px');
    } else {
        $('#map_events').css('height', '520px');
    }

    $('#map_events').show();

    ensureLeafletLoaded().then(function () {
        if (eventsLeafletMap) {
            eventsLeafletMap.remove();
        }

        eventsLeafletMap = L.map('map_events').setView([38.8397, -0.61667], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(eventsLeafletMap);

        var bounds = L.latLngBounds();
        var coordUsage = {};

        for (var row = 0; row < shop.length; row++) {
            var item = shop[row];
            var lat = getCoord(item, ['lat', 'latitude', 'latitud', 'coord_lat', 'stadium_lat', 'estadio_lat']);
            var lng = getCoord(item, ['lon', 'lng', 'long', 'longi', 'longitud', 'coord_lng', 'stadium_lng', 'estadio_lng']);

            if (lat === null || lng === null) {
                continue;
            }

            var popupImg = '';
            if (item.imagen_evento) {
                var popupImgUrl = item.imagen_evento.replace('/opt/lampp/htdocs/tickiticket_v7', '/tickiticket_v7');
                popupImg = '<img src="' + popupImgUrl + '" style="width:100%; max-width:220px; margin-top:8px; border-radius:8px;">';
            }

            var popupHtml =
                '<h3 style="text-align:center; margin:0 0 8px 0;">' + (item.nombre_evento || 'Evento') + '</h3>' +
                '<p style="text-align:center; margin:0;">Fecha: <b>' + (item.fecha_evento || '-') + '</b></p>' +
                '<p style="text-align:center; margin:4px 0 0 0;">Estadio: <b>' + (item.nombre_estadio || '-') + '</b></p>' +
                popupImg;

            var coordKey = lat.toFixed(6) + ',' + lng.toFixed(6);
            var coordIndex = coordUsage[coordKey] || 0;
            coordUsage[coordKey] = coordIndex + 1;

            var markerLat = lat;
            var markerLng = lng;

            // Si varios eventos comparten estadio, desplazar ligeramente para que se puedan clicar todos.
            if (coordIndex > 0) {
                var angle = (coordIndex * 45) * (Math.PI / 180);
                var offset = 0.00035 * Math.ceil(coordIndex / 8);
                markerLat = lat + Math.sin(angle) * offset;
                markerLng = lng + Math.cos(angle) * offset;
            }

            var marker = L.marker([markerLat, markerLng]).addTo(eventsLeafletMap).bindPopup(popupHtml);
            marker.bindTooltip((item.nombre_evento || 'Evento'), {
                permanent: true,
                direction: 'top',
                offset: [0, -12],
                className: 'event-map-tooltip'
            });
            if (item.id_evento) {
                marker.on('click', (function (eventId) {
                    return function () {
                        $('#map_events_title').hide();
                        $('#map_events').hide();
                        loadDetails(eventId);
                    };
                })(item.id_evento));
            }
            bounds.extend([markerLat, markerLng]);
        }

        if (bounds.isValid()) {
            eventsLeafletMap.fitBounds(bounds, { padding: [24, 24] });
        }
    }).catch(function (err) {
        console.log('Error Leaflet:', err);
    });
}

function ajaxForSearch(url, filter) {
    ajaxPromise(url, 'POST', 'JSON', { 'filter': filter })
        .then(function (data) {
            console.log(data);
            $('#content_shop_events').empty();

            if (data == "error") {
                $('#content_shop_events').html('<h3>No se encontraron eventos.</h3>');
            } else {
                for (let row = 0; row < data.length; row++) {
                    let mainImgUrl = data[row].imagen_evento.replace(
                        '/opt/lampp/htdocs/tickiticket_v7',
                        '/tickiticket_v7'
                    );

                    // Construir slides del carrusel
                    let slides = `
                        <div class="swiper-slide">
                            <div style="width:100%; height:100%; background-image:url(${mainImgUrl}); background-size:cover; background-position:center;"></div>
                        </div>
                    `;

                    // Añadir imágenes adicionales del evento
                    if (data[row].imagenes && data[row].imagenes.length > 0) {
                        for (let i = 0; i < data[row].imagenes.length; i++) {
                            let imgUrl = data[row].imagenes[i].ruta_imagen.replace(
                                '/opt/lampp/htdocs/tickiticket_v7',
                                '/tickiticket_v7'
                            );
                            slides += `
                                <div class="swiper-slide">
                                    <div style="width:100%; height:100%; background-image:url(${imgUrl}); background-size:cover; background-position:center;"></div>
                                </div>
                            `;
                        }
                    }

                    let swiperClass = 'swiper-event-' + data[row].id_evento;

                    $('<div></div>')
                        .attr({ 'id': data[row].id_evento, 'class': 'event_card' })
                        .appendTo('#content_shop_events')
                        .html(`
                            <div style="border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; background:#f8fafc;">
                                <div class="swiper ${swiperClass}" style="height:220px; width:100%;">
                                    <div class="swiper-wrapper">
                                        ${slides}
                                    </div>
                                    <div class="swiper-pagination swiper-pagination-${data[row].id_evento}"></div>
                                    <div class="swiper-button-prev swiper-prev-${data[row].id_evento}"></div>
                                    <div class="swiper-button-next swiper-next-${data[row].id_evento}"></div>
                                </div>
                                <div style="padding:20px;">
                                    <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:8px; color:#000;">${data[row].nombre_evento}</h3>
                                    <p style="color:#000; font-size:0.9rem; margin-bottom:4px;">Fecha: ${data[row].fecha_evento}</p>
                                    <div style="display:flex; gap:10px; margin-top:16px;">
                                        <button class='btn_details' id='${data[row].id_evento}' style='flex:1; padding:10px; background:#22c55e; color:#000; font-weight:700; border:none; border-radius:8px; cursor:pointer;'>Ver Detalles</button>
                                        <button style='flex:1; padding:10px; background:#f1f5f9; color:#000; font-weight:700; border:none; border-radius:8px; cursor:pointer;'>Comprar</button>
                                    </div>
                                </div>
                            </div>
                        `);

                    // Inicializar Swiper para este evento
                    new Swiper('.' + swiperClass, {
                        loop: true,
                        pagination: {
                            el: '.swiper-pagination-' + data[row].id_evento,
                            clickable: true
                        },
                        navigation: {
                            nextEl: '.swiper-next-' + data[row].id_evento,
                            prevEl: '.swiper-prev-' + data[row].id_evento
                        },
                        autoplay: {
                            delay: 4000,
                            disableOnInteraction: false,
                        },
                    });
                }
                geolocalizado_all(data);
            }
        }).catch(function (err) {
            console.log('Error shop:', err);
        });
}

function loadDetails(id_evento) {
    ajaxPromise(`/tickiticket_v7/module/shop/controller/controller_shop.php?op=details_event&id=${id_evento}`, 'GET', 'JSON')
        .then(function (data) {
            $('#list_events_shop').hide();
            $('#detail_event').show();
            $('.date_event_detail').empty();

            let event = data[0];
            let images = data[1][0];
            let extras = data[2];

            console.log('extras:', extras);


            let slides = '';

            let mainImgUrl = event.imagen_evento.replace(
                '/opt/lampp/htdocs/tickiticket_v7',
                '/tickiticket_v7'
            );
            slides += `
                <div class="swiper-slide">
                    <div style="width:100%; height:100%; background-image:url(${mainImgUrl}); background-size:cover; background-position:center;"></div>
                </div>
            `;

            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    let imgUrl = images[i].ruta_imagen.replace(
                        '/opt/lampp/htdocs/tickiticket_v7',
                        '/tickiticket_v7'
                    );


                    slides += `
                        <div class="swiper-slide">
                            <div style="width:100%; height:100%; background-image:url(${imgUrl}); background-size:cover; background-position:center;"></div>
                        </div>
                    `;
                }
            }

            let extrasHtml = '';
            if (extras && extras.length > 0) {
                extrasHtml = `<div style="margin-bottom:20px;">
        <h3 style="font-size:1rem; font-weight:800; color:#111; margin-bottom:12px;">Extras incluidos</h3>
        <div style="display:flex; flex-wrap:wrap; gap:16px;">`;
                for (let i = 0; i < extras.length; i++) {
                    let iconUrl = extras[i].icon_extra.replace(
                        '/opt/lampp/htdocs/tickiticket_v7',
                        '/tickiticket_v7'
                    );
                    extrasHtml += `
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px; background:#f1f5f9; padding:12px 16px; border-radius:10px;">
                <img src="${iconUrl}" style="width:36px; height:36px; object-fit:contain;">
                <span style="font-size:0.75rem; color:#111; font-weight:600;">${extras[i].nombre_extra}</span>
            </div>`;
                }
                extrasHtml += `</div></div>`;
            } else {
                extrasHtml = '<p style="color: #000; font-size:0.9rem;">No hay extras disponibles</p>';
            }


            $('.date_event_detail').html(`
                <div style="max-width:800px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1); border:1px solid #e5e7eb;">
                    <div class="swiper swiper-detail-imgs" style="height:400px; width:100%;">
                        <div class="swiper-wrapper">
                            ${slides}
                        </div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>

                    <div style="padding:24px;">
                        <h2 style="font-size:1.8rem; font-weight:800; margin-bottom:16px; color:#111;">${event.nombre_evento}</h2>
                        
                        <table style="width:100%; margin-bottom:20px; color:#333; border-collapse: separate; border-spacing: 0 8px;">
                            <tr><td style="padding:4px 0;">Fecha</td><td><b>${event.fecha_evento}</b></td></tr>
                            <tr><td style="padding:4px 0;">Estadio</td><td><b>${event.nombre_estadio}</b></td></tr>
                            <tr><td style="padding:4px 0;">Ciudad</td><td><b>${event.nombre_ciudad}</b></td></tr>
                            <tr><td style="padding:4px 0;">Categoría</td><td><b>${event.tipo_categoria}</b></td></tr>
                            <tr><td style="padding:4px 0;">Local</td><td><b>${event.equipo_local}</b></td></tr>
                            <tr><td style="padding:4px 0;">Visitante</td><td><b>${event.equipo_visitante}</b></td></tr>
                            <tr><td style="padding:4px 0;">Estado</td><td><b style="color: ${event.estado === 'Programado' || event.estado === 'En Juego' ? '#22c55e' : '#ef4444'}">${event.estado}</b></td></tr>
                          
                        </table>
                        <div id="map_detail" style="width:100%; height:320px; border-radius:12px; overflow:hidden; margin:8px 0 20px 0; border:1px solid #dbe4ee;"></div>
                        ${extrasHtml}
                        

                        <button style="width:100%; padding:12px; background:#22c55e; color:#000; font-weight:700; border:none; border-radius:8px; cursor:pointer; font-size:1rem;">
                            Comprar Entradas
                        </button>
                    </div>
                </div>
            `);

            new Swiper('.swiper-detail-imgs', {
                loop: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
            });

            function geolocalizado_detail(data) {
                var lat = getCoord(data, ['lat', 'latitude', 'latitud', 'coord_lat', 'stadium_lat', 'estadio_lat']);
                var lon = getCoord(data, ['lon', 'lng', 'long', 'longi', 'longitud', 'coord_lng', 'stadium_lng', 'estadio_lng']);

                if (lat === null || lon === null || !document.getElementById('map_detail')) {
                    $('#map_detail').hide();
                    return;
                }

                ensureLeafletLoaded().then(function () {
                    if (detailLeafletMap) {
                        detailLeafletMap.remove();
                    }

                    detailLeafletMap = L.map('map_detail').setView([lat, lon], 13);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(detailLeafletMap);

                    var popupHtml =
                        '<h4 style="margin:0 0 6px 0;">' + (data.nombre_evento || 'Evento') + '</h4>' +
                        '<p style="margin:0;">Estadio: ' + (data.nombre_estadio || '-') + '</p>' +
                        '<p style="margin:4px 0 0 0;">Fecha: ' + (data.fecha_evento || '-') + '</p>';

                    L.marker([lat, lon]).addTo(detailLeafletMap).bindPopup(popupHtml).openPopup();
                }).catch(function (err) {
                    console.log('Error Leaflet detalle:', err);
                });
            }

            geolocalizado_detail(event);

        }).catch(function (err) {
            console.log('Error detalles:', err);
        });
}

function clicks() {
    $(document).on('click', '.btn_details', function () {
        let id_evento = this.getAttribute('id');
        $('#map_events_title').hide();
        $('#map_events').hide();
        loadDetails(id_evento);
    });

    $(document).on('click', '#btn_back', function () {
        $('#detail_event').hide();
        $('#list_events_shop').show();
        $('#map_events_title').show();
        $('#map_events').show();
        initShopList();
    });

    $(document).on('click', '.filter_remove', function () {
        filter_remove();
    });
}

var shopListInitialized = false;

function initShopList() {
    if (shopListInitialized) {
        return;
    }

    shopListInitialized = true;
    loadEvents();
    print_filters();
    loadStadiumFilters();
    filter_button();
}

function openDetailFromStorage() {
    var storedId = localStorage.getItem('detail_event_id');
    if (!storedId) {
        return false;
    }

    localStorage.removeItem('detail_event_id');
    $('#map_events_title').hide();
    $('#map_events').hide();
    loadDetails(storedId);
    return true;
}
function print_filters() {
    var savedFilters = JSON.parse(localStorage.getItem('filter') || '[]');
    var countFiltros = savedFilters.length;
    var savedMin = localStorage.getItem('filter_price_min') || 0;
    var savedMax = localStorage.getItem('filter_price_max') || 500;
    var savedOrder = localStorage.getItem('filter_order') || '';
    var savedExtras = JSON.parse(localStorage.getItem('filter_extras') || '[]');
    var savedTeams = JSON.parse(localStorage.getItem('filter_equipo') || '[]');

    var orderOpts = [
        { val: '', label: 'Sin ordenar' },
        { val: 'fecha_asc', label: 'Fecha: proximos' },
        { val: 'fecha_desc', label: 'Fecha: ultimos' },
        { val: 'precio_asc', label: 'Precio: menor' },
        { val: 'precio_desc', label: 'Precio: mayor' }
    ];

    var orderHtml = orderOpts.map(function (op) {
        var chk = savedOrder === op.val ? 'checked' : '';
        return '<label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#fff; cursor:pointer;">'
            + '<input type="radio" class="filter_order_rb" name="filter_order" value="' + op.val + '" ' + chk + ' style="width:15px; height:15px; accent-color:#22c55e;">'
            + op.label + '</label>';
    }).join('');

    $('<div class="div-filters" style="display:flex; flex-direction:column; gap:16px;"></div>').appendTo('.filters')
        .html(
            '<div style="display:flex; align-items:center; gap:8px;">' +
            '<span style="font-size:0.85rem; font-weight:600; color:#fff;">Filtros aplicados:</span>' +
            '<div style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:#22c55e; color:#fff; font-size:0.95rem; font-weight:900; border-radius:6px;">' + countFiltros + '</div>' +
            '</div>' +
            '<h3 style="font-size:1.1rem; font-weight:800; color:#fff; margin:0;">Filtros</h3>' +

            '<label style="font-size:0.85rem; font-weight:600; color:#fff;">Categoria</label>' +
            '<select class="filter_category" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid #334155; font-size:0.9rem; color:#fff; background:#0f172a;">' +
            '<option value="">Todas</option>' +
            '<option value="Primera Division">Primera Division</option>' +
            '<option value="Segunda Division">Segunda Division</option>' +
            '<option value="Primera RFEF">Primera RFEF</option>' +
            '<option value="Copa del Rey">Copa del Rey</option>' +
            '</select>' +

            '<label style="font-size:0.85rem; font-weight:600; color:#fff;">Estado</label>' +
            '<select class="filter_estado" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid #334155; font-size:0.9rem; color:#fff; background:#0f172a;">' +
            '<option value="">Todos</option>' +
            '<option value="Programado">Programado</option>' +
            '<option value="En Juego">En Juego</option>' +
            '<option value="Finalizado">Finalizado</option>' +
            '<option value="Cancelado">Cancelado</option>' +
            '</select>' +

            '<label style="font-size:0.85rem; font-weight:600; color:#fff;">Estadios</label>' +
            '<div id="filter_estadio_container" style="display:flex; flex-direction:column; gap:6px; margin-bottom:10px; max-height:220px; overflow:auto; padding-right:4px;"></div>' +

            '<label style="font-size:0.85rem; font-weight:600; color:#fff;">Equipos</label>' +
            '<div id="filter_equipo_container" style="display:flex; flex-direction:column; gap:6px; margin-bottom:10px;">' +
            ['Real Madrid', 'FC Barcelona', 'Athletic Club', 'RCD Mallorca'].map(function (team) {
                var chk = savedTeams.indexOf(team) !== -1 ? 'checked' : '';
                return '<label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#fff; cursor:pointer;">'
                    + '<input type="checkbox" class="filter_equipo_cb" value="' + team + '" ' + chk + ' style="width:15px; height:15px; accent-color:#22c55e;">'
                    + team + '</label>';
            }).join('') +
            '</div>' +

            // SLIDER PRECIO MAX
            '<div style="display:flex; flex-direction:column; gap:6px;">' +
            '  <label style="font-size:0.85rem; font-weight:600; color:#fff;">Precio: hasta <b id="label_price_max">' + savedMax + '&#8364;</b></label>' +
            '  <input type="range" id="filter_price_max" min="0" max="500" step="5" value="' + savedMax + '"' +
            '    style="width:100%; accent-color:#22c55e; cursor:pointer;">' +
            '</div>' +

            // RADIO BUTTONS ORDENAR POR
            '<div style="display:flex; flex-direction:column; gap:8px;">' +
            '  <label style="font-size:0.85rem; font-weight:600; color:#fff;">Ordenar por</label>' +
            '  <div id="filter_order_container" style="display:flex; flex-direction:column; gap:6px;">' + orderHtml + '</div>' +
            '</div>' +


            '<button class="filter_remove" id="Remove_filter" style="width:100%; padding:10px; background:#f1f5f9; color:#0f172a; font-weight:700; border:none; border-radius:8px; cursor:pointer; font-size:0.9rem;">Limpiar</button>'
        );

    // Actualizar label precio en tiempo real
    $('#filter_price_max').on('input', function () {
        $('#label_price_max').text($(this).val() + '€');
    });
}

function filter_remove() {
    localStorage.removeItem('filter');
    localStorage.removeItem('filter_category');
    localStorage.removeItem('filter_estado');
    localStorage.removeItem('filter_estadio');
    localStorage.removeItem('filter_equipo');
    localStorage.removeItem('filter_order');
    localStorage.removeItem('filter_price_min');
    localStorage.removeItem('filter_price_max');
    localStorage.removeItem('filter_extras');
    window.location.reload();
}

function filter_button() {
    // Restaurar selects desde localStorage
    if (localStorage.getItem('filter_category')) {
        $('.filter_category').val(localStorage.getItem('filter_category'));
    }
    if (localStorage.getItem('filter_estado')) {
        $('.filter_estado').val(localStorage.getItem('filter_estado'));
    }
    // Restaurar checkboxes de equipo desde localStorage
    var savedTeams = JSON.parse(localStorage.getItem('filter_equipo') || '[]');
    $('.filter_equipo_cb').each(function () {
        if (savedTeams.indexOf(this.value) !== -1) {
            $(this).prop('checked', true);
        }
    });

    var savedStadiums = JSON.parse(localStorage.getItem('filter_estadio') || '[]');
    $('.filter_estadio_cb').each(function () {
        if (savedStadiums.indexOf(this.value) !== -1) {
            $(this).prop('checked', true);
        }
    });

    // Escuchar cambios en todos los filtros
    $(document).on('change', '.filter_category, .filter_estado, .filter_estadio_cb, .filter_equipo_cb, #filter_price_min, #filter_price_max, .filter_order_rb, .filter_extra_cb', function () {
        apply_filters();
    });
}

function loadStadiumFilters() {
    var savedStadiums = JSON.parse(localStorage.getItem('filter_estadio') || '[]');

    ajaxPromise('/tickiticket_v7/module/shop/controller/controller_shop.php?op=all_estadios', 'GET', 'JSON')
        .then(function (data) {
            if (!Array.isArray(data) || data.length === 0) {
                $('#filter_estadio_container').html('<span style="font-size:0.85rem; color:#fff;">No hay estadios disponibles</span>');
                return;
            }

            var html = data.map(function (stadium) {
                var checked = savedStadiums.indexOf(String(stadium.id_estadio)) !== -1 ? 'checked' : '';
                return '<label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#fff; cursor:pointer;">' +
                    '<input type="checkbox" class="filter_estadio_cb" value="' + stadium.id_estadio + '" ' + checked + ' style="width:15px; height:15px; accent-color:#22c55e;">' +
                    stadium.nombre_estadio + '</label>';
            }).join('');

            $('#filter_estadio_container').html(html);
        })
        .catch(function (err) {
            console.log('Error estadios filtro:', err);
            $('#filter_estadio_container').html('<span style="font-size:0.85rem; color:#fff;">No se pudieron cargar los estadios</span>');
        });
}

function apply_filters() {
    var filter = [];

    var cat = $('.filter_category').val();
    var estado = $('.filter_estado').val();
    var stadiums = [];
    $('.filter_estadio_cb:checked').each(function () { stadiums.push(this.value); });
    var teams = [];
    $('.filter_equipo_cb:checked').each(function () { teams.push(this.value); });
    var priceMin = parseInt($('#filter_price_min').val()) || 0;
    var priceMax = parseInt($('#filter_price_max').val()) || 500;
    var order = $('input[name="filter_order"]:checked').val() || '';
    var extras = [];
    $('.filter_extra_cb:checked').each(function () { extras.push(this.value); });

    // Persistir en localStorage
    if (cat) localStorage.setItem('filter_category', cat);
    if (estado) localStorage.setItem('filter_estado', estado);
    localStorage.setItem('filter_estadio', JSON.stringify(stadiums));
    localStorage.setItem('filter_equipo', JSON.stringify(teams));
    localStorage.setItem('filter_price_min', priceMin);
    localStorage.setItem('filter_price_max', priceMax);
    localStorage.setItem('filter_order', order);
    localStorage.setItem('filter_extras', JSON.stringify(extras));

    // Construir array de filtros para el backend
    if (cat) filter.push(['tipo_categoria', cat]);
    if (estado) filter.push(['estado', estado]);
    if (stadiums.length > 0) filter.push(['id_estadio', stadiums]);
    if (teams.length > 0) filter.push(['nombre_equipo', teams]);
    if (priceMin > 0) filter.push(['precio_min', priceMin]);
    if (priceMax < 500) filter.push(['precio_max', priceMax]);
    if (order) filter.push(['order', order]);
    if (extras.length > 0) filter.push(['extras', extras]);

    localStorage.setItem('filter', JSON.stringify(filter));
    window.location.reload();
}
$(document).ready(function () {
    clicks();
    if (openDetailFromStorage()) {
        return;
    }

    initShopList();
});
