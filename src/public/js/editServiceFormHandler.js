const form = document.getElementById('form-edit-service');

const serviceId = document.getElementById('serviceId').value;

const clientId = document.getElementById('clientId');
const refUnitId = document.getElementById('refUnitId');
const orderNumberInput = document.getElementById('orderNumberInput');
const serviceDateInput = document.getElementById('serviceDateInput');
const hoursInput = document.getElementById('hoursInput');
const handWorkHoursInput = document.getElementById('handWorkHoursInput');
const ticketInput = document.getElementById('ticketInput');
const isInWarranty = document.getElementById('isInWarrantyInput');
const observationsInput = document.getElementById('observationsInput');
const technicianInput = document.getElementById('technicianInput');
const submitButton = document.getElementById('submit-button');

const parts = [];
const fixes = [];

const partNumberInputs = document.querySelectorAll('[id^="partNumber"]');
const partNameInputs = document.querySelectorAll('[id^="partName"]');
const partQtyInputs = document.querySelectorAll('[id^="partQty"]');
const fixNameInputs = document.querySelectorAll('[id^="fixInput"]');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.classList.add('disabled-select');

  // Iterate through the input elements and create an object for each one
  for (let i = 0; i < partNumberInputs.length; i++) {
    const partNumber = partNumberInputs[i].value;
    const partName = partNameInputs[i].value.toUpperCase();
    const partQty = partQtyInputs[i].value;

    if (partNumber && partName && partQty) {
      parts.push({ partNumber, partName, partQty });
    }
  }

  // Iterate through the input elements and create an object for each one
  for (let i = 0; i < fixNameInputs.length; i++) {
    const fixName = fixNameInputs[i].value.toUpperCase();

    if (fixName) {
      fixes.push({ fixName });
    }
  }

  const service = {
    client: clientId.value,
    refUnit: refUnitId.value,
    orderNumber: +orderNumberInput.value,
    serviceDate: serviceDateInput.value,
    hours: +hoursInput.value,
    handWorkHours: parseFloat(handWorkHoursInput.value),
    ticket: ticketInput.value,
    isInWarranty: isInWarranty.value === 'true',
    observations: observationsInput.value,
    technician: technicianInput.value,
    parts,
    fixes,
  };

  updateService(service).then((response) => {
    Swal.fire({
      title: 'El servicio se editó correctamente.',
      icon: 'success',
      iconColor: '#059669',
      confirmButtonColor: '#059669',
      confirmButtonText: 'Ver servicio',
    })
      .then((result) => {
        if (result.value) {
          window.location = `/servicios/${serviceId}`;
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al editar servicio',
          text: 'Verificá la conexión a internet. Si el problema persiste, comunicate con el administrador.',
          icon: 'error',
          iconColor: '#EF4444',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.value) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled-select');
          }
        });
      });
  });

  // Send Form
});

async function updateService(data) {
  try {
    const response = await fetch(`/servicios/${serviceId}?_method=PUT`, {
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
