let previousValue = ""; //represents the value that was entered before the current value, which is used for performing calculations when an operator is clicked
let currentValue = ""; //represents the value that is currently being entered by the user
let currentOperator = ""; //represents the operator that is currently selected by the user, which is used for performing calculations when an operator button is clicked
let isCalculatorOn = false; //represents whether the calculator is currently on or off, which can be used to enable or disable certain functionalities based on the state of the calculator
let isOperatorClicked = false; //represents whether an operator button has been clicked
let isCalculatorStuck = false; //represents whether the calculator is stuck or not(e.g., due to a bug or an error), which can be used to prevent further interactions until the issue is resolved
let dotOperatorClicked = false; //represents whether the decimal point operator has been clicked, which can be used to prevent multiple decimal points from being entered in a number
let isEqualClicked = false; //represents whether the equal button has been clicked, which can be used to determine whether to perform a calculation or just display the current value when the equal button is clicked without a previous value
// memory variables
let memoryValue = 0; //represents the value stored in memory, which can be used for performing memory-related operations such as M+, M-, and MR
let isMemorySet = false; //represents whether a value has been stored in memory or not, which can be used to enable or disable memory-related buttons based on the state of memory
let mrcClickCount = 0; //represents the number of times the MRC button has been clicked, which can be used to determine whether to recall the memory value or clear it based on the click count

//gt variables
let grandTotal = 0; //represents the cumulative total of calculations performed, which can be used for displaying the overall result of multiple calculations or for performing additional operations based on the grand total
let gtClicks = 0; //represents the number of times the GT button has been clicked, which can be used to determine whether to display the grand total or perform additional operations based on the click count

//dom elements
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const display = document.getElementById("display-value");
const operator_value = document.getElementById("display-operator");

// working of numbers when clicked
numbers.forEach((number) => {
  number.addEventListener("click", () => {
    let numberValue = number.innerText; // when a number button is clicked, the value of the button is stored in the variable numberValue for further processing
    if (!isCalculatorOn || isCalculatorStuck) {
      return; // if the calculator is off or stuck, do nothing when a number button is clicked
    }
    if (isEqualClicked) {
      currentValue = "0";
    }
    if (currentValue == "") {
      currentValue = "0";
    }
    // situation when the current value is "0" and a number button is clicked
    if (currentValue === "0") {
      // if the current value is "0" and a non-zero number button is clicked, the current value is updated to the value of the clicked button. However, if the clicked button is "0", "00", or "000", the current value remains unchanged to prevent leading zeros in the display
      if (numberValue == "0" || numberValue == "00" || numberValue == "000") {
        return;
      }
      // if the current value is "0" and the decimal point button is clicked, the decimal point is added to the current value, allowing for decimal input while preventing leading zeros . also further decimal clicks avoided
      if (numberValue == "." && !dotOperatorClicked) {
        currentValue += numberValue;
        dotOperatorClicked = true;
      } else {
        currentValue = numberValue; // if the current value is "0" and a non-zero number button is clicked, the current value is updated to the value of the clicked button
      }
    } else {
      if (currentValue.length < 20) {
        // if the current value is not "0", the value of the clicked button is appended to the current value, allowing for multi-digit input. also further decimal clicks avoided
        if (numberValue == ".") {
          if (!dotOperatorClicked) {
            currentValue += numberValue;
            dotOperatorClicked = true;
          } else {
            return;
          }
        } else {
          currentValue += numberValue;
        }
      } else {
        return;
      }
    }
    display.innerText = currentValue; // update the display with the current value after processing the clicked number button
  });
});

// working of operators when clicked
operators.forEach((operator) => {
  operator.addEventListener("click", () => {
    // isOperatorClicked = true; // when an operator button is clicked, the state is set to true to indicate that an operator has been selected
    // currentOperator = operator.innerText; // the value of the clicked operator button is stored in the variable currentOperator for later use in calculations
    // operator_value.innerText = currentOperator; // the display for the operator is updated to show the currently selected operator

    // previousValue = currentValue; // when an operator is clicked, the current value is stored as the previous value for later use in calculations
    // currentValue = ""; // clear the display to allow for new number input after an operator has been clicked
    // isOperatorClicked = false; // reset the operator clicked state to allow for new number input
    // dotOperatorClicked = false; // reset the decimal point operator state to allow for new decimal input
    if (!isCalculatorOn || isCalculatorStuck) {
      return; // if the calculator is off or stuck, do nothing when an operator button is clicked
    }
    let operatorValue = operator.innerText; // when an operator button is clicked, the value of the button is stored in the variable operatorValue for further processing
    if (operatorValue == "X") {
      operatorValue = "*"; // replace "X" with "*" for multiplication to ensure correct evaluation in calculations
    }
    if (operatorValue == "÷") {
      operatorValue = "/"; // replace "÷" with "/" for division to ensure correct evaluation in calculations
    }
    if (currentValue != "") {
      if (previousValue == "") {
        previousValue = currentValue; // if there is no previous value, store the current value as the previous value when an operator is clicked
        currentValue = ""; // clear the current value to allow for new number input after an operator has been clicked
        currentOperator = operatorValue; // store the value of the clicked operator button in the variable currentOperator for later use in calculations
        isOperatorClicked = true; // set the operator clicked state to true to indicate that an operator has been selected
        dotOperatorClicked = false; // reset the decimal point operator state to allow for new decimal input
      } else {
        //if previous value not null and current value not null
        //perform calculation
        let result = calculate(previousValue, currentValue, currentOperator); // perform the calculation using the previous value, current value, and current operator, and store the result in the variable result
        showResult(result); // display the result of the calculation on the calculator display
        previousValue = result.toString(); // update the previous value to the result of the calculation for potential further calculations
        currentValue = ""; // clear the current value to allow for new number input after an operator has been clicked
        currentOperator = operatorValue; // update the current operator to the newly clicked operator for potential further calculations
        isOperatorClicked = true; // set the operator clicked state to true to indicate that an operator has been selected
      }
    } else {
      // if current value is null, just update the operator and wait for the next number input
      currentOperator = operatorValue; // store the value of the clicked operator button in the variable currentOperator for later use in calculations
    }
    operator_value.innerText = currentOperator; // update the display for the operator to show the currently selected operator
    operator_value.style.display = "block"; // make the operator display visible when an operator button is clicked
  });
});

//memory buttons functionality(M+,M-,MRC)
const memoryButtons = document.querySelectorAll(".memory");

memoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentValue !== "0") {
      // if button M+ is clicked the current value will be added to the memory as a positive number
      if (button.innerText === "M+") {
        memoryValue += parseFloat(currentValue);
        isMemorySet = true;
        mrcClickCount = 0;
      } else if (button.innerText === "M-") {
        // M- button add the negative representation of the current value to the memory
        memoryValue -= parseFloat(currentValue);
        isMemorySet = true;
        mrcClickCount = 0;
      } else {
        // when MRC button is clicked
        mrcClickCount++;
        if (mrcClickCount == 1) {
          // one time click will display the memory value
          display.innerText = memoryValue;
          currentValue = toString(memoryValue);
        } else {
          // second time click will clear the memory value and make it 0
          memoryValue = 0;
          isMemorySet = false;
        }
      }
    }
  });
});

//backspace button functionality
const backspaceButton = document.getElementById("backspace");
function backspace() {
  if (!isCalculatorOn || isCalculatorStuck) {
    return; // if the calculator is off or stuck, do nothing when the backspace button is clicked
  }
  if (currentValue.length > 0) {
    let lastCharacter = currentValue.slice(-1); // get the last character of the current value to check if it's a decimal point
    currentValue = currentValue.slice(0, -1);
    if (lastCharacter == ".") {
      dotOperatorClicked = false;
    }
  }
  if (currentValue === "") {
    currentValue = "0"; // if the current value becomes empty after backspacing, reset it to "0" to prevent an empty display
  }
  display.innerText = currentValue; // update the display with the current value after processing the backspace action
}

backspaceButton.addEventListener("click", backspace);

// clear button functionality
// clear button clears the current value from the display
const clearButton = document.getElementById("clear");
function clearEverything() {
  display.innerText = "0"; // clear the current value from the display
  currentValue = "0"; // reset the current value to 0
  dotOperatorClicked = false; // reset the state of the decimal point operator to allow for new decimal input
}
clearButton.addEventListener("click", clearEverything);

// All clear button functionality
// all clear button clears both the current value and the previous value from the display, effectively resetting the calculator to its initial state
const allClearButton = document.getElementById("all-clear");
function clearAll() {
  display.innerText = "0";
  operator_value.innerText = "";
  previousValue = "";
  currentValue = "0";
  isOperatorClicked = false;
  isCalculatorStuck = false;
  isCalculatorOn = true;
  dotOperatorClicked = false;
}
allClearButton.addEventListener("click", clearAll);

//equal button functionality
const equalButton = document.getElementById("equal");
equalButton.addEventListener("click", () => {
  if (!isCalculatorOn || isCalculatorStuck) {
    return; // if the calculator is off or stuck, do nothing when the equal button is clicked
  }
  if (currentValue != "") {
    if (previousValue != "") {
      // if current value and previous value both are not null , operator value is also not null, so we can perform calculation
      let result = calculate(previousValue, currentValue, currentOperator); // perform the calculation using the previous value, current value, and current operator, and store the result in the variable result
      showResult(result); // display the result of the calculation on the calculator display
      currentValue = result.toString(); // update the current value to the result of the calculation for potential further calculations based on the displayed result
      previousValue = ""; // reset the previous value to an empty string after performing the calculation to allow for new calculations based on the displayed result
      currentOperator = ""; // reset the current operator to an empty string after performing the calculation to allow for new calculations based on the displayed result
      grandTotal += parseFloat(result); // add the result of the calculation to the grand total to keep a cumulative total of calculations performed, which can be used for displaying the overall result of multiple calculations or for performing additional operations based on the grand total
      gtClicks++; // increment the GT click count to indicate that a calculation has been performed, which can be used for determining whether to display the grand total or perform additional operations based on the click count when the GT button is clicked
    } else {
      // if there is current value without previous value , that means operator not clicked and user just entered a number and clicked equal button, so just display the current value on the display without performing any calculation
      display.innerText = currentValue; // if there is no previous value, just display the current value when the equal button is clicked
    }
  } else {
    // if current value is null, that means user might have clicked an operator and then equal button without entering the second number, so just display the previous value on the display without performing any calculation
    if (previousValue != "") {
      display.innerText = previousValue; // if there is no current value, just display the previous value when the equal button is clicked
      currentValue = previousValue; // update the current value to the previous value to allow for potential further calculations based on the displayed result
      previousValue = ""; // reset the previous value to an empty string after displaying it
      dotOperatorClicked = false; // reset the decimal point operator state to allow for new decimal input after showing the result
      isEqualClicked = true; // set the equal clicked state to true to indicate that the equal button has been clicked, which can be used to determine whether to perform a calculation or just display the current value when the equal button is clicked without a previous value
      currentOperator = "";
      grandTotal += parseFloat(currentValue); // add the current value to the grand total to keep a cumulative total of calculations performed, which can be used for displaying the overall result of multiple calculations or for performing additional operations based on the grand total
      gtClicks++; // increment the GT click count to indicate that a calculation has been performed, which can be used for determining whether to display the grand total or perform additional operations based on the click count when the GT button is clicked
    }
  }
  toggleOperatorDisplay(); // toggle the operator display to hide it when the equal button is clicked without a current value, indicating that no operator is currently selected
});

//functionality of gt button
// const gtButton = document.getElementById("gt");
// gtButton.addEventListener("click", () => {
//   if (!isCalculatorOn || isCalculatorStuck) {
//     return; // if the calculator is off or stuck, do nothing when the GT button is clicked
//   }
//   if(currentValue != ""){

//   }

// });

//calculation function that takes the previous value, current value, and operator as arguments and performs the calculation based on the operator
function calculate(prev, curr, operator) {
  try {
    return eval(prev + operator + curr); // perform the calculation using the eval function, which evaluates the expression formed by concatenating the previous value, the operator, and the current value
  } catch (error) {
    console.error("Error in calculation:", error);
    return "Error"; // return "Error" if there is an issue with the calculation (e.g., invalid operator or division by zero)
  }
}

// function to display the result of the calculation on the calculator display, and also update the previous value to the result for potential further calculations, while resetting the current value and decimal point operator state for new input after showing the result
function showResult(res) {
  if (res === "Error") {
    display.innerText = "Error";
    dotOperatorClicked = false; // reset the decimal point operator state to allow for new decimal input after showing the error message
    toggleOperatorDisplay(); // toggle the operator display to hide it when there is an error in the calculation, indicating that no operator is currently selected
    isCalculatorStuck = true; // set the calculator stuck state to true to prevent further interactions until the issue is resolved
    //to recover from the stuck state, the user can click the all clear button, which will reset the calculator to its initial state and allow for new interactions
  } else {
    display.innerText = res;
    dotOperatorClicked = false; // reset the decimal point operator state to allow for new decimal input after showing the result
  }
}

function toggleOperatorDisplay() {
  if (operator_value.style.display === "block") {
    operator_value.style.display = "none"; // hide the operator display when the calculator is turned off to indicate that no operator is currently selected
  } else {
    operator_value.style.display = "block"; // show the operator display when the calculator is turned on to indicate that an operator can be selected
  }
}
