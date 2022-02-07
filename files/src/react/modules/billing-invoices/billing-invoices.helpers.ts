export const useMalaysiaTime = (time: Date) => {
  return new Date(time).toLocaleString('en-US', {timeZone: 'Asia/Kuala_Lumpur'});
};
