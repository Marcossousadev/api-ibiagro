
import {resend} from '../../config/resend-config';

export async function sendEmailVerificationCode(to: string, fullName:string, code: string, expiresAt: Date, date:Date | string) {
try{
  const {data, error}  = await resend.emails.send({
    from: 'Ibiagro <onboarding@resend.dev>',
    to,
    subject:'Seu código de verificação - Ibiagro',
    html:`
      <div style="font-family: sans-serif; padding: 10px;">
      <h1>Olá, ${fullName}</h1>
        <h2>Código de Verificação</h2>
        <h3>Use o código abaixo para confirmar seu e-mail:</h3>
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
        <h3>${date}</h3>
        <h3 style="font-weight: bold;">Ir para o site confirmar email!</h3>
        <button style="
        background-color: #2bba4aff;
        color: #ffffff;
        border-width: 1px; 
        padding: 15px;
        border-radius: 10px;
        margin-left: 10px;
        margin-right: 10px;
        ">Confirmar Email</button>
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
throw new Error("Errono envio do email de verificação!")
}
}