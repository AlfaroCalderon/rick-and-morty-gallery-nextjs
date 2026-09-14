import {ApiRickAndMorty} from '../api/rickandmorty.api'
import { Episode, EpisodeResponse } from '../types/episode.type'

export const GetEpisodes = async ({page,filter}:{page:number,filter:string}): Promise<EpisodeResponse | boolean> => {
    try {
        const result = await ApiRickAndMorty.get('/episode?page='+page+'&name='+filter);
        return result.data;
        
    } catch (error) {
        return false;
    }
}

