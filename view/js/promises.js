function ajaxPromise(sType, sTData, sUrl, sData = undefined) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: sUrl,
            type: sType,
            dataType: sTData,
            data: sData
        }).done((data) => {
            resolve(data);
        }).fail((jqXHR, textStatus, errorThrow) => {
            reject(errorThrow);
        }); 
    });
};

function ajaxPromise(url, method, type, data = undefined) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      contentType: "application/x-www-form-urlencoded",
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, status, error) {
        console.error("Error en AJAX:", status, error);
        reject(error);
      },
    });
  });
}
