// password input
const passwordInput = document.querySelector('.password-section'); 

// clipboard copy button
const copyToClipboard = document.querySelector('.clip-board-btn'); 

// copied text display
const copyTextDisplay = document.querySelector('.copied-text'); 

// password length number 
const passwordLengthNum = document.querySelector('.data-length-number'); 

// range slider 
const rangeSlider = document.querySelector('.password-range-slider'); 

// include uppercase checkbox
const upperCaseBox = document.querySelector('#uppercase1');

// include uppercase checkbox
const lowerCaseBox = document.querySelector('#lowercase'); 

// include uppercase checkbox
const numbercheckBox = document.querySelector('#numbers-box'); 

// include uppercase checkbox
const symbolsCheckBox = document.querySelector('#symbols-box'); 

// all check box 
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); 

// strength light
const strengthIndicator = document.querySelector('.strength-light'); 

// Generate password button
const generatePasswordBtn = document.querySelector('.generatepassbtn'); 





// things default 
let password = ""; 
let passwordLength = 10; 
let checkCount = 0; 


 


handleSlider(); 



// functions 

// 1. handleSlider Function
function handleSlider () {
    // handleslider's job is to reflect changes on ui
    rangeSlider.value = passwordLength; 
    passwordLengthNum.innerText = passwordLength; 
    const min = rangeSlider.min; 
    const max = rangeSlider.max; 
    rangeSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min) ) + "% 100%"
}

// 2. strength indicator
function strengthIndicatorLight (color) {
    strengthIndicator.style.backgroundColor = color;  
}

// 3.  get random integer 
function getRandomInteger (min, max ) {
    return Math.floor(Math.random() * (max-min)) +min;  
}

// 4. generate Random number 
function generateRandomNumber ( ){
    return getRandomInteger( 0,9);
}

// 5. generate random lowercase character 
function generateRandomLowerCaseChar ( ){
    return String.fromCharCode(getRandomInteger(97,123)); 
}

// 6. generate random Uppercase character 
function generateRandomUpperCaseChar ( ){
    return String.fromCharCode(getRandomInteger(65,91))
}


// 7. generate random symbol 
let symbolString = "!@#$%^&*~?/*-+,;'{"; 

function generateRandomSymbol( ){
       const newSymbol = getRandomInteger(0, symbolString.length); 
       return symbolString.charAt(newSymbol); 
}




// 8. Calculate strength 
function calculateStrength (){

    let hasUpper = false; 
    let hasLower = false; 
    let hasNum = false; 
    let hasSymbol = false; 

    if (upperCaseBox.checked) hasUpper = true; 
    if (lowerCaseBox.checked) hasLower = true; 
    if (symbolsCheckBox.checked) hasSymbol = true; 
    if (numbercheckBox.checked) hasNum = true; 

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
        strengthIndicatorLight("#0f0");
    }
    else if (( hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6){
        strengthIndicatorLight("#ff0"); 
    }
    else {
        strengthIndicatorLight("#f00"); 
    }
}


// 9. copy button function 
async function copyclipboard ( ){
    try{
        await navigator.clipboard.writeText(passwordInput.value); 
        copyTextDisplay.innerText= "copied"; 
    }
    catch(e){
        copyTextDisplay.innerText= "failed"; 
    }
    // to make copied span visible
    copyTextDisplay.classList.add("active");  

    setTimeout( () => {
        copyTextDisplay.classList.remove("active"); 
    }, 2000);
}



// 10. slider event listner 
rangeSlider.addEventListener('input', (val) => {
    passwordLength = val.target.value; 
    handleSlider(); 
});

// 11.  copy btn event listner 
copyToClipboard.addEventListener('click', () => {
    if (passwordInput.value)
        copyclipboard ( ); 
}); 





// 12. handle check box changes 
function handleCheckboxChange (){
    checkCount= 0; 
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++; 
    }); 


    // special case 
    if (passwordLengthNum < checkCount){
        passwordLengthNum = checkCount; 
        handleSlider();  
    }
}



// 13. all check box event listener 
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckboxChange);
});




// 14. shuffle password function 

function shufflePassword (array) {
    // fisher yates method algo
    for( let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i]; 
        array[i] = array[j]; 
        array[j] = temp; 
    }

    let strone = ""; 
    array.forEach((el) => (strone+=el)); 
    return strone; 
}



// 14. Generate password btn event listener 
generatePasswordBtn.addEventListener('click', () => {

    //condition one = if none of the checkbox is checked then user will not get anything 
    if (checkCount <= 0)
        return; 
    

    if (passwordLength < checkCount){
        passwordLength = checkCount; 
        handleSlider(); 
    }

    console.log("password is generating"); 

    password = ""; 

    // generating password 
    let  funcArr = []; 



    if (lowerCaseBox.checked)
        funcArr.push(generateRandomLowerCaseChar); 

    if (upperCaseBox.checked)
        funcArr.push(generateRandomUpperCaseChar);
 

    if (symbolsCheckBox.checked)
        funcArr.push(generateRandomSymbol); 
    

    if (numbercheckBox.checked)
        funcArr.push(generateRandomNumber); 
    




    // checkedbox addition 
    for (let i=0; i<funcArr.length; i++){
        password += funcArr[i](); 
    }

    console.log("checkedbox additions are done"); 

    // remaining additons 
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let remainingpass = getRandomInteger(0, funcArr.length); 
        console.log("remainingpass" + remainingpass); 
        password += funcArr[remainingpass]();
    }

    console.log("remaining additions are done"); 

    // shuffling password
   password = shufflePassword(Array.from(password)); 

   console.log("shuffling password done"); 

   passwordInput.value = password; 
   console.log("added in website done"); 
    // strength indicator 
    calculateStrength(); 
});

