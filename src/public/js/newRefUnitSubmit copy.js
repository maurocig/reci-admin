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

// handle submit
const form = document.querySelector('#form-new-refunit');
const submitButton = document.querySelector('#submit-button');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.classList.add('disabled-select');

  const refUnit = {
    serialNumber: serialNumberInput.value,
    model: modelInput.value,
    client: clientIdInput.value,
    plate: plateInput.value,
    soldByReci: soldByReciSelect.value === 'true',
    warrantyDate: warrantyDateInput.value,
  };

  if (plateInput.value) {
    const response = saveRefUnit(refUnit)
      .then((response) => {
        Swal.fire({
          title: 'El equipo se agregó correctamente',
          icon: 'success',
          iconColor: '#F4B860',
          showCancelButton: false,
          confirmButtonText: 'Ver equipo',
        }).then((result) => {
          if (result.value) {
            window.location.href = `/equipos/${response}`;
          }
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al agregar equipo',
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
  } else {
    Swal.fire({
      title: 'Estás por ingresar un equipo sin matrícula',
      text: 'Podés encontrar la unidad en la sección "Equipos > Filtrar > Sin matricular"',
      icon: 'warning',
      iconColor: '#F4B860',
      showCancelButton: true,
      confirmButtonColor: '#F4B860',
      confirmButtonText: 'Ingresar equipo sin matrícula',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        saveRefUnit(refUnit)
          .then((response) => {
            Swal.fire({
              title: 'El equipo se agregó correctamente',
              icon: 'success',
              iconColor: '#F4B860',
              showCancelButton: false,
              confirmButtonText: 'Ir al equipo',
            }).then((result) => {
              if (result.value) {
                window.location.href = `/equipos/${response}`;
              }
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'Error al agregar equipo',
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

async function saveRefUnit(data) {
  try {
    const response = await fetch('/equipos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.log(error);
    alert('Error al crear equipo');
    return error;
  }
}
