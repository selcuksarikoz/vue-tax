import { ref } from "vue"
import type * as z from "zod"
import { meSchema } from "~/schemas/me.schema"

/**
 * Type definitions for schema validation
 */
type SchemaKey = keyof z.infer<typeof meSchema>

/**
 * useFormValidation composable provides schema-based validation for form data.
 * It allows validating specific sections of the form or the entire payload
 *
 * Usage:
 * ```typescript
 * const { validatePayload } = useFormValidation()
 *
 * // Validate specific section
 * const result = await validatePayload('bankDetail', formData.bankDetail)
 * if (!result.success) console.error(result.errors)
 *
 * // Validate entire payload
 * const fullResult = await validatePayload(null, fullFormData)
 * ```
 */
export function useFormValidation() {
  const validationError = ref<string | null>(null)

  /**
   * Validates payload against schema for specific key or entire schema.
   *
   * @param schemaKey - The key to validate (e.g., 'bankDetail', 'tax', 'insurance').
   *                    If null, validates entire payload against full schema.
   * @param payload - The data to validate
   * @returns Object with success flag and errors array (if validation fails)
   */
  async function validatePayload(
    schemaKey: SchemaKey | null,
    payload: unknown
  ): Promise<{
    success: boolean
    errors?: Array<{ path: string; message: string }>
  }> {
    try {
      validationError.value = null

      // If no specific key, validate entire payload against full schema
      if (schemaKey === null) {
        meSchema.partial().parse(payload)
        return { success: true }
      }

      // Get the specific schema for the key
      const schemaForKey = meSchema.shape[schemaKey]

      if (!schemaForKey) {
        validationError.value = `Invalid schema key: ${schemaKey}`
        return {
          success: false,
          errors: [
            { path: schemaKey, message: `Invalid schema key: ${schemaKey}` },
          ],
        }
      }

      // Validate the specific section with partial schema
      // This allows nested object validation (e.g., bankDetail, tax, insurance)
      ;(schemaForKey as z.ZodSchema).partial().parse(payload)

      return { success: true }
    } catch (error: unknown) {
      // Handle Zod validation errors
      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error as z.ZodError
        const formattedErrors = zodError.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }))

        validationError.value = formattedErrors
          .map((e) => `${e.path}: ${e.message}`)
          .join(", ")

        return {
          success: false,
          errors: formattedErrors,
        }
      }

      // Handle other errors
      const errorMessage =
        error instanceof Error ? error.message : "Unknown validation error"
      validationError.value = errorMessage

      return {
        success: false,
        errors: [{ path: "unknown", message: errorMessage }],
      }
    }
  }

  /**
   * Clears validation errors.
   */
  function clearErrors() {
    validationError.value = null
  }

  return {
    validationError,
    validatePayload,
    clearErrors,
  }
}
