import {ApiRickAndMorty} from '../api/rickandmorty.api'
import { Episode } from '../types/episode.type'

export const GetEpisodes = async ({page,filter}:{page:number,filter:string}): Promise<boolean|Episode > => {
    try {
        const result = await ApiRickAndMorty.get('/episode?page='+page+'&name='+filter);
        return result.data;
        
    } catch (error) {
        return false;
    }
}