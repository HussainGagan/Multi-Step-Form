const stepControlEl = document.querySelector(".step-controls");
const btnNextEl = document.querySelector(".btn-next");
const btnBackEl = document.querySelector(".btn-back");
const nameInputEl = document.getElementById("name");
const emailInputEl = document.getElementById("email");
const numInputEl = document.getElementById("num");
const step1InputsEl = [nameInputEl, emailInputEl, numInputEl];
const stepContentEls = document.querySelectorAll(".step-content");
const sidebarBtnEls = document.querySelectorAll(".btn-step");
const plans = document.querySelectorAll(".plan");
const planErrEl = document.querySelector(".plan-err");
const planCheckEl = document.querySelector(".toggle-check");
const planYText = document.querySelector(".plan-y");
const planMText = document.querySelector(".plan-m");
const addOnFormEl = document.querySelector(".add-ons-form");
const addOnLabelEls = addOnFormEl.querySelectorAll(".add-on-label");
const addOnPricesEl = document.querySelectorAll("span[data-addon-price]");
const summaryEl = document.querySelector(".summary");
const totalTextEl = document.querySelector(".total p");
const sumTotalPriceEl = document.querySelector(".total-price");
const planChangeBtn = summaryEl.querySelector(".plan-change");

let curr = 0;
const userSelectOptions = {
  planType: "Monthly",
  planName: "",
  planPrice: "",
  userSelectAddOns: [],
};
const monthlyPrices = [9, 12, 15];
const yearlyPrices = [90, 120, 150];

const addOnMonthlyPrice = [1, 2, 2];
const addOnYearlyPrice = [10, 20, 20];

const formErr = function (el, msg = "") {
  el.parentElement.classList.add("form-err");
  if (msg) {
    el.parentElement.querySelector(".input-label span").textContent = msg;
  }
};

const checkIfLastStep = function () {
  if (curr === stepContentEls.length - 2) {
    btnNextEl.classList.add("btn-confirm");
    btnNextEl.textContent = "Confirm";
  } else {
    btnNextEl.classList.remove("btn-confirm");
    btnNextEl.textContent = "Next Step";
  }
};

const checkIfFirstStep = function () {
  if (curr === 0) {
    btnBackEl.classList.remove("btn-back-show");
  }
};

const showBackBtn = function () {
  if (curr > 0 && curr < stepContentEls.length - 1) {
    btnBackEl.classList.add("btn-back-show");
  } else {
    btnBackEl.classList.remove("btn-back-show");
  }
};

const nextStep = function () {
  stepContentEls[curr].classList.add("step-hidden");
  sidebarBtnEls[curr > 3 ? 3 : curr].classList.remove("btn-step-active");
  curr = curr < stepContentEls.length - 1 ? ++curr : curr;
  stepContentEls[curr].classList.remove("step-hidden");
  sidebarBtnEls[curr > 3 ? 3 : curr].classList.add("btn-step-active");

  if (curr === stepContentEls.length - 1) {
    stepControlEl.classList.add("step-hidden");
  }

  checkIfLastStep();
  showBackBtn();
};

const prevStep = function (stepToMinus = 1) {
  stepContentEls[curr].classList.add("step-hidden");
  sidebarBtnEls[curr].classList.remove("btn-step-active");
  curr = curr === 0 ? curr : curr - stepToMinus;
  stepContentEls[curr].classList.remove("step-hidden");
  sidebarBtnEls[curr].classList.add("btn-step-active");

  checkIfFirstStep();
  checkIfLastStep();
};

const validationStep1 = function () {
  step1InputsEl.forEach((inp) => {
    if (inp.value === "") {
      formErr(inp);
    }
  });
  if (
    emailInputEl.value &&
    !/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(emailInputEl.value)
  ) {
    return formErr(emailInputEl, "Email is invalid");
  }

  if (
    numInputEl.value &&
    !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      numInputEl.value
    )
  ) {
    return formErr(numInputEl, "Phone Number is invalid");
  }

  if (
    nameInputEl.value !== "" &&
    emailInputEl.value !== "" &&
    numInputEl.value !== ""
  ) {
    nextStep();
  }
};

const validationStep2 = function () {
  let isPlanSelected = false;
  for (const plan of plans) {
    if (plan.classList.contains("plan-active")) {
      isPlanSelected = true;
      userSelectOptions.planName = plan.dataset.planName;
      userSelectOptions.planPrice =
        plan.querySelector(".plan-price").textContent;
      break;
    }
  }
  if (!isPlanSelected) {
    planErrEl.classList.add("plan-err-show");
  } else {
    nextStep();
  }
};

const saveUserSelectAddOns = function () {
  userSelectOptions.userSelectAddOns = [];
  addOnLabelEls.forEach((labelEl) => {
    if (!labelEl.classList.contains("add-on-label-active")) return;
    const addOnPrice = labelEl.querySelector("span[data-addon-price]");
    userSelectOptions.userSelectAddOns.push([
      labelEl.dataset.addonName,
      addOnPrice.textContent,
    ]);
  });
};

const clearSummary = function (markup) {
  summaryEl.innerHTML = "";
  summaryEl.insertAdjacentHTML("afterbegin", markup);
};

const calcTotalPrice = function () {
  const planPriceNum = Number(userSelectOptions.planPrice.match(/\d+/g));
  const totalAddOnPrice = userSelectOptions.userSelectAddOns.reduce(
    (acc, addon) => {
      return acc + Number(addon[1].match(/\d+/g));
    },
    0
  );
  return planPriceNum + totalAddOnPrice;
};

const formSummary = function () {
  console.log(userSelectOptions);
  let markup = `
    <div class="plan-details">
      <div>
        <p class="plan-text">${userSelectOptions.planName} (${userSelectOptions.planType})</p>
        <button class="plan-change">Change</button>
      </div>
      <p class="summary-plan-price">${userSelectOptions.planPrice}</p>
    </div>`;

  if (userSelectOptions.userSelectAddOns.length > 0) {
    markup += userSelectOptions.userSelectAddOns.map((addOn) => {
      return `
        <div class="add-on-details">
          <p>${addOn[0]}</p>
          <span>${addOn[1]}</span>
        </div>
      `;
    });
    clearSummary(markup);
    summaryEl.firstElementChild.classList.add("plan-details-with-addons");
  } else {
    clearSummary(markup);
    summaryEl.firstElementChild.classList.remove("plan-details-with-addons");
  }
  summaryEl
    .querySelector(".plan-change")
    .addEventListener("click", function () {
      console.log("hey");
      prevStep(2);
    });
  totalTextEl.textContent = `Total (per ${
    userSelectOptions.planType === "Monthly" ? "month" : "year"
  })`;
  sumTotalPriceEl.textContent = `+$${calcTotalPrice()}/${
    userSelectOptions.planType === "Monthly" ? "mo" : "yr"
  }`;
  nextStep();
};

btnNextEl.addEventListener("click", function () {
  if (curr === 0) {
    validationStep1();
    return;
  }
  if (curr === 1) {
    validationStep2();
    return;
  }
  if (curr === 2) {
    saveUserSelectAddOns();
    formSummary();
    return;
  }
  nextStep();
});

btnBackEl.addEventListener("click", () => {
  prevStep();
});

step1InputsEl.forEach((inp) => {
  inp.addEventListener("input", function () {
    if (inp.id === "email") {
    }
    inp.parentElement.classList.remove("form-err");
  });
});

const rmvActivePlan = function () {
  plans.forEach((plan) => {
    plan.classList.remove("plan-active");
  });
};

plans.forEach((plan) => {
  plan.addEventListener("click", function (e) {
    rmvActivePlan();
    plan.classList.add("plan-active");
    planErrEl.classList.remove("plan-err-show");
  });
});

const togglePlanTextActive = function () {
  planMText.classList.toggle("plan-type-active");
  planYText.classList.toggle("plan-type-active");
};

planCheckEl.addEventListener("input", function (e) {
  userSelectOptions.planType = planCheckEl.checked ? "Yearly" : "Monthly";
  togglePlanTextActive();
  if (userSelectOptions.planType === "Yearly") {
    plans.forEach((plan, i) => {
      plan.classList.add("plan-yearly");
      plan.querySelector(".plan-price").textContent = `$${yearlyPrices[i]}/yr`;
    });
    addOnPricesEl.forEach((priceEl, i) => {
      priceEl.textContent = `$${addOnYearlyPrice[i]}/yr`;
    });
  } else {
    plans.forEach((plan, i) => {
      plan.classList.remove("plan-yearly");
      plan.querySelector(".plan-price").textContent = `$${monthlyPrices[i]}/mo`;
    });
    addOnPricesEl.forEach((priceEl, i) => {
      priceEl.textContent = `$${addOnMonthlyPrice[i]}/mo`;
    });
  }
});

addOnFormEl.addEventListener("input", function (e) {
  const addOnCheckEl = e.target.closest(".add-on-label");
  const isAddOnChecked = e.target.checked;
  if (isAddOnChecked) {
    addOnCheckEl.classList.add("add-on-label-active");
  } else {
    addOnCheckEl.classList.remove("add-on-label-active");
  }
});
