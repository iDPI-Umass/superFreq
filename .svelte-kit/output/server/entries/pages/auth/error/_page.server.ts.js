const load = async ({ url }) => {
  const redirectFromParam = url.searchParams.get("redirectFrom");
  return { redirectFromParam };
};
export {
  load
};
