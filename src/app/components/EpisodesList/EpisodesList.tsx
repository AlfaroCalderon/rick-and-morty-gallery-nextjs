import React, { useEffect, useMemo } from 'react'
import Image  from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { GetEpisodes } from '@/services/episodes.services'
import { getCharactersByIds } from '@/services/character.services'
import { Episode } from '@/types/episode.type'
import { Result } from '@/types/character.type'
import { Loader } from '../Loader/Loader'
import { Search, X, ArrowRight, ArrowLeft } from 'lucide-react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import ReactPaginate from 'react-paginate'

export const EpisodesList = () => {
   const [isOpen, setIsOpen] = React.useState(false)
   const [currentPage, setCurrentPage] = React.useState(1);
   const [searchTerm, setSearchTerm] = React.useState('');
   const data = useQuery({ queryKey: ['episode',currentPage,searchTerm], queryFn: () => GetEpisodes({page: currentPage, filter: searchTerm}), 
   staleTime: 5000, 
   placeholderData: (previousData) => previousData, 
   refetchOnWindowFocus: false, 
   retry: 1 });

   const idlist = useMemo(() => {
    let result = typeof data.data !== 'boolean' && data.data?.results;
    if (!result) return [];
    
    const ids:number[] = [];
    result.forEach((episode:Episode) => {
        episode.characters.forEach((character:string) => {
            const raw = character.split('/').pop();
            const id = raw ? parseInt(raw) : null;
            if( id && !ids.includes(id)){
                ids.push(id);
            }
        })
    });

    return ids;
   }, [data.data]);

      const characterIds = idlist.join(',');
      const CharacterData = useQuery({ queryKey: ['characters', characterIds], queryFn: () => getCharactersByIds({ids: characterIds}),
      staleTime: 5000, 
      placeholderData: (previousData) => previousData, 
      refetchOnWindowFocus: false, 
      retry: 1 }); 

  
    const [characterSelectedID, setcharacterSelectedID] = React.useState<number | null>(null);
  // don't shadow the imported service name — use a different handler name
     const handleSelectCharacter = (id:number) => {
        setcharacterSelectedID(id);
     }

  return (
    <>
    {data.isLoading && !data.data ? (
      <main className='w-full min-h-screen py-8 flex justify-center items-start'>
        <div className="bg-white flex flex-col w-full md:w-[80%] lg:w-[80%] p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex justify-center items-center h-dvh">
        <Loader />
        </div>
        </div>
      </main>
      ) : (
      <main className='w-full min-h-screen py-8 flex justify-center items-start'>
      <div className="bg-white flex flex-col w-full md:w-[80%] lg:w-[80%] p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
        {/* Search Bar */}
        <div className='mb-6 sticky top-0  z-10 py-4'>
          <div className='relative w-full max-w-md mx-auto'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search episodes for names...'
              className='block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm shadow-md'
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600 transition-colors'
              >
                <X className='h-5 w-5 text-gray-400 hover:text-gray-600' />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className='text-sm text-gray-500 text-center mt-2'>
              Searching for "{searchTerm}"
            </p>
          )}
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {typeof data.data !== 'boolean' && data.data?.results?.map((episode:Episode, idx:number) => (
            <div key={idx} className="border-2 border-purple-300 rounded-xl shadow-lg p-6 bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold mb-2 truncate text-purple-900">{episode.name}</h3>
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">{episode.episode}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              <strong>Air Date:</strong> <span className="ml-1">{episode.air_date}</span>
            </p>
            <div className="bg-purple-100 rounded-lg p-4">
              <strong className="text-sm text-purple-900 block mb-3">Characters:</strong>
              <ul className="text-sm text-gray-700 space-y-2">
                {episode.characters.map((character:string, idx:number) => (
                <li key={idx} className="flex items-center justify-between gap-3 p-2 bg-white rounded-lg hover:bg-purple-50 transition-colors">
                  {
                    (() => {
                      const raw = character.split('/').pop();
                      const id = raw ? parseInt(raw, 10) : NaN;

                      // handle both array response or { results: Character[] } shape
                      const list = Array.isArray(CharacterData.data) ? CharacterData.data : (typeof CharacterData.data !== 'boolean' ? CharacterData.data?.results : undefined);
                      const char = list?.find((c: Result) => c.id === id);
                        return char ? (
                        <span onClick={() => { handleSelectCharacter(id);   setIsOpen(true);}} className="font-semibold text-gray-800 truncate flex-1 cursor-pointer hover:text-purple-600 transition-colors">
                          {char.name}
                        </span>
                        ) : null;
                    })()
                  }
                  <span className="text-xs text-gray-400 flex-shrink-0">✓</span>
                </li>
                ))}
              </ul>
            </div>
            </div>
        ))}
      </div>
      {/* Pagination */}
        <div className="w-full flex items-center justify-center border-t rounded-2xl border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<ArrowRight />}
            onPageChange={(event) => {
              setCurrentPage(event.selected + 1);
            }}
            pageRangeDisplayed={5}
            pageCount={typeof data.data !== 'boolean' && data.data?.info?.pages || 1}
            previousLabel={<ArrowLeft />}
            forcePage={currentPage - 1}
            disableInitialCallback={true}
            previousLinkClassName="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            nextLinkClassName="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            breakLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
            renderOnZeroPageCount={null}
            containerClassName="flex gap-1 isolate inline-flex -space-x-px rounded-md shadow-sm"
            pageLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
            activeLinkClassName="z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />  
        </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 transition-opacity duration-300" style={{opacity: isOpen ? 1 : 0}}>
          <DialogPanel transition className="max-w-lg space-y-4 border-2 border-blue-900 hover:border-2 hover:border-blue-400 bg-white p-12 rounded-2xl duration-300 ease-out shadow-lg data-closed:transform-[scale(95%)] data-closed:opacity-0">
        {CharacterData.data && (() => {
          const list = Array.isArray(CharacterData.data) ? CharacterData.data : (typeof CharacterData.data !== 'boolean' ? CharacterData.data?.results : undefined);
          const character = list?.find((c: Result) => c.id === characterSelectedID);
          return character ? (
            <>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">{character.name}</DialogTitle>
              <div className="space-y-4">
          {character.image && (
            <div className="flex justify-center">
              <Image
                src={character.image}
                alt={character.name}
                width={200}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-600">Species</p>
              <p className="text-lg text-gray-900">{character.species}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Gender</p>
              <p className="text-lg text-gray-900">{character.gender}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-600">Location</p>
              <p className="text-lg text-gray-900">{character.location?.name}</p>
            </div>
          </div>
              </div>
            </>
          ) : null;
        })()}
        <div className="flex gap-4">
          <button onClick={() => setIsOpen(false)} className='bg-red-600 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white text-white cursor-pointer'>Close</button>
        </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
    </main>
      )}
    
    </>
  )
}

