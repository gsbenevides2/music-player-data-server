import {Router} from 'express'
import {MusicDataController} from './controllers/MusicData'

const routes = Router()

const musicDataController = new MusicDataController()

routes.get('/musicData', musicDataController.index)
routes.get('/musicData/next', musicDataController.next)
routes.get('/getPlayer', musicDataController.getPlayerUrl)

export default routes
