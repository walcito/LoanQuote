$(document).ready(function () {
  const inputEntityName = $("#entity-name");
  const inputEntityRnc = $("#entity-rnc");
  const inputEntityPhone = $("#entity-phone");
  const inputEntityEmail = $("#entity-email");
  const inputEntityAddress = $("#entity-address");
  const inputEntityLogo = $("#entity-logo");

  const inputClientName = $("#client-name");
  const inputClientId = $("#client-id");
  const inputClientPhone = $("#client-phone");
  const inputClientEmail = $("#client-email");
  const inputClientAddress = $("#client-address");
  const inputClientIncome = $("#client-income");

  const selectLoanType = $("#loan-type");
  const inputQuoteNumber = $("#quote-number");
  const selectLoanStatus = $("#loan-status");
  const inputQuoteDate = $("#quote-date");
  const inputExpirationDate = $("#expiration-date");
  const selectLoanCurrency = $("#loan-currency");

  const inputRequestedAmount = $("#requested-amount");
  const inputDownPayment = $("#down-payment");
  const inputFinancedAmount = $("#financed-amount");
  const inputAnnualRate = $("#annual-interest-rate");
  const inputLoanTerm = $("#loan-term");
  const inputFirstPaymentDate = $("#first-payment-date");
  const selectAmortizationType = $("#amortization-type");

  const checkApplyInsurance = $("#apply-insurance");
  const inputMonthlyInsuranceRate = $("#monthly-insurance-rate");
  const inputAdminFee = $("#admin-fee");
  const selectAdminFeeType = $("#admin-fee-type");

  const extraPaymentsContainer = $("#extra-payments-container");
  const buttonAddExtraPayment = $("#btn-add-extra-payment");

  const summaryRequested = $("#summary-requested");
  const summaryDownPayment = $("#summary-down-payment");
  const summaryAdminFee = $("#summary-admin-fee");
  const summaryFinanced = $("#summary-financed");
  const summaryBaseAmount = $("#summary-base-amount");
  const summaryAnnualRate = $("#summary-annual-rate");
  const summaryMonthlyRate = $("#summary-monthly-rate");
  const summaryTerm = $("#summary-term");
  const summaryInstallmentsCount = $("#summary-installments-count");
  const summaryInitialInstallment = $("#summary-initial-installment");
  const summaryTotalPrincipal = $("#summary-total-principal");
  const summaryTotalInterest = $("#summary-total-interest");
  const summaryTotalInsurance = $("#summary-total-insurance");
  const summaryTotalExtra = $("#summary-total-extra");
  const summaryTotalInstallmentsPaid = $("#summary-total-installments-paid");
  const summaryCompletionDate = $("#summary-completion-date");
  const summaryDtiRatio = $("#summary-dti-ratio");
  const summaryRiskLevel = $("#summary-risk-level");
  const summaryGrandTotal = $("#summary-grand-total");

  const amortizationTableBody = $("#amortization-table-body");
  const buttonGenerateQuote = $("#btn-generate-quote");
  const generatedQuoteSection = $("#generated-quote-section");
  const generatedQuoteContainer = $("#generated-quote-container");

  let extraRowCounter = 0;

  function GetNumber(input) {
    const value = parseFloat(input.val());
    if (isNaN(value)) {
      return 0;
    }
    return value;
  }

  function FormatMoney(amount) {
    const currency = selectLoanCurrency.val() || "DOP";
    const num = isNaN(amount) ? 0 : Number(amount);
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return currency + " " + formatted;
  }

  function FormatPercent(value) {
    const num = isNaN(value) ? 0 : Number(value);
    return num.toFixed(2) + "%";
  }

  function FormatDate(value) {
    if (!value) return "-";
    const parts = value.split("-");
    if (parts.length < 3) return value;
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  function IsValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  function IsValidUrl(url) {
    if (!url) return false;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function AddMonthsCalendar(startDateStr, monthOffset) {
    if (!startDateStr) return "-";
    const parts = startDateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const targetDate = new Date(year, month + monthOffset, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const finalDay = Math.min(day, lastDayOfMonth);

    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${pad(finalDay)}/${pad(targetMonth + 1)}/${targetYear}`;
  }

  function ShowError(element, message) {
    const $el = $(element);
    $el.addClass("input-error");
    const errorDiv = $("#" + $el.attr("id") + "-error");
    if (errorDiv.length) {
      errorDiv.text(message);
    }
  }

  function HideError(element) {
    const $el = $(element);
    $el.removeClass("input-error");
    const errorDiv = $("#" + $el.attr("id") + "-error");
    if (errorDiv.length) {
      errorDiv.text("");
    }
  }

  function AddCorrectionEvent(input, validationFunction) {
    $(input).on("input change", function () {
      if ($(this).hasClass("input-error")) {
        validationFunction();
      }
    });
  }

  function CreateExtraPaymentRow() {
    extraRowCounter++;
    const rowId = extraRowCounter;

    const divRow = $(`
      <div class="extra-payment-row mb-3" data-row-id="${rowId}">
        <div class="row g-2 align-items-end">
          <div class="col-12 col-md-3">
            <label for="ep-month-${rowId}" class="form-label">Mes de aplicación *</label>
            <input id="ep-month-${rowId}" class="form-control ep-month" type="number" min="1" step="1" placeholder="1" />
            <div id="ep-month-${rowId}-error" class="error-message"></div>
          </div>
          <div class="col-12 col-md-4">
            <label for="ep-amount-${rowId}" class="form-label">Monto del pago *</label>
            <input id="ep-amount-${rowId}" class="form-control ep-amount" type="number" min="0.01" step="0.01" placeholder="10000" />
            <div id="ep-amount-${rowId}-error" class="error-message"></div>
          </div>
          <div class="col-12 col-md-4">
            <label for="ep-desc-${rowId}" class="form-label">Descripción</label>
            <input id="ep-desc-${rowId}" class="form-control ep-desc" type="text" placeholder="Bono navideño" />
          </div>
          <div class="col-12 col-md-1 d-grid">
            <button class="btn btn-outline-danger btn-delete-extra" type="button">X</button>
          </div>
        </div>
      </div>
    `);

    extraPaymentsContainer.append(divRow);

    const mInput = divRow.find(".ep-month");
    const aInput = divRow.find(".ep-amount");

    AddCorrectionEvent(mInput, function () {
      ValidateExtraMonth(mInput);
    });

    AddCorrectionEvent(aInput, function () {
      ValidateExtraAmount(aInput);
    });
  }

  extraPaymentsContainer.on("click", ".btn-delete-extra", function () {
    $(this).closest(".extra-payment-row").remove();
    UpdateEngineAndSummary();
  });

  extraPaymentsContainer.on("input change", "input", function () {
    UpdateEngineAndSummary();
  });

  buttonAddExtraPayment.on("click", function () {
    CreateExtraPaymentRow();
    UpdateEngineAndSummary();
  });

  checkApplyInsurance.on("change", function () {
    if ($(this).is(":checked")) {
      inputMonthlyInsuranceRate.prop("disabled", false).focus();
    } else {
      inputMonthlyInsuranceRate.val("").prop("disabled", true);
      HideError(inputMonthlyInsuranceRate);
    }
    UpdateEngineAndSummary();
  });

  $(
    [
      inputRequestedAmount,
      inputDownPayment,
      inputAnnualRate,
      inputLoanTerm,
      inputFirstPaymentDate,
      selectAmortizationType,
      inputMonthlyInsuranceRate,
      inputAdminFee,
      selectAdminFeeType,
      selectLoanCurrency,
      inputClientIncome,
    ].map((el) => "#" + el.attr("id")).join(",")
  ).on("input change", function () {
    UpdateEngineAndSummary();
  });

  inputQuoteDate.on("change", function () {
    if (inputExpirationDate.hasClass("input-error")) {
      ValidateExpirationDate();
    }
    if (inputFirstPaymentDate.hasClass("input-error")) {
      ValidateFirstPaymentDate();
    }
  });

  function CalculateEngine() {
    const requested = GetNumber(inputRequestedAmount);
    const downPayment = GetNumber(inputDownPayment);
    const financed = requested - downPayment;

    inputFinancedAmount.val(financed > 0 ? financed.toFixed(2) : "0.00");

    const annualRate = GetNumber(inputAnnualRate);
    const term = parseInt(inputLoanTerm.val(), 10) || 0;
    const amortizationType = selectAmortizationType.val() || "Cuota fija";
    const applyIns = checkApplyInsurance.is(":checked");
    const insuranceRateMonthly = applyIns ? GetNumber(inputMonthlyInsuranceRate) : 0;
    const adminFee = GetNumber(inputAdminFee);
    const adminFeeType = selectAdminFeeType.val() || "Cobrar como cargo inicial";

    let baseAmount = financed;
    if (adminFeeType === "Sumar al monto financiado") {
      baseAmount = financed + adminFee;
    }

    const monthlyRate = annualRate / 12 / 100;
    const firstPaymentDateStr = inputFirstPaymentDate.val() || "";

    const extraPaymentsByMonth = {};
    extraPaymentsContainer.find(".extra-payment-row").each(function () {
      const m = parseInt($(this).find(".ep-month").val(), 10);
      const a = parseFloat($(this).find(".ep-amount").val());
      if (!isNaN(m) && !isNaN(a) && a > 0) {
        extraPaymentsByMonth[m] = (extraPaymentsByMonth[m] || 0) + a;
      }
    });

    if (requested <= 0 || downPayment >= requested || term <= 0 || baseAmount <= 0) {
      return {
        isValid: false,
        schedule: [],
        totals: {
          requested,
          downPayment,
          financed,
          adminFee,
          adminFeeType,
          baseAmount,
          annualRate,
          monthlyRate: monthlyRate * 100,
          term,
          installmentsCount: 0,
          initialInstallment: 0,
          totalPrincipal: 0,
          totalInterest: 0,
          totalInsurance: 0,
          totalExtra: 0,
          totalInstallmentsPaid: 0,
          grandTotal: 0,
          completionDate: "-",
          dtiRatio: 0,
          riskLevel: "-",
        },
      };
    }

    let fixedBaseInstallment = 0;
    let fixedPrincipal = 0;

    if (amortizationType === "Cuota fija") {
      if (monthlyRate === 0) {
        fixedBaseInstallment = baseAmount / term;
      } else {
        fixedBaseInstallment =
          (baseAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
      }
    } else {
      fixedPrincipal = baseAmount / term;
    }

    const schedule = [];
    let currentBalance = baseAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    let totalInsurancePaid = 0;
    let totalExtraPaid = 0;
    let totalInstallmentsPaid = 0;

    for (let month = 1; month <= term; month++) {
      if (currentBalance <= 0.000001) {
        break;
      }

      const initialBal = currentBalance;
      const interestMonth = initialBal * monthlyRate;
      const insuranceMonth = (initialBal * insuranceRateMonthly) / 100;

      let principalMonth = 0;
      let baseInstallmentMonth = 0;

      if (amortizationType === "Cuota fija") {
        baseInstallmentMonth = fixedBaseInstallment;
        principalMonth = baseInstallmentMonth - interestMonth;
        if (principalMonth > initialBal) {
          principalMonth = initialBal;
          baseInstallmentMonth = principalMonth + interestMonth;
        }
      } else {
        principalMonth = fixedPrincipal;
        if (principalMonth > initialBal) {
          principalMonth = initialBal;
        }
        baseInstallmentMonth = principalMonth + interestMonth;
      }

      const totalInstallmentMonth = baseInstallmentMonth + insuranceMonth;
      let balanceAfterInstallment = initialBal - principalMonth;
      if (balanceAfterInstallment < 0) balanceAfterInstallment = 0;

      const requestedExtra = extraPaymentsByMonth[month] || 0;
      let appliedExtra = 0;
      if (requestedExtra > 0) {
        if (requestedExtra > balanceAfterInstallment) {
          appliedExtra = balanceAfterInstallment;
        } else {
          appliedExtra = requestedExtra;
        }
      }

      let finalBal = balanceAfterInstallment - appliedExtra;
      if (finalBal < 0 || Math.abs(finalBal) < 0.00001) {
        finalBal = 0;
      }

      currentBalance = finalBal;

      const paymentDate = firstPaymentDateStr
        ? AddMonthsCalendar(firstPaymentDateStr, month - 1)
        : `Mes ${month}`;

      schedule.push({
        installmentNumber: month,
        paymentDate: paymentDate,
        initialBalance: initialBal,
        baseInstallment: baseInstallmentMonth,
        principal: principalMonth,
        interest: interestMonth,
        insurance: insuranceMonth,
        extraPayment: appliedExtra,
        totalInstallment: totalInstallmentMonth,
        finalBalance: finalBal,
      });

      totalPrincipalPaid += principalMonth;
      totalInterestPaid += interestMonth;
      totalInsurancePaid += insuranceMonth;
      totalExtraPaid += appliedExtra;
      totalInstallmentsPaid += totalInstallmentMonth;
    }

    let grandTotal = totalInstallmentsPaid;
    if (adminFeeType === "Cobrar como cargo inicial") {
      grandTotal += adminFee;
    }

    const installmentsCount = schedule.length;
    const initialInstallment = installmentsCount > 0 ? schedule[0].totalInstallment : 0;
    const completionDate =
      installmentsCount > 0 ? schedule[installmentsCount - 1].paymentDate : "-";

    const income = GetNumber(inputClientIncome);
    let dtiRatio = 0;
    let riskLevel = "-";

    if (income > 0 && initialInstallment > 0) {
      dtiRatio = (initialInstallment / income) * 100;
      if (dtiRatio <= 30) {
        riskLevel = "Nivel saludable";
      } else if (dtiRatio <= 50) {
        riskLevel = "Nivel de riesgo medio";
      } else {
        riskLevel = "Nivel de riesgo alto";
      }
    }

    return {
      isValid: schedule.length > 0,
      schedule,
      totals: {
        requested,
        downPayment,
        financed,
        adminFee,
        adminFeeType,
        baseAmount,
        annualRate,
        monthlyRate: monthlyRate * 100,
        term,
        installmentsCount,
        initialInstallment,
        totalPrincipal: totalPrincipalPaid,
        totalInterest: totalInterestPaid,
        totalInsurance: totalInsurancePaid,
        totalExtra: totalExtraPaid,
        totalInstallmentsPaid,
        grandTotal,
        completionDate,
        dtiRatio,
        riskLevel,
      },
    };
  }

  function UpdateEngineAndSummary() {
    const res = CalculateEngine();
    const t = res.totals;

    summaryRequested.text(FormatMoney(t.requested));
    summaryDownPayment.text(FormatMoney(t.downPayment));
    summaryAdminFee.text(FormatMoney(t.adminFee));
    summaryFinanced.text(FormatMoney(t.financed));
    summaryBaseAmount.text(FormatMoney(t.baseAmount));
    summaryAnnualRate.text(FormatPercent(t.annualRate));
    summaryMonthlyRate.text(FormatPercent(t.monthlyRate));
    summaryTerm.text(t.term);
    summaryInstallmentsCount.text(t.installmentsCount);
    summaryInitialInstallment.text(FormatMoney(t.initialInstallment));
    summaryTotalPrincipal.text(FormatMoney(t.totalPrincipal));
    summaryTotalInterest.text(FormatMoney(t.totalInterest));
    summaryTotalInsurance.text(FormatMoney(t.totalInsurance));
    summaryTotalExtra.text(FormatMoney(t.totalExtra));
    summaryTotalInstallmentsPaid.text(FormatMoney(t.totalInstallmentsPaid));
    summaryCompletionDate.text(t.completionDate);
    summaryDtiRatio.text(FormatPercent(t.dtiRatio));
    summaryRiskLevel.text(t.riskLevel);
    summaryGrandTotal.text(FormatMoney(t.grandTotal));

    if (res.schedule.length > 0) {
      let rowsHtml = "";
      res.schedule.forEach((row) => {
        rowsHtml += `
          <tr>
            <td class="text-center">${row.installmentNumber}</td>
            <td class="text-center">${row.paymentDate}</td>
            <td>${FormatMoney(row.initialBalance)}</td>
            <td>${FormatMoney(row.baseInstallment)}</td>
            <td>${FormatMoney(row.principal)}</td>
            <td>${FormatMoney(row.interest)}</td>
            <td>${FormatMoney(row.insurance)}</td>
            <td>${FormatMoney(row.extraPayment)}</td>
            <td class="fw-bold">${FormatMoney(row.totalInstallment)}</td>
            <td class="fw-bold">${FormatMoney(row.finalBalance)}</td>
          </tr>
        `;
      });
      amortizationTableBody.html(rowsHtml);
    } else {
      amortizationTableBody.html(`
        <tr>
          <td colspan="10" class="text-center text-muted py-3">
            Complete los datos de condiciones financieras para visualizar la tabla de amortización.
          </td>
        </tr>
      `);
    }

    return res;
  }

  function ValidateRequired(input, message) {
    if (input.val().trim() == "") {
      ShowError(input, message);
      return false;
    }
    HideError(input);
    return true;
  }

  function ValidateEntityName() {
    return ValidateRequired(inputEntityName, "Debe ingresar el nombre de la entidad financiera.");
  }

  function ValidateEntityRnc() {
    return ValidateRequired(inputEntityRnc, "El RNC o identificación de la entidad es requerido.");
  }

  function ValidateEntityPhone() {
    return ValidateRequired(inputEntityPhone, "El teléfono de la entidad es requerido.");
  }

  function ValidateEntityEmail() {
    if (!ValidateRequired(inputEntityEmail, "El correo electrónico de la entidad es requerido.")) {
      return false;
    }
    if (!IsValidEmail(inputEntityEmail.val())) {
      ShowError(inputEntityEmail, "Debe ingresar un correo electrónico válido.");
      return false;
    }
    HideError(inputEntityEmail);
    return true;
  }

  function ValidateEntityAddress() {
    return ValidateRequired(inputEntityAddress, "La dirección de la entidad es requerida.");
  }

  function ValidateEntityLogo() {
    const val = inputEntityLogo.val().trim();
    if (val != "" && !IsValidUrl(val)) {
      ShowError(inputEntityLogo, "Debe ingresar una URL de logo válida.");
      return false;
    }
    HideError(inputEntityLogo);
    return true;
  }

  function ValidateClientName() {
    return ValidateRequired(inputClientName, "Debe ingresar el nombre del solicitante.");
  }

  function ValidateClientId() {
    return ValidateRequired(inputClientId, "La identificación del solicitante es requerida.");
  }

  function ValidateClientPhone() {
    return ValidateRequired(inputClientPhone, "El teléfono del solicitante es requerido.");
  }

  function ValidateClientEmail() {
    if (!ValidateRequired(inputClientEmail, "El correo electrónico del solicitante es requerido.")) {
      return false;
    }
    if (!IsValidEmail(inputClientEmail.val())) {
      ShowError(inputClientEmail, "Debe ingresar un correo electrónico válido.");
      return false;
    }
    HideError(inputClientEmail);
    return true;
  }

  function ValidateClientAddress() {
    return ValidateRequired(inputClientAddress, "La dirección del solicitante es requerida.");
  }

  function ValidateClientIncome() {
    if (inputClientIncome.val().trim() == "") {
      ShowError(inputClientIncome, "El ingreso mensual debe ser mayor que cero.");
      return false;
    }
    const val = Number(inputClientIncome.val());
    if (isNaN(val) || val <= 0) {
      ShowError(inputClientIncome, "El ingreso mensual debe ser mayor que cero.");
      return false;
    }
    HideError(inputClientIncome);
    return true;
  }

  function ValidateLoanType() {
    return ValidateRequired(selectLoanType, "El tipo de préstamo es requerido.");
  }

  function ValidateQuoteNumber() {
    return ValidateRequired(inputQuoteNumber, "El número de cotización es requerido.");
  }

  function ValidateLoanStatus() {
    return ValidateRequired(selectLoanStatus, "El estado es requerido.");
  }

  function ValidateQuoteDate() {
    return ValidateRequired(inputQuoteDate, "La fecha de cotización es requerida.");
  }

  function ValidateExpirationDate() {
    if (!ValidateRequired(inputExpirationDate, "La fecha de vencimiento es requerida.")) {
      return false;
    }
    if (inputQuoteDate.val() != "" && inputExpirationDate.val() < inputQuoteDate.val()) {
      ShowError(
        inputExpirationDate,
        "La fecha de vencimiento debe ser igual o mayor que la fecha de cotización."
      );
      return false;
    }
    HideError(inputExpirationDate);
    return true;
  }

  function ValidateLoanCurrency() {
    return ValidateRequired(selectLoanCurrency, "La moneda es requerida.");
  }

  function ValidateRequestedAmount() {
    if (inputRequestedAmount.val().trim() == "") {
      ShowError(inputRequestedAmount, "El monto solicitado debe ser mayor que cero.");
      return false;
    }
    const val = Number(inputRequestedAmount.val());
    if (isNaN(val) || val <= 0) {
      ShowError(inputRequestedAmount, "El monto solicitado debe ser mayor que cero.");
      return false;
    }
    HideError(inputRequestedAmount);
    return true;
  }

  function ValidateDownPayment() {
    const req = Number(inputRequestedAmount.val()) || 0;
    const valStr = inputDownPayment.val().trim();
    if (valStr == "") {
      HideError(inputDownPayment);
      return true;
    }
    const val = Number(valStr);
    if (isNaN(val) || val < 0) {
      ShowError(inputDownPayment, "El pago inicial no puede ser menor que cero.");
      return false;
    }
    if (req > 0 && val >= req) {
      ShowError(inputDownPayment, "El pago inicial debe ser menor que el monto solicitado.");
      return false;
    }
    HideError(inputDownPayment);
    return true;
  }

  function ValidateAnnualRate() {
    const valStr = inputAnnualRate.val().trim();
    if (valStr == "") {
      ShowError(inputAnnualRate, "La tasa de interés anual debe estar entre 0 y 100.");
      return false;
    }
    const val = Number(valStr);
    if (isNaN(val) || val < 0 || val > 100) {
      ShowError(inputAnnualRate, "La tasa de interés anual debe estar entre 0 y 100.");
      return false;
    }
    HideError(inputAnnualRate);
    return true;
  }

  function ValidateLoanTerm() {
    const valStr = inputLoanTerm.val().trim();
    const val = Number(valStr);
    if (valStr == "" || isNaN(val) || val <= 0 || val > 360 || !Number.isInteger(val)) {
      ShowError(
        inputLoanTerm,
        "El plazo en meses debe ser un número entero mayor que cero y menor o igual que 360."
      );
      return false;
    }
    HideError(inputLoanTerm);
    return true;
  }

  function ValidateFirstPaymentDate() {
    if (!ValidateRequired(inputFirstPaymentDate, "La fecha del primer pago es requerida.")) {
      return false;
    }
    if (inputQuoteDate.val() != "" && inputFirstPaymentDate.val() < inputQuoteDate.val()) {
      ShowError(
        inputFirstPaymentDate,
        "La fecha del primer pago debe ser igual o mayor que la fecha de cotización."
      );
      return false;
    }
    HideError(inputFirstPaymentDate);
    return true;
  }

  function ValidateAmortizationType() {
    return ValidateRequired(selectAmortizationType, "El tipo de amortización es requerido.");
  }

  function ValidateInsuranceRate() {
    if (checkApplyInsurance.is(":checked")) {
      const valStr = inputMonthlyInsuranceRate.val().trim();
      if (valStr == "") {
        ShowError(inputMonthlyInsuranceRate, "Debe ingresar el porcentaje de seguro mensual.");
        return false;
      }
      const val = Number(valStr);
      if (isNaN(val) || val < 0 || val > 100) {
        ShowError(inputMonthlyInsuranceRate, "El porcentaje de seguro mensual debe estar entre 0 y 100.");
        return false;
      }
      HideError(inputMonthlyInsuranceRate);
      return true;
    }
    HideError(inputMonthlyInsuranceRate);
    return true;
  }

  function ValidateAdminFee() {
    const valStr = inputAdminFee.val().trim();
    if (valStr != "") {
      const val = Number(valStr);
      if (isNaN(val) || val < 0) {
        ShowError(inputAdminFee, "La comisión administrativa no puede ser menor que cero.");
        return false;
      }
    }
    HideError(inputAdminFee);
    return true;
  }

  function ValidateAdminFeeType() {
    return ValidateRequired(selectAdminFeeType, "La forma de aplicar la comisión es requerida.");
  }

  function ValidateExtraMonth(input) {
    const term = parseInt(inputLoanTerm.val(), 10) || 360;
    const valStr = input.val().trim();
    const val = Number(valStr);
    if (valStr == "" || isNaN(val) || val <= 0 || val > term || !Number.isInteger(val)) {
      ShowError(input, "El mes del pago extraordinario debe estar dentro del plazo del préstamo.");
      return false;
    }
    HideError(input);
    return true;
  }

  function ValidateExtraAmount(input) {
    const valStr = input.val().trim();
    const val = Number(valStr);
    if (valStr == "" || isNaN(val) || val <= 0) {
      ShowError(input, "El monto del pago extraordinario debe ser mayor que cero.");
      return false;
    }
    HideError(input);
    return true;
  }

  function ValidateExtraPayments() {
    let isValid = true;
    extraPaymentsContainer.find(".extra-payment-row").each(function () {
      const m = $(this).find(".ep-month");
      const a = $(this).find(".ep-amount");
      if (!ValidateExtraMonth(m)) isValid = false;
      if (!ValidateExtraAmount(a)) isValid = false;
    });
    return isValid;
  }

  AddCorrectionEvent(inputEntityName, ValidateEntityName);
  AddCorrectionEvent(inputEntityRnc, ValidateEntityRnc);
  AddCorrectionEvent(inputEntityPhone, ValidateEntityPhone);
  AddCorrectionEvent(inputEntityEmail, ValidateEntityEmail);
  AddCorrectionEvent(inputEntityAddress, ValidateEntityAddress);
  AddCorrectionEvent(inputEntityLogo, ValidateEntityLogo);

  AddCorrectionEvent(inputClientName, ValidateClientName);
  AddCorrectionEvent(inputClientId, ValidateClientId);
  AddCorrectionEvent(inputClientPhone, ValidateClientPhone);
  AddCorrectionEvent(inputClientEmail, ValidateClientEmail);
  AddCorrectionEvent(inputClientAddress, ValidateClientAddress);
  AddCorrectionEvent(inputClientIncome, ValidateClientIncome);

  AddCorrectionEvent(selectLoanType, ValidateLoanType);
  AddCorrectionEvent(inputQuoteNumber, ValidateQuoteNumber);
  AddCorrectionEvent(selectLoanStatus, ValidateLoanStatus);
  AddCorrectionEvent(inputQuoteDate, ValidateQuoteDate);
  AddCorrectionEvent(inputExpirationDate, ValidateExpirationDate);
  AddCorrectionEvent(selectLoanCurrency, ValidateLoanCurrency);

  AddCorrectionEvent(inputRequestedAmount, ValidateRequestedAmount);
  AddCorrectionEvent(inputDownPayment, ValidateDownPayment);
  AddCorrectionEvent(inputAnnualRate, ValidateAnnualRate);
  AddCorrectionEvent(inputLoanTerm, ValidateLoanTerm);
  AddCorrectionEvent(inputFirstPaymentDate, ValidateFirstPaymentDate);
  AddCorrectionEvent(selectAmortizationType, ValidateAmortizationType);

  AddCorrectionEvent(inputMonthlyInsuranceRate, ValidateInsuranceRate);
  AddCorrectionEvent(inputAdminFee, ValidateAdminFee);
  AddCorrectionEvent(selectAdminFeeType, ValidateAdminFeeType);

  function Validate() {
    let isValid = true;

    if (!ValidateEntityName()) isValid = false;
    if (!ValidateEntityRnc()) isValid = false;
    if (!ValidateEntityPhone()) isValid = false;
    if (!ValidateEntityEmail()) isValid = false;
    if (!ValidateEntityAddress()) isValid = false;
    if (!ValidateEntityLogo()) isValid = false;

    if (!ValidateClientName()) isValid = false;
    if (!ValidateClientId()) isValid = false;
    if (!ValidateClientPhone()) isValid = false;
    if (!ValidateClientEmail()) isValid = false;
    if (!ValidateClientAddress()) isValid = false;
    if (!ValidateClientIncome()) isValid = false;

    if (!ValidateLoanType()) isValid = false;
    if (!ValidateQuoteNumber()) isValid = false;
    if (!ValidateLoanStatus()) isValid = false;
    if (!ValidateQuoteDate()) isValid = false;
    if (!ValidateExpirationDate()) isValid = false;
    if (!ValidateLoanCurrency()) isValid = false;

    if (!ValidateRequestedAmount()) isValid = false;
    if (!ValidateDownPayment()) isValid = false;
    if (!ValidateAnnualRate()) isValid = false;
    if (!ValidateLoanTerm()) isValid = false;
    if (!ValidateFirstPaymentDate()) isValid = false;
    if (!ValidateAmortizationType()) isValid = false;

    if (!ValidateInsuranceRate()) isValid = false;
    if (!ValidateAdminFee()) isValid = false;
    if (!ValidateAdminFeeType()) isValid = false;

    if (!ValidateExtraPayments()) isValid = false;

    return isValid;
  }

  function CreateTableCell(parent, tag, text, cellClass) {
    const cell = document.createElement(tag);
    cell.textContent = text;
    if (cellClass != "") {
      cell.setAttribute("class", cellClass);
    }
    parent.appendChild(cell);
  }

  function CreateBlockTitle(parent, text) {
    const title = document.createElement("h4");
    title.classList.add("document-block-title");
    title.classList.add("mb-3");
    title.textContent = text;
    parent.appendChild(title);
  }

  function CreateDocumentLine(parent, label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    parent.appendChild(p);
  }

  function CreateDocumentHeader(documentView) {
    const divHeader = document.createElement("div");
    divHeader.setAttribute("class", "document-header row g-3 align-items-center");

    const divBusiness = document.createElement("div");
    divBusiness.setAttribute("class", "col-12 col-md-7");

    const logoUrl = inputEntityLogo.val().trim();
    if (logoUrl != "") {
      const imgLogo = document.createElement("img");
      imgLogo.setAttribute("src", logoUrl);
      imgLogo.setAttribute("alt", "Logo de " + inputEntityName.val().trim());
      imgLogo.setAttribute("class", "document-logo mb-2");
      imgLogo.onerror = function () {
        this.style.display = "none";
      };
      divBusiness.appendChild(imgLogo);
    }

    const businessName = document.createElement("h3");
    businessName.setAttribute("class", "h4 mb-2");
    businessName.textContent = inputEntityName.val().trim();
    divBusiness.appendChild(businessName);

    CreateDocumentLine(divBusiness, "RNC", inputEntityRnc.val().trim());
    CreateDocumentLine(divBusiness, "Teléfono", inputEntityPhone.val().trim());
    CreateDocumentLine(divBusiness, "Correo", inputEntityEmail.val().trim());
    CreateDocumentLine(divBusiness, "Dirección", inputEntityAddress.val().trim());

    const divTitle = document.createElement("div");
    divTitle.setAttribute("class", "col-12 col-md-5 text-md-end");

    const documentTitle = document.createElement("h3");
    documentTitle.classList.add("document-title");
    documentTitle.textContent = selectLoanType.val();

    const documentNumber = document.createElement("p");
    documentNumber.textContent = "No. " + inputQuoteNumber.val().trim();

    divTitle.appendChild(documentTitle);
    divTitle.appendChild(documentNumber);

    divHeader.appendChild(divBusiness);
    divHeader.appendChild(divTitle);
    documentView.appendChild(divHeader);
  }

  function CreateDocumentInformation(documentView) {
    const divRow = document.createElement("div");
    divRow.setAttribute("class", "row g-4 mb-4");

    const divClient = document.createElement("div");
    divClient.setAttribute("class", "col-12 col-md-6");
    CreateBlockTitle(divClient, "Datos del solicitante");
    CreateDocumentLine(divClient, "Nombre", inputClientName.val().trim());
    CreateDocumentLine(divClient, "Identificación", inputClientId.val().trim());
    CreateDocumentLine(divClient, "Teléfono", inputClientPhone.val().trim());
    CreateDocumentLine(divClient, "Correo", inputClientEmail.val().trim());
    CreateDocumentLine(divClient, "Dirección", inputClientAddress.val().trim());
    CreateDocumentLine(
      divClient,
      "Ingreso mensual",
      FormatMoney(GetNumber(inputClientIncome))
    );

    const divDocument = document.createElement("div");
    divDocument.setAttribute("class", "col-12 col-md-6");
    CreateBlockTitle(divDocument, "Datos de la cotización");
    CreateDocumentLine(divDocument, "Tipo de préstamo", selectLoanType.val());
    CreateDocumentLine(divDocument, "Número", inputQuoteNumber.val().trim());
    CreateDocumentLine(divDocument, "Fecha de cotización", FormatDate(inputQuoteDate.val()));
    CreateDocumentLine(divDocument, "Fecha de vencimiento", FormatDate(inputExpirationDate.val()));
    CreateDocumentLine(divDocument, "Estado", selectLoanStatus.val());
    CreateDocumentLine(divDocument, "Moneda", selectLoanCurrency.val());

    divRow.appendChild(divClient);
    divRow.appendChild(divDocument);
    documentView.appendChild(divRow);
  }

  function CreateFinancialConditionsBlock(documentView, engine) {
    const divRow = document.createElement("div");
    divRow.setAttribute("class", "row g-4 mb-4");

    const divCond = document.createElement("div");
    divCond.setAttribute("class", "col-12 col-md-6");
    CreateBlockTitle(divCond, "Condiciones financieras");
    CreateDocumentLine(divCond, "Monto solicitado", FormatMoney(engine.totals.requested));
    CreateDocumentLine(divCond, "Pago inicial", FormatMoney(engine.totals.downPayment));
    CreateDocumentLine(divCond, "Monto financiado", FormatMoney(engine.totals.financed));
    CreateDocumentLine(divCond, "Monto base del préstamo", FormatMoney(engine.totals.baseAmount));
    CreateDocumentLine(divCond, "Tasa de interés anual", FormatPercent(engine.totals.annualRate));
    CreateDocumentLine(divCond, "Tasa de interés mensual", FormatPercent(engine.totals.monthlyRate));
    CreateDocumentLine(divCond, "Plazo en meses", engine.totals.term.toString());
    CreateDocumentLine(divCond, "Fecha del primer pago", FormatDate(inputFirstPaymentDate.val()));
    CreateDocumentLine(divCond, "Tipo de amortización", selectAmortizationType.val());

    const divCharges = document.createElement("div");
    divCharges.setAttribute("class", "col-12 col-md-6");
    CreateBlockTitle(divCharges, "Cargos adicionales y seguro");
    const insText = checkApplyInsurance.is(":checked")
      ? `Sí (${FormatPercent(GetNumber(inputMonthlyInsuranceRate))})`
      : "No";
    CreateDocumentLine(divCharges, "Aplicar seguro", insText);
    CreateDocumentLine(divCharges, "Comisión administrativa", FormatMoney(engine.totals.adminFee));
    CreateDocumentLine(divCharges, "Forma de aplicar comisión", selectAdminFeeType.val());

    divRow.appendChild(divCond);
    divRow.appendChild(divCharges);
    documentView.appendChild(divRow);
  }

  function CreateAmortizationTableBlock(documentView, schedule) {
    CreateBlockTitle(documentView, "Tabla de amortización");

    const divTable = document.createElement("div");
    divTable.setAttribute("class", "table-responsive mb-4");

    const table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-striped align-middle mb-0 table-amortization");

    const thead = document.createElement("thead");
    thead.classList.add("table-primary");
    const headRow = document.createElement("tr");
    CreateTableCell(headRow, "th", "#", "text-center");
    CreateTableCell(headRow, "th", "Fecha de pago", "text-center");
    CreateTableCell(headRow, "th", "Balance inicial", "text-end");
    CreateTableCell(headRow, "th", "Cuota base", "text-end");
    CreateTableCell(headRow, "th", "Capital", "text-end");
    CreateTableCell(headRow, "th", "Interés", "text-end");
    CreateTableCell(headRow, "th", "Seguro", "text-end");
    CreateTableCell(headRow, "th", "Pago extraordinario", "text-end");
    CreateTableCell(headRow, "th", "Cuota total", "text-end");
    CreateTableCell(headRow, "th", "Balance final", "text-end");
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    schedule.forEach((row) => {
      const tableRow = document.createElement("tr");
      CreateTableCell(tableRow, "td", row.installmentNumber, "text-center");
      CreateTableCell(tableRow, "td", row.paymentDate, "text-center");
      CreateTableCell(tableRow, "td", FormatMoney(row.initialBalance), "text-end");
      CreateTableCell(tableRow, "td", FormatMoney(row.baseInstallment), "text-end");
      CreateTableCell(tableRow, "td", FormatMoney(row.principal), "text-end");
      CreateTableCell(tableRow, "td", FormatMoney(row.interest), "text-end");
      CreateTableCell(tableRow, "td", FormatMoney(row.insurance), "text-end");
      CreateTableCell(tableRow, "td", FormatMoney(row.extraPayment), "text-end");
      CreateTableCell(tableRow, "td", FormatMoney(row.totalInstallment), "text-end fw-bold");
      CreateTableCell(tableRow, "td", FormatMoney(row.finalBalance), "text-end fw-bold");
      tbody.appendChild(tableRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    divTable.appendChild(table);
    documentView.appendChild(divTable);
  }

  function CreateDocumentSummaryBlock(documentView, t) {
    const divSummary = document.createElement("div");
    divSummary.classList.add("document-summary");
    CreateBlockTitle(divSummary, "Resumen financiero");

    const table = document.createElement("table");
    table.setAttribute("class", "table table-sm mb-0");
    const tbody = document.createElement("tbody");

    const items = [
      { label: "Cuota estimada inicial", val: FormatMoney(t.initialInstallment) },
      { label: "Total capital pagado", val: FormatMoney(t.totalPrincipal) },
      { label: "Total intereses", val: FormatMoney(t.totalInterest) },
      { label: "Total seguro", val: FormatMoney(t.totalInsurance) },
      { label: "Total pagos extraordinarios aplicados", val: FormatMoney(t.totalExtra) },
      { label: "Total cuotas pagadas", val: FormatMoney(t.totalInstallmentsPaid) },
      { label: "Fecha estimada de finalización", val: t.completionDate },
      { label: "Nivel de endeudamiento", val: `${t.riskLevel} (${FormatPercent(t.dtiRatio)})` },
      { label: "Total general a pagar", val: FormatMoney(t.grandTotal) },
    ];

    items.forEach((item, idx) => {
      const tableRow = document.createElement("tr");
      CreateTableCell(tableRow, "th", item.label, "");
      CreateTableCell(tableRow, "td", item.val, "text-end");
      if (idx === items.length - 1) {
        tableRow.classList.add("table-primary");
        tableRow.classList.add("fs-5");
      }
      tbody.appendChild(tableRow);
    });

    table.appendChild(tbody);
    divSummary.appendChild(table);
    documentView.appendChild(divSummary);
  }

  function CreateDocumentFooter(documentView) {
    const now = new Date();
    const divFooter = document.createElement("div");
    divFooter.classList.add("document-footer");
    divFooter.textContent =
      "Documento generado el " +
      now.toLocaleDateString("es-DO") +
      " a las " +
      now.toLocaleTimeString("es-DO");

    documentView.appendChild(divFooter);
  }

  function BuildDocument(engine) {
    const documentView = document.createElement("div");
    documentView.classList.add("document-view");

    CreateDocumentHeader(documentView);
    CreateDocumentInformation(documentView);
    CreateFinancialConditionsBlock(documentView, engine);
    CreateAmortizationTableBlock(documentView, engine.schedule);
    CreateDocumentSummaryBlock(documentView, engine.totals);
    CreateDocumentFooter(documentView);

    generatedQuoteContainer.empty();
    generatedQuoteContainer.append(documentView);
    generatedQuoteSection.removeClass("d-none");

    $("html, body").animate(
      {
        scrollTop: generatedQuoteSection.offset().top - 20,
      },
      300
    );
  }

  function InputClear(input) {
    input.val("");
    HideError(input);
  }

  function SelectClear(select) {
    select.prop("selectedIndex", 0);
    HideError(select);
  }

  function ResetForm() {
    InputClear(inputEntityName);
    InputClear(inputEntityRnc);
    InputClear(inputEntityPhone);
    InputClear(inputEntityEmail);
    InputClear(inputEntityAddress);
    InputClear(inputEntityLogo);

    InputClear(inputClientName);
    InputClear(inputClientId);
    InputClear(inputClientPhone);
    InputClear(inputClientEmail);
    InputClear(inputClientAddress);
    InputClear(inputClientIncome);

    SelectClear(selectLoanType);
    InputClear(inputQuoteNumber);
    SelectClear(selectLoanStatus);
    InputClear(inputQuoteDate);
    InputClear(inputExpirationDate);
    SelectClear(selectLoanCurrency);

    InputClear(inputRequestedAmount);
    InputClear(inputDownPayment);
    inputFinancedAmount.val("0.00");
    InputClear(inputAnnualRate);
    InputClear(inputLoanTerm);
    InputClear(inputFirstPaymentDate);
    selectAmortizationType.val("Cuota fija");
    HideError(selectAmortizationType);

    checkApplyInsurance.prop("checked", false);
    inputMonthlyInsuranceRate.val("").prop("disabled", true);
    HideError(inputMonthlyInsuranceRate);
    InputClear(inputAdminFee);
    selectAdminFeeType.val("Cobrar como cargo inicial");
    HideError(selectAdminFeeType);

    extraPaymentsContainer.empty();
    extraRowCounter = 0;

    UpdateEngineAndSummary();
  }

  buttonGenerateQuote.on("click", function () {
    if (Validate()) {
      const engine = CalculateEngine();
      if (!engine.isValid || engine.schedule.length === 0) {
        toastr.error(
          "No se puede generar la cotización porque no genera filas en la tabla de amortización.",
          "Error de cálculo",
          { timeOut: 3000 }
        );
        return;
      }

      BuildDocument(engine);
      ResetForm();
      toastr.success("Cotización generada exitosamente.", "Éxito", {
        timeOut: 2500,
      });
    } else {
      toastr.error(
        "Por favor revise los campos con error antes de continuar.",
        "Validación requerida",
        { timeOut: 3000 }
      );
    }
  });

  UpdateEngineAndSummary();
});