import axios from 'axios';
import https from 'https';
import fs from 'fs';
import {resolve} from 'path';

interface Credentials {
  clientID:string|undefined;
  clientSecret:string|undefined;
}

// LER O CERTIFICADO
const certificate = fs.readFileSync(
  resolve(__dirname,`../certs/${process.env.GN_CERT}`)
);

// CRIAR O HTTPSAGENT 
const agent = new https.Agent({
  pfx:certificate,
  passphrase:''
});

// FUNÇÃO PARA FAZER A REQUEST DE AUTENTICAÇÃO
const authenticate = ({clientID, clientSecret}:Credentials) => {
  // CRIANDO AS CREDENCIAIS (clientID:clientSecretID em base64)
  console.log('auth');
  
  const credentials = Buffer.from(
    `${clientID}:${clientSecret}`
  ).toString('base64');
  // CONFIGURANDO O AXIOS P/ A REQUISIÇÃO
  return axios({
    method:'POST',
    url:`${process.env.GN_ENDPOINT}/oauth/token`,
    headers:{
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
      grant_type:'client_credentials'
    }
  });
}

// FUNÇÃO PARA FAZER A REQUEST JÁ AUTENTICADO
const GNRequest = async (credentials:Credentials) => {
  const authResponse = await authenticate(credentials);
  const accessToken = authResponse.data?.access_token;

  return axios.create({
    baseURL:process.env.GN_ENDPOINT,
    httpsAgent:agent,
    headers:{
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

export default GNRequest;
