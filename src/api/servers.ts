import { app } from '@app/express'

export let Systems = {}
export let Games = {}


app.get('/server/*', (req, res) => res.json(Systems[req.params[0]]))
app.get('/game/*', (req, res) => res.json(Games[req.params[0]]))