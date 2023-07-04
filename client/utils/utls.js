export const getIdNumber = ({ updatedAt, pid, id }) => {
  const prefix = "AEC";
  const year = new Date(updatedAt).getFullYear().toString().substring(1);
  return `${prefix}${pid}${year}ID${id}`;
};
