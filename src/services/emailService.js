import emailjs from '@emailjs/browser';

// Substitua pelas suas chaves do EmailJS
const SERVICE_ID = "service_lzz2c4j";
const TEMPLATE_ID = "template_3y5yl7i";
const PUBLIC_KEY = "qLYAG003Qemi1ZyUa";

export const enviarEmailVencimento = async (titulo, valor, data) => {
  const templateParams = {
    titulo: titulo,
    valor: valor,
    data: data,
    to_email: "bvieira.fabricio@gmail.com", // Para quem o aviso será enviado
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("E-mail enviado com sucesso!", response.status, response.text);
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
};