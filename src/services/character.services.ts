import {ApiRickAndMorty} from '../api/rickandmorty.api'
import {Result, CharacterResponse} from '../types/character.type'

export const getAllCharacters = async ({page,filter}:{page:number, filter:string}): Promise<CharacterResponse | boolean> => {
    try {
        const result = await ApiRickAndMorty.get("/character?page="+page+"&name="+filter);
        return result.data
    } catch (error) {
        return false;
    }
}


export const getCharactersByIds = async({ids}:{ids:string}): Promise<Result[] | CharacterResponse | boolean> => {
    try {
       const result = await ApiRickAndMorty.get("/character/"+ids);
       return result.data 
    } catch (error) {
        return false;
    }
}

