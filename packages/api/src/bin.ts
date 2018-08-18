import 'perish'
import './env'
import { Service } from './index'
async function start () {
  var service = new Service()
  await service.start({})
}
start()
