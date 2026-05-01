import { ZodError } from "zod";

/**
 * Generic validation middleware factory.
 * Pass a Zod schema — it parses req.body and replaces it with the
 * validated (and coerced/defaulted) result, or returns a 400.
 */
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: fieldErrors,
      });
    }

    next(error);
  }
};

export default validate;
