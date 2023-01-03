

	// ADD PARTS
	let partsInputCount = 2; // Keep track of the number of inputs
	const addPartRowButton = document.getElementById('addPartRowButton');
	const partsInputsContainer = document.getElementById('partsInputsContainer');
	const parts = [];
	let partCount = 0;


	addPartRowButton.addEventListener('click', () => {

		// Get all the input elements
		const partNumberInputs =
			document.querySelectorAll('[id^="partNumber"]');
		const partNameInputs = document.querySelectorAll('[id^="partName"]');

		// Create new row of inputs
		const partsRow = document.createElement('div')
		partsRow.classList.add('parts-row')
		partsRow.innerHTML = `
					<div class="item-number">#${partsInputCount}.</div>
					<input type="number" name="partNumber${partsInputCount}" id="partNumber${partsInputCount}" placeholder="Nº de Repuesto ${partsInputCount}" />
					<input type="text" name="partName${partsInputCount}" id="partName${partsInputCount}" placeholder="Nombre de Repuesto ${partsInputCount}" style="text-transform: uppercase;"/>
		`
		if (partNumberInputs[partCount].value && partNameInputs[partCount].value) {
			partsInputsContainer.appendChild(partsRow); // Add the row to the container
			partsInputCount++; // Increment the input count
			partCount++;
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
	let fixCount = 0;
	const fixes = []; // Initialize the parts array

	addFixRowButton.addEventListener('click', () => {
		// Get all the input elements
		const fixNameInputs =
			document.querySelectorAll('[id^="fixInput"]');

		const fixesRow = document.createElement('div')
		fixesRow.classList.add('fixes-row')
		fixesRow.innerHTML = `
					<div class="item-number"> #${fixInputCount}. </div>
					<input type="text" name="fixInput${fixInputCount}" id="fixInput${fixInputCount}" placeholder="Descripción ${fixInputCount}" style="text-transform: uppercase" />
`
		fixesContainer.appendChild(fixesRow);
		fixInputCount++;

		// Iterate through the input elements and create an object for each one
		for (let i = 0; i < fixNameInputs.length; i++) {
			const fixName = fixNameInputs[i].value.toUpperCase();
			if (fixName && !fixes[i]) {
				fixes.push({ fixName });
				fixNameInputs[i].readOnly = true;
			}
		}
		console.log(fixes); // Output the parts array to the console
	})

