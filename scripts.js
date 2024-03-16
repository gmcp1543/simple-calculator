const inputDisplayer = document.getElementById("input-displayer");
const subDisplayer = document.getElementById("sub-displayer");
const numberFormatter = new Intl.NumberFormat();
let operationDone = false;
let action = undefined;
let firstInput = undefined;
let secondInput = undefined;
let isDecimal = false;

function setDisplayerValue(value) {
    inputDisplayer.innerText = value;
}

function getDisplayerValue() {
    return inputDisplayer.innerText;
}

function setSubDisplayerValue(value) {
    subDisplayer.innerText = value;
}

function getSubDisplayerValue() {
    return subDisplayer.innerText;
}

function performOperation () {
    let result = undefined;
    
    switch (action) {
        case "+":
            result = firstInput + secondInput;
            break;
        case "-":
            result = firstInput - secondInput;
            break;
        case "x":
            result = firstInput * secondInput;
            break;
        case "/":
            if (secondInput < 1) {
                throw new Error("No divisible");
            }

            result = firstInput / secondInput;
            break;
    }

    return result;
}


document.addEventListener("keydown", (event) => {
    const pressedKey = event.key;
    const currentDisplayedValue = getDisplayerValue();
    let newValueToBeDisplay = undefined;

    /*if (pressedKey != "Enter" && ((firstInput.toString().length == 16 && action == undefined) || (secondInput.toString().length == 16 && action != undefined))) {
        //TODO: Fix max input
        return;
    }*/

    switch (pressedKey) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (!action || operationDone) {
                firstInput = (isDecimal) ? parseFloat(firstInput.toString() + "." + pressedKey) : 
                    (!firstInput) ? parseFloat(pressedKey) : parseFloat(firstInput.toString() + pressedKey);
                newValueToBeDisplay = firstInput.toString();

                if (operationDone) {
                    operationDone = false;
                    setSubDisplayerValue("");
                }
            } else {
                secondInput = (isDecimal) ? parseFloat(secondInput.toString() + "." + pressedKey) : 
                    (!secondInput) ? parseFloat(pressedKey) : parseFloat(secondInput.toString() + pressedKey);
                newValueToBeDisplay = secondInput.toString();
            }

            newValueToBeDisplay = numberFormatter.format(newValueToBeDisplay); //Format displayed numbers with comma as a separator

            setDisplayerValue(newValueToBeDisplay);

            break;
        case "+":
        case "-":
        case "*":
        case "/":
            if (!firstInput) return;

            isDecimal = false;

            if (!action) {
                action = (pressedKey == "*") ? "x" : pressedKey;

                setSubDisplayerValue(firstInput.toString() + " " + action);
            } else {
                if (secondInput == undefined) return;

                let result;

                try {
                    result = performOperation();
                    setDisplayerValue(numberFormatter.format(result));
                } catch (e) {
                    setDisplayerValue(e.message);
                } finally {
                    action = (pressedKey == "*") ? "x" : pressedKey;
                    firstInput = result;
                    secondInput = undefined;
                    setSubDisplayerValue(firstInput.toString() + " " + action);
                }
                
            }
            break;
        case "Enter":
            if (firstInput == undefined || secondInput == undefined) return;

            let result;

            try {
                result = performOperation();

                setSubDisplayerValue(firstInput.toString() + " " + action + " " + secondInput.toString() + " =");
                setDisplayerValue(numberFormatter.format(result));
            } catch (e) {
                setSubDisplayerValue("");
                setDisplayerValue(e.message);
            } finally {
                operationDone = true;
                action = undefined;
                firstInput = undefined;
                secondInput = undefined;
            }

            break;
        case "Backspace":
            if (operationDone) {
                setSubDisplayerValue("");
                setDisplayerValue("0");
            } else if (firstInput && !action) {
                let tempInput = firstInput.toString().split("");
                tempInput.pop();
                tempInput = tempInput.toString().replaceAll(",", "");
                firstInput = parseInt(tempInput);

                setDisplayerValue(numberFormatter.format(tempInput));
            } else if (secondInput && action) {
                let tempInput = secondInput.toString().split("");
                tempInput.pop();
                tempInput = tempInput.toString().replaceAll(",", "");
                secondInput = parseInt(tempInput);

                setDisplayerValue(numberFormatter.format(tempInput));
            }
            break;
        case ".":
            if (isDecimal) return;

            isDecimal = true;

            setSubDisplayerValue("");
            setDisplayerValue((!firstInput || firstInput == 0) ? "0." : firstInput.toString() + ".");

            break;
        default:
            return;
    }

    return;
    if (((firstInput.toString().length) == 14 && action == undefined) || ((secondInput.toString().length) == 14 && action != undefined)) {
        inputDisplayer.style.fontSize = "2.3rem";
    } else if (currentDisplayedValue.length < 11 && inputDisplayer.style.fontSize == "2.7rem") {
        inputDisplayer.style.fontSize = "3rem";
    }
    
});