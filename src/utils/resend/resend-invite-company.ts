
import {resend} from '../../config/resend-config';

export async function sendEmailInviteCodeCompany(to: string, fullName:string, nameCompany: string, code: string, expiresAt: Date, date:Date | string, message: string) {
try{
  const {data, error}  = await resend.emails.send({
    from: 'Fit Pro <onboarding@resend.dev>',
    to,
    subject:'Seu código de convite da Empresa',
    html:`
      <div style="font-family: sans-serif; padding: 10px;">
      <h1>Somos a empresa, ${nameCompany}</h1>
      <h1>Olá, ${fullName}</h1>
        <h2>Código de Convite</h2>
        <h3>${message}</h3>
        <p style="
          font-size: 28px;
          font-weight: bold;  
          letter-spacing: 4px;
          background-color: #f0f0f0; 
          padding: 10px 20px;
          display: inline-block;
          border-radius: 5px;
          user-select: all;
        ">${code}</p>
        <h3>Este código é válido até <strong>${expiresAt.toLocaleString('pt-BR')}</strong>.</h3>
        <p>Seu status de confirmação está pendente!</p>
        <h3>${date}</h3>
        <p style=" font-weight: bold;">Se você não solicitou este código, ignore este e-mail.</p> 
      </div>
    `,
  });

  if(error) {
  console.log("Erro do resend", error);
  throw new Error("Erro no envio do email de verificação por parte do Resend!")
  }
}
catch(error){
  console.log("Erro ao enviar email", error)
throw new Error("Erro no envio do email de convite!")
}
}