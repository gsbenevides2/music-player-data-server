import axios, {AxiosInstance} from 'axios'

interface DeezerSearchResult {
 data: Array<{
	id: number
	readable: boolean
	title: string
	title_short: string
	title_version: string
	link: string
	duration: number
	rank: number
	explicit_lyrics: boolean
	explicit_content_lyrics: number
	explicit_content_cover: number
	preview: string
	md5_image: string
	artist: {
	 id: number
	 name: string
	 link: string
	 picture: string
	 picture_small: string
	 picture_medium: string
	 picture_big: string
	 picture_xl: string
	 tracklist: string
	 type: string
	}
	album: {
	 id: number
	 title: string
	 cover: string
	 cover_small: string
	 cover_medium: string
	 cover_big: string
	 cover_xl: string
	 md5_image: string
	 tracklist: string
	 type: string
	}
	type: string
 }>
	total: number
 next?: string
}

interface IMusic {
 id:number
 name:string
 artist:{
	id:number
	name:string
	cover:string
 }
 cover:string
}
interface DeezerServciceInterface {
 _api: AxiosInstance
 searchMusic(searchQuery:string):Promise<{
	musics:IMusic[],
	next?:number
 }>
	searchMusicNext(searchQuery:string, next:number):Promise<{
	musics:IMusic[],
	next?:number
 }>
}

export class DeezerService implements DeezerServciceInterface {
 _api = axios.create({
	baseURL:'https://api.deezer.com'
 })

 async searchMusic(searchQuery:string){
	const {data: deezerApiResults} = await this._api.get<DeezerSearchResult>('/search',{params:{q:searchQuery}})
	
	const musics = deezerApiResults.data.map(music=>{
	 return {
		id:music.id,
		name:music.title,
		artist:{
		 id:music.artist.id,
		 name:music.artist.name,
		 cover:music.artist.picture_xl
		},
		cover:music.album.cover_xl
	 }
	})

	let next
	if(deezerApiResults.next){
	 const nextUrl = new URL(deezerApiResults.next)
	 const nextString = nextUrl.searchParams.get("next")
	 next = nextString ? parseInt(nextString) : undefined
	}

	return {
	 musics,
	 next,
	}
 }
 
 async searchMusicNext(searchQuery:string, next:number){
	const {data: deezerApiResults} = await this._api.get<DeezerSearchResult>('/search',{params:{q:searchQuery, next}})
	
	const musics = deezerApiResults.data.map(music=>{
	 return {
		id:music.id,
		name:music.title,
		artist:{
		 id:music.artist.id,
		 name:music.artist.name,
		 cover:music.artist.picture_xl
		},
		cover:music.album.cover_xl
	 }
	})

	let newNext
	if(deezerApiResults.next){
	 const nextUrl = new URL(deezerApiResults.next)
	 const nextString = nextUrl.searchParams.get("next")
	 newNext = nextString ? parseInt(nextString) : undefined
	}

	return {
	 musics,
	 next:newNext,
	}
 }
}
