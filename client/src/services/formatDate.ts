export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const dd = date.getDate().toString().padStart(2, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 because months are 0-indexed
  const yy = date.getFullYear().toString().slice(-2);
  const hrs = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");

  return `${dd}-${mm}-${yy} ${hrs}:${mins}`;
};
