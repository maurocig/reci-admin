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
      xhr.open('DELETE', '/servicios-carrocerias/' + id, true);
      xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
      xhr.onloadend = function () {
        // handle the response
        console.log(xhr);
        if (xhr.status === 200) {
          Swal.fire({
            title: 'El servicio fue borrado.',
            iconColor: '#059669',
            icon: 'success',
            confirmButtonText: 'Volver a carrocería',
            confirmButtonColor: '#059669',
          }).then((result) => {
            if (result.value) {
              window.location.href = `/carrocerias/${bodyKitId.value}`;
            }
          });
        } else {
          Swal.fire({
            title: 'Hubo un error al borrar el servicio.',
            iconColor: 'red',
            icon: 'error',
            confirmButtonText: 'Volver a la carrocería',
            confirmButtonColor: 'red',
          }).then((result) => {
            if (result.value) {
              window.location.href = `/carrocerias/${bodyKitId.value}`;
            }
          });
        }
      };
      xhr.send();
    }
  });
}
