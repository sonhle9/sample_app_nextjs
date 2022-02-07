export const useMalaysiaTime = (date: Date) => {
  return new Date(
    new Date(date).toLocaleString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
    }),
  );
};

export const convertDate2MalayTime = (date: Date) => {
  return new Date(
    new Date(date).toLocaleString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
    }),
  );
};
