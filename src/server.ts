import 'dotenv/config';

import express, { Request,Response } from "express";
import GNRequest from './api/gerencianet'

const app = express();

app.use(express.json());

const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET
});

app.get('/charge', async (req:Request, res:Response) => {

  const reqGN = await reqGNAlready;
  const charge = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: '0.10'
    },
    chave: '9faa5180-378a-429b-8129-9c8f6adf0b4e', //chave pix que receberá a transação
    solicitacaoPagador: 'Cobrança dos serviços prestados.'
  };
  
  const chargeResponse = await reqGN.post('/v2/cob', charge);

  return res.json(chargeResponse.data)
})
app.get('/charge/show', async (req:Request, res:Response) => {

  const reqGN = await reqGNAlready;
  const charge = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: '0.10'
    },
    chave: '9faa5180-378a-429b-8129-9c8f6adf0b4e', //chave pix que receberá a transação
    solicitacaoPagador: 'Cobrança dos serviços prestados.'
  };
  
  const chargeResponse = await reqGN.post('/v2/cob', charge);
  const chargeFind = await reqGN.get(`/v2/cob/${chargeResponse.data.txid}`)
  return res.json(chargeFind.data)
})
app.get('/charge/qrcode', async (req:Request, res:Response) => {

  const reqGN = await reqGNAlready;
  const charge = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: '0.10'
    },
    chave: '9faa5180-378a-429b-8129-9c8f6adf0b4e', //chave pix que receberá a transação
    solicitacaoPagador: 'Cobrança dos serviços prestados.'
  };
  
  const chargeResponse = await reqGN.post('/v2/cob', charge);
  const qrcode = await reqGN.get(`/v2/loc/${chargeResponse.data.loc.id}/qrcode`)
  return res.json(qrcode.data)
})
app.get('/charge/list', async(req,res)=> {
  const reqGN = await reqGNAlready;

  const response = await reqGN.get('/v2/cob?inicio=2021-06-22T16:01:35Z&fim=2021-06-23T20:10:00Z')

  return res.json(response.data)
})

app.listen(3333,() => console.log('running on port 3333'));
