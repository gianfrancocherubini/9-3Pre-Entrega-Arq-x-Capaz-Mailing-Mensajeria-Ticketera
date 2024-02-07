import twilio from 'twilio'
const accountSid = 'AC965780b90e0c69d37f015e77c78c4194';
const authToken = '3b71e6008c9891cf80afdd18bf41aeb1';

const client=twilio(accountSid, authToken)

export const enviarWs= (mensaje, numero)=>{
    return client.messages
    .create({
        body: mensaje,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+549'+numero
    })

}