import { me } from "./me";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = await me.update(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.message,
      statusMessage: "Bad Request",
      stack: "error",
    });
  }

  return result.data;
});
