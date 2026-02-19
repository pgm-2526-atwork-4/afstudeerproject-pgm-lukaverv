import { defineRule } from "vee-validate";
import { required, email, min, max } from "@vee-validate/rules";

// Define validation rules with custom messages
export const setupValidationRules = () => {
  defineRule("required", (value: any) => {
    if (!required(value)) {
      return "This field is required";
    }
    return true;
  });

  defineRule("email", (value: any) => {
    if (!email(value)) {
      return "Please enter a valid email address";
    }
    return true;
  });

  defineRule("min", (value: any, [limit]: any) => {
    if (!min(value, [limit])) {
      return `This field must be at least ${limit} characters`;
    }
    return true;
  });

  defineRule("max", (value: any, [limit]: any) => {
    if (!max(value, [limit])) {
      return `This field must not exceed ${limit} characters`;
    }
    return true;
  });
};
