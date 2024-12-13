import emailjs from "emailjs-com";

export const sendEmail = async (pdfBlob, formData) => {
  // const emailData = new FormData();
  // emailData.append("file", pdfBlob, "Attachment.pdf");
  // emailData.append("to_email", "thamaltw97@outlook.com");
  // emailData.append("subject", `W/O # ${formData.workOrder} - New Order Intake - Supply & Install`);
  // emailData.append("body", JSON.stringify(formData, null, 2));

  // try {
  //   await emailjs.sendForm(
  //     "centra-code-quiz-thamal",
  //     "template_aur7wgu",
  //     emailData,
  //     "user_JAXjiDVYXIrN8QkwDNmWG"
  //   );
  // } catch (error) {
  //   console.log("Email error: " + error);
  // }

  // emailjs.sendForm('centra-code-quiz-thamal', 'template_aur7wgu', e.target, 'user_JAXjiDVYXIrN8QkwDNmWG')
  //   .then((result) => {
  //     console.log(result.text);
  //   }, (error) => {
  //     console.error(error.text);
  //   });

  await emailjs.send('centra-code-quiz-thamal', 'template_aur7wgu', {
    to_name: 'Thamal',
    to_email: 'thamaltw97@outlook.com',
    message: 'Message will come here',
  },
  'user_JAXjiDVYXIrN8QkwDNmWG',
  [
    {
      content: pdfBlob,
      filename: 'Attachment.pdf',
    },
  ])
  .then((result) => {
      console.log(result.text);
  }, (error) => {
      console.error(error.text);
  });

};
