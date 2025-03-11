const fileInput = document.getElementById('file-input');
const fileInputLabel = document.getElementById('file-input-label');
const serviceId = document.getElementById('service-id').value;
const formElem = document.getElementById('attachments-form');
const submitButton = document.getElementById('submit-button');

fileInput.addEventListener('change', function () {
  if (fileInput.files && fileInput.files.length > 0) {
    let fileName = '';
    fileInputLabel.classList.remove('text-emerald-400');
    fileInputLabel.classList.add('bg-emerald-400', 'text-slate-800');
    submitButton.disabled = false;
    submitButton.classList.remove('bg-gray-500', 'text-gray-600');
    submitButton.classList.add('bg-emerald-400', 'text-slate-800');
    if (fileInput.files.length === 1) {
      fileName = fileInput.files[0].name;
    } else {
      fileName = fileInput.files.length + ' archivos seleccionados';
    }
    fileInputLabel.innerHTML = `<span class='font-semibold truncate max-w-[200px]'>${fileName}</span>`;
  } else {
    fileInputLabel = 'Seleccionar archivos';
  }
});

formElem.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.classList.remove('bg-emerald-400', 'text-slate-800');
  submitButton.classList.add('bg-gray-400', 'text-gray-600');
  submitButton.textContent = 'Subiendo...';
  submitButton.disabled = true;

  const editButton = document.getElementById('editButton');
  editButton.classList.add = 'bg-gray-500';
  editButton.disabled = true;

  await fetch('/upload', {
    method: 'POST',
    body: new FormData(formElem),
  })
    .then(async (response) => {
      console.log('Successfully uploaded to drive');
      submitButton.textContent = 'Listo!';

      const { serviceId } = await response.json();
      Swal.fire('Archivo subido!', 'El archivo ha sido subido a Google Drive.', 'success', {
        confirmButtonText: 'Ok',
        confirmButtonColor: '#10B981',
        iconColor: '#10B981',
        onclick: () => {
          window.location.href = `/servicios/${serviceId}`;
        },
        onclose: () => {
          window.location.href = `/servicios/${serviceId}`;
        },
      }).then(() => {
        window.location.href = `/servicios/${serviceId}`;
      });
    })
    .catch((error) => {
      console.log('was not uploaded' + error);
      console.error(error);
      alert('Hubo un error al subir el archivo: ', error);
    });
});

// Delete file
const deleteButtons = document.querySelectorAll('[id^="delete-file-"]');
deleteButtons.forEach((button) => {
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.tagName.toLowerCase() === 'i') {
      fileId = e.target.parentElement.id.substring(12);
    } else {
      fileId = e.target.id.substring(12);
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El archivo será borrado de forma permanente',
      icon: 'warning',
      iconColor: '#D33',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Sí, borrarlo!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire('Borrando el archivo de Drive...', {
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        await fetch(`/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId,
            serviceId,
          }),
        })
          .then(async (response) => {
            Swal.fire(
              'Archivo eliminado',
              'El archivo ha sido eliminado de Google Drive.',
              'success',
              {
                confirmButtonText: 'Ok',
                confirmButtonColor: '#10B981',
                iconColor: '#10B981',
                onClose: () => {
                  window.location.href = `/servicios/${serviceId}`;
                },
              }
            ).then(() => {
              window.location.href = `/servicios/${serviceId}`;
            });
          })
          .catch((error) => {
            console.log('was not deleted' + error);
            console.error(error);
            alert('Hubo un error al borrar el archivo: ', error);
          });
      }
    });
  });
});
