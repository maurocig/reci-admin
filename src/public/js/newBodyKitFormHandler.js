// toggle warranty date disable on soldByReci selector change.
const soldByReciSelect = document.querySelector('#soldByReciSelect');
const warrantyDateInput = document.querySelector('#warranty-date');

soldByReciSelect.addEventListener('change', (e) => {
  soldByReci = soldByReciSelect.value === 'true';
  if (soldByReci) {
    warrantyDateInput.required = true;
    warrantyDateInput.disabled = false;
    warrantyDateInput.classList.remove('disabled-select');
  } else {
    warrantyDateInput.required = false;
    warrantyDateInput.disabled = true;
    warrantyDateInput.classList.add('disabled-select');
  }
});

const plateInput = document.querySelector('#plate-number');
const serialNumberInput = document.querySelector('#serial-number');
const modelInput = document.querySelector('#select-model');
const clientIdInput = document.querySelector('#client-id');
const chassisInput = document.querySelector('#chassis-input');

// handle submit
const form = document.querySelector('#form-new-bodykit');
const submitButton = document.querySelector('#submit-button');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const bodyKit = {
    serialNumber: serialNumberInput.value,
    model: modelInput.value,
    client: clientIdInput.value,
    plate: plateInput.value,
    soldByReci: soldByReciSelect.value === 'true',
    warrantyDate: warrantyDateInput.value,
    chassis: chassisInput.value,
  };

  if (plateInput.value) {
    submitButton.disabled = true;
    submitButton.classList.add('disabled-select');
    const response = saveBodyKit(bodyKit)
      .then((response) => {
        Swal.fire({
          title: 'La carrocería se agregó correctamente',
          icon: 'success',
          iconColor: '#059669',
          confirmButtonColor: '#059669',
          showCancelButton: true,
          cancelButtonText: 'Volver al cliente',
          confirmButtonText: 'Ver carrocería',
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            window.location.href = `/carrocerias/${response}`;
          } else {
            window.location.href = `/clientes/${bodyKit.client}`;
          }
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al agregar carrocería',
          text: 'Verificá que el número de serie o matrícula no estén duplicados.',
          icon: 'error',
          iconColor: '#F4B860',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.value) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled-select');
          }
        });
      });
  } else {
    Swal.fire({
      title: 'Estás por ingresar una carrocería sin matrícula',
      text: 'Podés encontrar la unidad en la sección \n Carrocerías > Filtrar > Sin matricular',
      icon: 'warning',
      iconColor: '#F4B860',
      showCancelButton: true,
      confirmButtonColor: '#F4B860',
      confirmButtonText: 'Ingresar carrocería sin matrícula',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        submitButton.disabled = true;
        submitButton.classList.add('disabled-select');
        saveBodyKit(bodyKit)
          .then((response) => {
            Swal.fire({
              title: 'La carrocería se agregó correctamente',
              icon: 'success',
              iconColor: '#059669',
              confirmButtonColor: '#059669',
              showCancelButton: true,
              cancelButtonText: 'Volver al cliente',
              confirmButtonText: 'Ver carrocería',
              reverseButtons: true,
            }).then((result) => {
              if (result.value) {
                window.location.href = `/carrocerias/${response}`;
              } else {
                window.location.href = `/clientes/${bodyKit.client}`;
              }
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'Error al agregar carrocería',
              text: 'Verificá que el número de serie o matrícula no estén duplicados',
              icon: 'error',
              iconColor: '#F4B860',
              showCancelButton: false,
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.value) {
                submitButton.disabled = false;
                submitButton.classList.remove('disabled-select');
              }
            });
          });
      }
    });
  }
});

async function saveBodyKit(data) {
  try {
    const response = await fetch('/carrocerias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
}
