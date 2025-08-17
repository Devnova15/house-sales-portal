const validator = require("validator");

class FormValidator {
  constructor(validations) {
    this.validations = validations;
  }

  validate(data) {
    let validation = this.valid();
    validation.errors = {};

    this.validations.forEach(rule => {
      // Check if the field exists in the data object
      if (data[rule.field] === undefined) {
        // Skip validation for fields that don't exist in the data object
        return;
      }

      const field_value = data[rule.field].toString();
      const args = rule.args || [];
      const validation_method =
        typeof rule.method === "string" ? validator[rule.method] : rule.method;

      if (validation_method(field_value, ...args, data) !== rule.validWhen) {
        validation.errors = {
          ...validation.errors,
          [rule.field]: rule.message
        };
        validation.isValid = false;
      }
    });

    return validation;
  }

  valid() {
    return { isValid: true };
  }

  static checkValidity(formValidationRules, currentFormInputTypes) {
    const chosenValidationRules = formValidationRules.filter(rule =>
      currentFormInputTypes.includes(rule.field)
    );

    return chosenValidationRules;
  }

  static isEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  }
}

module.exports = FormValidator;
