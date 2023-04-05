const deleteButton = document.querySelector('.button-danger');

function deleteService(id) {
  console.log(`id: ${id}`);
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
    console.log(result.value);
    if (result.value) {
      // send a DELETE request to the server
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', '/servicios/' + id, true);
      xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
      xhr.onloadend = function () {
        // handle the response
        Swal.fire('El servicio fue borrado.', 'Click en guardar para restaurarlo.');
      };
      xhr.send();
    }
  });
}
