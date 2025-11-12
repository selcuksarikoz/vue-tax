import { me } from "./me";

export default defineEventHandler(async () => {
  return me.get();
});
