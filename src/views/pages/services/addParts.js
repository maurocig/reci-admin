      let inputCount = 2; // Keep track of the number of inputs

      const addPartRowButton = document.getElementById('addPartRowButton');
      const inputContainer = document.getElementById('partsContainer');

      addPartRowButton.addEventListener('click', () => {
				console.log('clicked add row button')
        // Create two new inputs
        const newPartNumberInput = document.createElement('input');
        newPartNumberInput.type = 'number';
        newPartNumberInput.id = `partNumber${inputCount}`;
        newPartNumberInput.name = `partNumber${inputCount}`;
				newPartNumberInput.placeholder = `Nº de Repuesto ${inputCount}`
				newPartNumberInput.disabled = true;
        const newPartNameInput = document.createElement('input');
        newPartNameInput.type = 'text';
        newPartNameInput.id = `partName${inputCount}`;
        newPartNameInput.name = `partName${inputCount}`;
				newPartNameInput.placeholder = `Nombre de Repuesto ${inputCount}`

        // Add the inputs to the container
        inputContainer.appendChild(newPartNumberInput);
        inputContainer.appendChild(newPartNameInput);

        inputCount++; // Increment the input count
      });

      // const partsForm = document.getElementById('partsForm');