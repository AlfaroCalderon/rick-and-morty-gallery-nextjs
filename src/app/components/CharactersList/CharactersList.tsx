'use client'
import React from 'react'
import Image  from 'next/image'
import {useQuery} from '@tanstack/react-query'
import {getAllCharacters} from '@/services/character.services'
import {Loader} from '../Loader/Loader'
import {ArrowRight, ArrowLeft, Search, X} from 'lucide-react'
import ReactPaginate from 'react-paginate';


export const CharactersList = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const data = useQuery({
    queryKey:['characters', currentPage, searchTerm], 
    queryFn: () => getAllCharacters({ page: currentPage, filter: searchTerm }),
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: 1
  })
  
  return (
    <>
    {data.isLoading && !data.data ? ( 
      <main className=' w-full min-h-screen py-8 flex justify-center items-start'>
          <div className="bg-white flex flex-col w-full md:w-[80%] lg:w-[80%] p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
            <div className="flex justify-center items-center h-dvh">
              <Loader />
            </div>
          </div>
      </main>
    ) : (
      <main className=' w-full min-h-screen py-8 flex justify-center items-start'>
      <div className='bg-white flex flex-col w-full md:w-[80%] lg:w-[80%] p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out'>
        
        {/* Search Bar */}
        <div className='mb-6 sticky top-0 z-10 py-4'>
          <div className='relative w-full max-w-md mx-auto'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search characters for names...'
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

        {/* Characters Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 justify-items-center'>
          {typeof data.data !== 'boolean' && data.data?.results?.map( (character: {image: string, name: string, status: string, species: string, gender: string, location: {name: string}}, idx:number)  => (
            <div key={idx} className='bg-gray-200 w-full md:w-64 lg:w-[300px] rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-500 ease-in-ou border-2 border-blue-300 hover:border-blue-500'>
              <div className='w-full h-64 overflow-hidden relative'>
               <Image 
                  src={character.image} 
                  width={320} 
                  height={320} 
                  alt={character.name} 
                  priority={idx < 6}
                  className='w-full h-full object-cover' />
              </div>
              <div className='p-4 w-full flex flex-col gap-2'>
                <span className='text-center text-2xl'><b>{character.name}</b></span>
                <span><b>Status: </b>{character.status}</span>
                <span><b>Species: </b>{character.species}</span>
                <span><b>gender: </b>{character.gender}</span>
                <span><b>Location: </b>{character.location.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="w-full flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
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

      </div>
      </main>
      )}
    </>
  )
}

