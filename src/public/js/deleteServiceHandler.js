const deleteButton = document.querySelector('.button-danger');

function deleteService(id) {
  Swal.fire({
    title: 'Se borrará el servicio',
    text: 'Esta acción no se puede revertir.',
    icon: 'warning',
    iconColor: 'red',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.value) {
      // send a DELETE request to the server
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', '/servicios/' + id, true);
      xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
      xhr.onloadend = function () {
        // handle the response
        Swal.fire({
          title: 'El servicio fue borrado.',
          iconColor: '#059669',
          icon: 'success',
          confirmButtonText: 'Volver al equipo',
          confirmButtonColor: '#059669',
        }).then((result) => {
          if (result.value) {
            window.location.href = `/equipos/${refUnitId.value}`;
          }
        });
      };
      xhr.send();
    }
  });
}
