export const allowOnlyNumber = (e) => {
  if (['Backspace', 'Tab'].includes(e.key) || /[0-9]/.test(e.key)) {
    return;
  }

  e.preventDefault();
};
