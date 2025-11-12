import { me } from "./me";

export default defineEventHandler(async () => {
  console.log(1, me.get().bankDetail);
  return me.get();
});
