function load_brands() {
    ajaxPromise('/tickiticket_v7/module/search/ctrl/ctrl_search.php?op=search_brand', 'POST', 'JSON')
        .then(function (data) {
            $('<option>Equipo</option>').attr('value', '0').attr('selected', true).appendTo('.search_brand')
            for (row in data) {
                $('<option value="' + data[row].id_brand + '">' + data[row].brand_name + '</option>').appendTo('.search_brand')
            }
        }).catch(function () {
            window.location.href = "index.php?modules=exception&op=503&error=fail_load_brands&type=503";
        });
}

function load_category(brand) {
    $('.search_category').empty();

    if (brand == undefined) {
        ajaxPromise('/tickiticket_v7/module/search/ctrl/ctrl_search.php?op=search_category_null', 'POST', 'JSON')
            .then(function (data) {
                $('<option>Categoria</option>').attr('value', '0').attr('selected', true).appendTo('.search_category')
                for (row in data) {
                    $('<option value="' + data[row].id_categoria + '">' + data[row].cat_name + '</option>').appendTo('.search_category')
                }
            }).catch(function () {
                window.location.href = "index.php?modules=exception&op=503&error=fail_load_category&type=503";
            });
    }
    else {
        ajaxPromise('/tickiticket_v7/module/search/ctrl/ctrl_search.php?op=search_category', 'POST', 'JSON', brand)
            .then(function (data) {
                $('<option>Categoria</option>').attr('value', '0').attr('selected', true).appendTo('.search_category')
                for (row in data) {
                    $('<option value="' + data[row].id_categoria + '">' + data[row].cat_name + '</option>').appendTo('.search_category')
                }
            }).catch(function () {
                window.location.href = "index.php?modules=exception&op=503&error=fail_loas_category_2&type=503";
            });
    }
}

function launch_search() {
    load_brands();
    load_category();
    $(document).on('change', '.search_brand', function () {
        let brand = $(this).val();
        if (brand === '0' || brand === null) {
            load_category();
        } else {
            load_category({ brand });
        }
    });
}

function autocomplete() {
    $("#autocom").on("keyup", function () {
        let current = $(this).val().trim();
        if (current.length < 1) {
            $('#search_auto').hide().empty();
            return;
        }
        let sdata = { complete: current };
        let brandValue = $('.search_brand').val();
        let categoryValue = $('.search_category').val();

        if (brandValue && brandValue !== '0') {
            sdata.brand = brandValue;
            if (categoryValue && categoryValue !== '0') {
                sdata.category = categoryValue;
            }
        }
        if ((!brandValue || brandValue === '0') && categoryValue && categoryValue !== '0') {
            sdata.category = categoryValue;
        }

        ajaxPromise('/tickiticket_v7/module/search/ctrl/ctrl_search.php?op=autocomplete', 'POST', 'JSON', sdata)
            .then(function (data) {
                $('#search_auto').empty();
                if (!data || data === "error") {
                    $('#search_auto').hide();
                    return;
                }
                $('#search_auto').show();
                for (row in data) {
                    $('<div></div>')
                        .appendTo('#search_auto')
                        .html(data[row].ciudad)
                        .attr({ 'class': 'searchElement', 'id': data[row].ciudad })
                        .css({
                            'color': '#0f172a',
                            'padding': '8px 10px',
                            'cursor': 'pointer'
                        });
                }
            }).catch(function () {
                $('#search_auto').fadeOut(500);
            });
    });

    $(document).on('click', '.searchElement', function () {
        $('#autocom').val(this.getAttribute('id'));
        $('#search_auto').fadeOut(150);
    });

    $(document).on('click scroll', function (event) {
        if (event.target.id !== 'autocom') {
            $('#search_auto').fadeOut(150);
        }
    });
}

function button_search() {
    $('#search-btn').on('click', function () {
        var filter = [];
        var brandValue = $('.search_brand').val();
        var categoryValue = $('.search_category').val();
        var cityValue = ($('#autocom').val() || '').trim();

        if (brandValue && brandValue !== '0') {
            var brandName = $('.search_brand option:selected').text().trim();
            if (brandName && brandName !== 'Equipo') {
                filter.push(['nombre_equipo', [brandName]]);
            }
        }

        if (categoryValue && categoryValue !== '0') {
            var categoryName = $('.search_category option:selected').text().trim();
            if (categoryName && categoryName !== 'Categoria') {
                filter.push(['tipo_categoria', categoryName]);
            }
        }

        if (cityValue.length > 0) {
            filter.push(['nombre_ciudad', cityValue]);
        }

        localStorage.removeItem('detail_event_id');
        localStorage.removeItem('filter');
        if (filter.length > 0) {
            localStorage.setItem('filter', JSON.stringify(filter));
        }
        window.location.href = 'index.php?page=controller_shop';
    });
}

$(document).ready(function () {
    launch_search();
    autocomplete();
    button_search();
});
