document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([-6.918723406063201, 107.60651056298619], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const markers = {};
  let newMarker;
  let markerToDelete;

  function loadPOIs() {
    $.ajax({
      url: "read.php",
      method: "GET",
      dataType: "json",
      success: function (data) {
        data.forEach((poi) => {
          const marker = L.marker([poi.LATITUDE, poi.LONGITUDE], {
            draggable: true,
          }).addTo(map).bindPopup(`
                        <b>${poi.NAMA_LOKASI}</b><br>
                        ${poi.DESKRIPSI}<br>
                        ${poi.ALAMAT}<br>
                        ${poi.KATEGORI}<br>
                        ${poi.PHONE}<br>
                        ${poi.WEBSITE}
                    `);

          marker.on("dragstart", function (e) {
            originalLatLng = e.target.getLatLng();
          });

          marker.on("dragend", function (e) {
            const newLatLng = e.target.getLatLng();
            $("#latitude").val(newLatLng.lat);
            $("#longitude").val(newLatLng.lng);
            $("#namalokasi").val(poi.NAMA_LOKASI);
            $("#deskripsi").val(poi.DESKRIPSI);
            $("#alamat").val(poi.ALAMAT);
            $("#kategori").val(poi.KATEGORI);
            $("#phone").val(poi.PHONE);
            $("#website").val(poi.WEBSITE);
            $("#poiId").val(JSON.stringify({ oldLat: poi.LATITUDE, oldLng: poi.LONGITUDE }));
            $("#poiModal").modal("show");

            $("#poiModal")
              .off("hidden.bs.modal")
              .on("hidden.bs.modal", function () {
                if ($("#poiId").val() === JSON.stringify({ oldLat: poi.LATITUDE, oldLng: poi.LONGITUDE })) {
                  marker.setLatLng(originalLatLng);
                }
              });
          });

          marker.on("contextmenu", function (e) {
            markerToDelete = marker;
            $("#confirmDeleteModal").modal("show");
          });

          markers[poi.LATITUDE + "," + poi.LONGITUDE] = marker;
        });
      },
    });
  }

  loadPOIs();

  map.on("click", function (e) {
    if (newMarker) {
      map.removeLayer(newMarker);
    }

    newMarker = L.marker(e.latlng, {
      draggable: true,
    }).addTo(map);
    $("#latitude").val(e.latlng.lat);
    $("#longitude").val(e.latlng.lng);
    $("#namalokasi").val("");
    $("#deskripsi").val("");
    $("#alamat").val("");
    $("#kategori").val("");
    $("#phone").val("");
    $("#website").val("");
    $("#poiModal").modal("show");
    $("#poiModal")
      .off("hidden.bs.modal")
      .on("hidden.bs.modal", function () {
        if (!$("#poiId").val()) {
          map.removeLayer(newMarker);
        }
      });
  });

  $("#savePoi").on("click", function () {
    const poiData = {
      latitude: $("#latitude").val(),
      longitude: $("#longitude").val(),
      namalokasi: $("#namalokasi").val(),
      deskripsi: $("#deskripsi").val(),
      alamat: $("#alamat").val(),
      kategori: $("#kategori").val(),
      phone: $("#phone").val(),
      website: $("#website").val(),
    };

    const poiId = $("#poiId").val();
    let url = "create.php";
    if (poiId) {
      const oldCoordinates = JSON.parse(poiId);
      poiData.oldLatitude = oldCoordinates.oldLat;
      poiData.oldLongitude = oldCoordinates.oldLng;
      url = "update.php";
    }

    $.ajax({
      url: url,
      method: "POST",
      data: poiData,
      success: function () {
        $("#poiModal").modal("hide");

        if (!poiId) {
          newMarker
            .bindPopup(
              `
                    <b>${poiData.namalokasi}</b><br>
                    ${poiData.deskripsi}<br>
                    ${poiData.alamat}<br>
                    ${poiData.kategori}<br>
                    ${poiData.phone}<br>
                    ${poiData.website}
                `
            )
            .openPopup();

          newMarker.on("dragend", function (e) {
            const newLatLng = e.target.getLatLng();
            $("#latitude").val(newLatLng.lat);
            $("#longitude").val(newLatLng.lng);
            $("#namalokasi").val(poiData.namalokasi);
            $("#deskripsi").val(poiData.deskripsi);
            $("#alamat").val(poiData.alamat);
            $("#kategori").val(poiData.kategori);
            $("#phone").val(poiData.phone);
            $("#website").val(poiData.website);
            $("#poiId").val(JSON.stringify({ oldLat: poiData.latitude, oldLng: poiData.longitude }));
            $("#poiModal").modal("show");
          });

          markers[poiData.latitude + "," + poiData.longitude] = newMarker;
        } else {
          const oldCoordinates = JSON.parse(poiId);
          const marker = markers[oldCoordinates.oldLat + "," + oldCoordinates.oldLng];
          if (marker) {
            marker.setLatLng([poiData.latitude, poiData.longitude]);
            marker.getPopup().setContent(`
                <b>${poiData.namalokasi}</b><br>
                ${poiData.deskripsi}<br>
                ${poiData.alamat}<br>
                ${poiData.kategori}<br>
                ${poiData.phone}<br>
                ${poiData.website}
            `);
            delete markers[oldCoordinates.oldLat + "," + oldCoordinates.oldLng];
            markers[poiData.latitude + "," + poiData.longitude] = marker;

            $("#latitude").val(poiData.latitude);
            $("#longitude").val(poiData.longitude);
            $("#namalokasi").val(poiData.namalokasi);
            $("#deskripsi").val(poiData.deskripsi);
            $("#alamat").val(poiData.alamat);
            $("#kategori").val(poiData.kategori);
            $("#phone").val(poiData.phone);
            $("#website").val(poiData.website);
            $("#poiId").val(JSON.stringify({ oldLat: poiData.latitude, oldLng: poiData.longitude }));
          }
        }
      },
    });
  });

  $("#deletePoiBtn").on("click", function () {
    const latLng = markerToDelete.getLatLng();
    $.ajax({
      url: "delete.php",
      method: "POST",
      data: {
        latitude: latLng.lat,
        longitude: latLng.lng,
      },
      success: function () {
        map.removeLayer(markerToDelete);
        $("#confirmDeleteModal").modal("hide");
      },
    });
  });
});
