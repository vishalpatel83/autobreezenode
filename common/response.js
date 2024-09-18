export class ResultModal {
  result = {
    data: {},
    message: "",
    status: 200,
    isSucess: true,
    errormessage: "",
  };
  constructor(data, message, status, isSucess, errormessage) {
    this.result.data = data;
    (this.result.message = message),
      (this.result.status = status),
      (this.result.isSucess = isSucess);
    this.result.errormessage = errormessage;
  }
}
