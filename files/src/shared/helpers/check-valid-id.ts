export const isValidICNumber = (icnumber: string) => /^\d{12,13}$/.test(icnumber);

export const isValidPassportNumber = (passportNumber: string) =>
  /^(?!^0+$)[a-zA-Z0-9]{6,9}$/.test(passportNumber);

export const checkValidMongoId = (id: string) => /^\S{24}$/.test(id);

export const isValidMesra = (mesraNumber: string) => /^\d{17}$/.test(mesraNumber);
