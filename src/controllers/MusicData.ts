import {Request, Response} from "express";
import {DeezerService} from "../services/deezer";
import {YoutubeService} from '../services/youtube'

const youtubeService = new YoutubeService()
const deezerService = new DeezerService()

export class MusicDataController {
 async index(request:Request,response:Response){
	const { videoUrl } = request.query

	if(!videoUrl || typeof videoUrl !== 'string'){
	 return response.status(400)
		.json({error:'Invalid videoUrl'})
	}

	const youtubeResults = await youtubeService.getVideoIdAndTitle(videoUrl)
	const deezerResults = await deezerService.searchMusic(youtubeResults.generatedMusicName)

	return response.send({
	 videoId:youtubeResults.videoId,
	 musicSearched:youtubeResults.generatedMusicName,
	 musics:deezerResults.musics,
	 next:deezerResults.next
	})
 }
 async next(request:Request, response:Response){
	const { searchQuery, next:nextString } = request.query

	if(!searchQuery || typeof searchQuery !== 'string'){
	 return response.status(400)
		.json({error:'Invalid searchUrl'})
	}
	if(!nextString || typeof nextString !== 'string'){
	 return response.status(400)
		.json({error:'Invalid nextString'})
	}
	const next = parseInt(nextString)
	if(!next){
	 return response.status(400)
		.json({error:'Invalid next'})
	}

	const deezerResults = await deezerService.searchMusicNext(searchQuery, next)
	return response.send({
	 musicSearched:searchQuery,
	 musics:deezerResults.musics,
	 next:deezerResults.next
	})

 }
 async getPlayerUrl(request:Request,response:Response){
	const { videoId } = request.query
	if(!videoId || typeof videoId !== 'string'){
	 return response.status(400)
		.json({error:'Invalid videoId'})
	}
	const playerUrl = await youtubeService.getMusicPlayUrl(videoId)
	return response.redirect(playerUrl)
 }
}

