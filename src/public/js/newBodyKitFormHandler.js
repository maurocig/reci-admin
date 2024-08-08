const clientIdInput = document.getElementById('client-id');
const serialNumberInput = document.getElementById('serial-input');
const plateInput = document.getElementById('plate-input');
const soldByReciSelect = document.getElementById('soldByReci-select');
const providerSelect = document.getElementById('provider-select');
const modelSelect = document.getElementById('model-select');
const dimensionsLengthInput = document.getElementById('dimensions-length-input');
const dimensionsWidthInput = document.getElementById('dimensions-width-input');
const dimensionsHeightInput = document.getElementById('dimensions-height-input');
const statusSelect = document.getElementById('status-select');
const chassisInput = document.getElementById('chassis-input');
const deliveryEstimateInput = document.getElementById('deliveryEstimate-input');
const truckBrandSelect = document.getElementById('truckBrand-select');
const truckModelInput = document.getElementById('truckModel-input');
const warrantyDateInput = document.getElementById('warranty-input');
const wheelbaseInput = document.getElementById('wheelbase-input');
const observationsInput = document.getElementById('observations-input');

soldByReciSelect.addEventListener('change', (e) => {
  soldByReci = soldByReciSelect.value === 'true';
  if (soldByReci) {
    warrantyDateInput.required = true;
    warrantyDateInput.disabled = false;
    warrantyDateInput.classList.remove('disabled-select');
    deliveryEstimateInput.disabled = false;
    deliveryEstimateInput.classList.remove('disabled-select');
    statusSelect.required = true;
    statusSelect.disabled = false;
    statusSelect.classList.remove('disabled-select');
  } else {
    warrantyDateInput.value = null;
    warrantyDateInput.required = false;
    warrantyDateInput.disabled = true;
    warrantyDateInput.classList.add('disabled-select');
    deliveryEstimateInput.value = null;
    deliveryEstimateInput.disabled = true;
    deliveryEstimateInput.classList.add('disabled-select');
    statusSelect.required = false;
    statusSelect.value = '';
    statusSelect.disabled = true;
    statusSelect.classList.add('disabled-select');
  }
});

// disable fields when status is 'entregado'
statusSelect.addEventListener('change', function () {
  const status = statusSelect.value;
  if (status === 'Entregada') {
    deliveryEstimateInput.value = null;
    deliveryEstimateInput.disabled = true;
    deliveryEstimateInput.classList.add('disabled-select');

    warrantyDateInput.value = null;
    warrantyDateInput.disabled = false;
    warrantyDateInput.required = true;
    warrantyDateInput.classList.remove('disabled-select');
  } else {
    deliveryEstimateInput.value = null;
    deliveryEstimateInput.disabled = false;
    deliveryEstimateInput.classList.remove('disabled-select');

    warrantyDateInput.value = null;
    warrantyDateInput.disabled = true;
    warrantyDateInput.classList.add('disabled-select');
    warrantyDateInput.required = false;
  }
});

// estimated delivery date input only allows future dates
const todayString = new Date().toISOString().split('T')[0];
deliveryEstimateInput.min = todayString;

// handle submit
const form = document.getElementById('form-new-bodykit');
const submitButton = document.getElementById('submit-button');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const bodyKit = {
    client: clientIdInput.value,
    serialNumber: serialNumberInput.value,
    plate: plateInput.value,
    provider: providerSelect.value,
    model: modelSelect.value,
    soldByReci: soldByReciSelect.value === 'true',
    warrantyDate: warrantyDateInput.value,
    chassis: chassisInput.value,
    status: statusSelect.value,
    // availability: availabilitySelect.value,
    deliveryEstimate: deliveryEstimateInput.value,
    truckBrand: truckBrandSelect.value,
    truckModel: truckModelInput.value,
    wheelbase: wheelbaseInput.value,
    dimensions: {
      length: dimensionsLengthInput.value,
      width: dimensionsWidthInput.value,
      height: dimensionsHeightInput.value,
    },
    observations: observationsInput.value,
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
