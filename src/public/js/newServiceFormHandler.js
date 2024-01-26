// ADD PARTS
let partsInputCount = 2; // Keep track of the number of inputs
const addPartRowButton = document.getElementById('addPartRowButton');
const partsInputsContainer = document.getElementById('partsInputsContainer');
const parts = [];
let partCount = 0;

let partNumberInputs = [];
let partNameInputs = [];
let partQtyInputs = [];

let fixNameInputs = [];

addPartRowButton.addEventListener('click', () => {
  // Get all the input elements
  const partNumberInputs = document.querySelectorAll('[id^="partNumber"]');
  const partNameInputs = document.querySelectorAll('[id^="partName"]'); // Create new row of inputs
  const partQtyInputs = document.querySelectorAll('[id^="partQty"]');

  const partsRow = document.createElement('div');
  partsRow.classList.add('parts-row');
  partsRow.innerHTML = `
					<div class="item-number">#${partsInputCount}.</div>
					<input type="text" name="partNumber${partsInputCount}" id="partNumber${partsInputCount}" placeholder="Nº de Repuesto ${partsInputCount}" style="text-transform: uppercase; margin: 0 !important"/>
					<input type="text" name="partName${partsInputCount}" id="partName${partsInputCount}" placeholder="Nombre de Repuesto ${partsInputCount}" style="text-transform: uppercase; margin: 0 !important"/>
						<input type="number" name="partQty1" id="partQty1" placeholder="Cant." style="max-width: 70px; margin: 0 !important;">
		`;
  if (
    partNumberInputs[partNumberInputs.length - 1].value &&
    partNameInputs[partNameInputs.length - 1].value &&
    partQtyInputs[partQtyInputs.length - 1].value
  ) {
    partsInputsContainer.appendChild(partsRow); // Add the row to the container
    partsInputCount++; // Increment the input count
  }
});

// ADD FIXES
const fixesContainer = document.getElementById('fixesInputsContainer');
const addFixRowButton = document.getElementById('addFixesRowButton');
let fixInputCount = 1;
let fixCount = 2;
const fixes = []; // Initialize the parts array

addFixRowButton.addEventListener('click', () => {
  // Get all the input elements
  fixNameInputs = document.querySelectorAll('[id^="fixInput"]');

  if (fixNameInputs[fixNameInputs.length - 1].value) {
    const fixesRow = document.createElement('div');
    fixesRow.classList.add('fixes-row');
    fixesRow.innerHTML = `
					<div class="item-number"> #${fixCount}. </div>
					<input type="text" name="fixInput${fixInputCount}" id="fixInput${fixInputCount}" placeholder="Descripción ${fixCount}" style="text-transform: uppercase; margin: 0 !important" autofocus />
`;
    fixInputCount++;
    fixCount++;
    fixesContainer.appendChild(fixesRow);
  }
});

// Submit handler
const form = document.querySelector('#submitServiceForm');
const submitButton = document.getElementById('submit-button');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitButton.disabled = true;

  const clientId = document.getElementById('clientId');
  const refUnitId = document.getElementById('refUnitId');
  const orderNumberInput = document.getElementById('orderNumberInput');
  const serviceDateInput = document.getElementById('serviceDateInput');
  const hoursInput = document.getElementById('hoursInput');
  const handWorkHoursInput = document.getElementById('handWorkHoursInput');
  const ticketInput = document.getElementById('ticketInput');
  const isInWarrantyInput = document.getElementById('isInWarrantyInput');
  const observationsInput = document.getElementById('observationsInput');

  const service = {
    client: clientId.value,
    refUnit: refUnitId.value,
    orderNumber: +orderNumberInput.value,
    serviceDate: serviceDateInput.value,
    hours: +hoursInput.value,
    handWorkHours: parseFloat(handWorkHoursInput.value),
    ticket: ticketInput.value,
    isInWarranty: isInWarrantyInput.value === 'true',
    observations: observationsInput.value,
    parts,
    fixes,
  };

  partNumberInputs = document.querySelectorAll('[id^="partNumber"]');
  partNameInputs = document.querySelectorAll('[id^="partName"]');
  partQtyInputs = document.querySelectorAll('[id^="partQty"]');
  fixNameInputs = document.querySelectorAll('[id^="fixInput"]');

  // Iterate through the FIXES input elements and create an object for each one
  for (let i = 0; i < fixNameInputs.length; i++) {
    const fixName = fixNameInputs[i].value.toUpperCase();
    if (fixName && !fixes[i]) {
      fixes.push({ fixName });
    }
  }

  // Iterate through PARTS input elements and create an object for each one
  for (let i = 0; i < partNumberInputs.length; i++) {
    const partNumber = partNumberInputs[i].value;
    const partName = partNameInputs[i].value.toUpperCase();
    const partQty = partQtyInputs[i].value;
    // partNameInputs[i].value = partName;
    if (partNumber && partName && partQty && !parts[i]) {
      parts.push({ partNumber, partName, partQty });
    }
  }

  console.log(service);

  saveService(service).then((response) => {
    submitButton.disabled = false;
    submitButton.classList.remove('disabled-select');

    Swal.fire({
      title: 'El servicio se creó correctamente.',
      icon: 'success',
      iconColor: '#059669',
      confirmButtonColor: '#059669',
      confirmButtonText: 'Ver servicio',
    })
      .then((result) => {
        if (result.value) {
          window.location = `/servicios/${response}`;
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al crear servicio',
          text: 'Verificá que el número de orden no esté duplicado',
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
});

async function saveService(data) {
  try {
    const response = await fetch('/servicios', {
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
