// ADD PARTS
let partsInputCount = 2; // Keep track of the number of inputs
const addPartRowButton = document.getElementById('addPartRowButton');
const partsInputsContainer = document.getElementById('partsInputsContainer');
const parts = [];
let partCount = 0;

addPartRowButton.addEventListener('click', () => {
  // Get all the input elements
  const partNumberInputs = document.querySelectorAll('[id^="partNumber"]');
  const partNameInputs = document.querySelectorAll('[id^="partName"]');

  // Create new row of inputs
  const partsRow = document.createElement('div');
  partsRow.classList.add('parts-row');
  partsRow.innerHTML = `
					<div class="item-number">#${partsInputCount}.</div>
					<input type="number" name="partNumber${partsInputCount}" id="partNumber${partsInputCount}" placeholder="Nº de Repuesto ${partsInputCount}" />
					<input type="text" name="partName${partsInputCount}" id="partName${partsInputCount}" placeholder="Nombre de Repuesto ${partsInputCount}" style="text-transform: uppercase;"/>
		`;
  if (
    partNumberInputs[partNumberInputs.length - 1].value &&
    partNameInputs[partNameInputs.length - 1].value
  ) {
    partsInputsContainer.appendChild(partsRow); // Add the row to the container
    partsInputCount++; // Increment the input count
  }

  // Iterate through the input elements and create an object for each one
  for (let i = 0; i < partNumberInputs.length; i++) {
    const partNumber = partNumberInputs[i].value;
    const partName = partNameInputs[i].value.toUpperCase();
    // partNameInputs[i].value = partName;
    if (partNumber && partName && !parts[i]) {
      parts.push({ partNumber, partName });
      partNameInputs[i].readOnly = true;
      partNumberInputs[i].readOnly = true;
    }
  }
  console.log(parts); // Output the parts array to the console
});

// ADD FIXES
const fixesContainer = document.getElementById('fixesInputsContainer');
const addFixRowButton = document.getElementById('addFixesRowButton');
let fixInputCount = 1;
const fixes = []; // Initialize the parts array

addFixRowButton.addEventListener('click', () => {
  // Get all the input elements
  const fixNameInputs = document.querySelectorAll('[id^="fixInput"]');

  if (fixNameInputs[fixNameInputs.length - 1].value) {
    const fixesRow = document.createElement('div');
    fixesRow.classList.add('fixes-row');
    fixesRow.innerHTML = `
					<div class="item-number"> #${fixInputCount}. </div>
					<input type="text" name="fixInput${fixInputCount}" id="fixInput${fixInputCount}" placeholder="Descripción ${fixInputCount}" style="text-transform: uppercase" autofocus />
`;
    fixesContainer.appendChild(fixesRow);
  }

  // Iterate through the input elements and create an object for each one
  for (let i = 0; i < fixNameInputs.length; i++) {
    const fixName = fixNameInputs[i].value.toUpperCase();
    if (fixName && !fixes[i]) {
      fixes.push({ fixName });
      fixNameInputs[i].readOnly = true;
    }
  }
  console.log(fixes); // Output the fixes array to the console
});

// Submit handler
const form = document.querySelector('form');
// const refUnitId = document.querySelector('#refUnitId');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const refUnitId = document.getElementById('refUnitId');
  const clientId = document.getElementById('clientId');
  const orderNumberInput = document.getElementById('orderNumberInput');
  const serviceDateInput = document.getElementById('serviceDateInput');
  const hoursInput = document.getElementById('hoursInput');

  const service = {
    refUnit: refUnitId.value,
    client: clientId.value,
    orderNumber: +orderNumberInput.value,
    serviceDate: serviceDateInput.value,
    hours: +hoursInput.value,
    parts,
    fixes,
  };

  const formData = new FormData();
  formData.append('service', JSON.stringify(service));
  console.log(formData);

  // console.log(formData);

  // Send Form
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/servicios', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    // handle the response
    console.log('server response: ' + xhr.response);
    if (xhr.response) {
      Swal.fire('El servicio fue guardado', 'success');
      console.log('load end');
      console.log(xhr.response);
    } else {
      Swal.fire('Hubo un error ');
    }
  };
  xhr.send(JSON.stringify(service));
});
