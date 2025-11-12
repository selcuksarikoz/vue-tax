import { ref } from "vue";
import { useAsyncData } from "#app";
import type * as z from "zod";

import { meSchema } from "~/schemas/me.schema";

/**
 * useMe composable provides methods to fetch and update user data from /api/me.
 * It uses Nuxt's useAsyncData for SSR and client-side caching, and imports the Zod schema for validation.
 * This avoids code duplication and ensures consistent validation between frontend and backend.
 */
export function useMe() {
  // Fetch user data once and cache it
  const { data, error, refresh } = useAsyncData("me", () => $fetch("/api/me"));
  const loading = ref(false);

  /**
   * Updates user data by sending a PUT request to /api/me.
   * Only the relevant section should be sent (e.g., personal, bankDetail, tax, insurance).
   * @param payload Partial user data to update
   * @returns Promise with success/error
   */
  async function updateMe(payload: Partial<z.infer<typeof meSchema>>) {
    loading.value = true;
    try {
      // Validate payload with Zod schema
      meSchema.partial().parse(payload);
      await $fetch("/api/me", {
        method: "PUT",
        body: payload,
      });
      await refresh();
      return { success: true };
    } catch (e: unknown) {
      if (e && typeof e === "object" && "errors" in e) {
        return { success: false, error: (e as { errors: unknown }).errors };
      }
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    error,
    loading,
    refresh,
    updateMe,
  };
}
