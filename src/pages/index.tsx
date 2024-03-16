import { signIn, signOut, useSession, getSession } from "next-auth/react";
import Image from 'next/image'
import { useState } from "react";
import { useEffect } from "react";
import PreviewButton from "../components/PreviewButton";

interface Track {
  id: string
  name: string
  album: {
    name: string
    artists: {
      name: string
    }[]
    images: {
      url: string
    }[]
  }
  preview_url: string
}

export default function Home() {
  const apiCall = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`
      }
    })
    const data = await response.json()
    return data
  }

  const { data: session, status } = useSession()
  const [shortTermTracks, setShortTermTracks] = useState<Track[]>([])
  const [mediumTermTracks, setMediumTermTracks] = useState<Track[]>([])
  const [longTermTracks, setLongTermTracks] = useState<Track[]>([])
  const [artists, setArtists] = useState<Track[]>([])
  const [selectedTerm, setSelectedTerm] = useState<'short_term' | 'medium_term' | 'long_term' | 'artists'>('')
  const trackCss = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4"
  console.log(session, status)

  const getMostListenedToArtists = async () => {
    const data = await apiCall('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=21')
    console.log(data)
  }

  useEffect(() => {
    if (session) {
      void apiCall('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=21')
        .then(data => setShortTermTracks(data?.items))
      void apiCall('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=21')
        .then(data => setMediumTermTracks(data?.items))
      void apiCall('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=21')
        .then(data => setLongTermTracks(data?.items))
      void apiCall('https://api.spotify.com/v1/me/top/artists')
        .then(data => setArtists(data?.items))
    }
  }, [])
    

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-green-400 to-blue-500 min-h-screen">
      {!session && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold text-center">
            Oops...
          </h1>
          <p className="text-center">
            Something went wrong. Please try signing in again.
          </p>
          <button
            className="bg-blue-500 text-white px-4 pb-2 py-2 mt-2 rounded hover:bg-blue-600"
            onClick={() => signIn('spotify')}
          >
            Sign in with Spotify
          </button>
        </div>
      )}
      {session && (
        <div className="flex flex-col items-center justify-center space-y-8 pb-4">
          <div className="flex flex-row items-center justify-center mt-4 space-x-4">
            <h1 className="text-4xl font-bold text-center mt-10 mb-8">
              Hey {session.user.name ?? "there"}, let&#39;s take a look at your top tracks!
            </h1>
            <div className="border border-gray-300 rounded-full h-12 w-12 overflow-hidden">
              <Image
                src={session.user.image ?? ""}
                className="rounded-full h-12 w-12"
                alt="Profile Image"
                width={40}
                height={40}
              />
            </div>
          </div>
          <h2 className="text-2xl text-center animate-pulse font-bold">
            Select a time range:
          </h2>
          <div className="flex space-x-4 justify-center">
            <button
              className={"text-white px-4 py-2 rounded min-w-24 bg-green-700 hover:bg-green-800" + (selectedTerm === 'short_term' ? " bg-green-700" : "")}
              onClick={() => setSelectedTerm('short_term')}
            >
              Recent
            </button>
            <button
              className={"text-white px-4 py-2 rounded min-w-24 bg-green-700 hover:bg-green-800" + (selectedTerm === 'medium_term' ? " bg-green-700" : "")}
              onClick={() => setSelectedTerm('medium_term')}
            >
              Last 6 months
            </button>
            <button
              className={"text-white px-4 py-2 rounded min-w-24 bg-green-700 hover:bg-green-800" + (selectedTerm === 'long_term' ? " bg-green-700" : "")}
              onClick={() => setSelectedTerm('long_term')}
            >
              All time
            </button>
            <button
              className={"text-white px-4 py-2 rounded min-w-24 bg-green-700 hover:bg-green-800" + (selectedTerm === 'artists' ? " bg-green-700" : "")}
              onClick={() => setSelectedTerm('artists')}
            >
              Artist All Time
            </button>
          </div>
          {selectedTerm === 'short_term' && (
            <ul className={trackCss}>
              {shortTermTracks.map(track => (
                <li key={track.id} className="flex flex-col items-center justify-center border-2 border-gray-500 rounded min-h-36 p-2 bg-gradient-to-r from-slate-400 to-slate-700">
                  <h1 className="text-center font-bold text-lg underline underline-offset-4 pb-2">{track.name}</h1>
                  <div className="flex flex-row items-center justify-center w-full pb-2">
                    <Image
                        src={track.album?.images[0]?.url ?? ""}
                        alt="Album Art"
                        placeholder="empty"
                        className="rounded w-1/5"
                        width={36}
                        height={36}
                    />
                    <div className="flex flex-col items-center justify-center w-3/5 truncate overflow-hidden">
                      <p className="">{track.album?.artists[0]?.name}</p>
                      <p className="px-2">{(track.album?.name).length > 20 ? `${(track.album?.name).substring(0, 20)}...` : track.album?.name}</p>
                    </div>
                    <PreviewButton className="w-1/5 justify-center flex flex-col items-center" track={track.preview_url} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {selectedTerm === 'medium_term' && (
            <ul className={trackCss}>
              {mediumTermTracks.map(track => (
                <li key={track.id} className="flex flex-col items-center justify-center border-2 border-gray-500 rounded min-h-36 p-2 bg-gradient-to-r from-slate-400 to-slate-700">
                  <h1 className="text-center font-bold text-lg underline underline-offset-4 pb-2">{track.name}</h1>
                  <div className="flex flex-row items-center justify-center w-full pb-2">
                    <Image
                        src={track.album?.images[0]?.url ?? ""}
                        alt="Album Art"
                        placeholder="empty"
                        className="rounded w-1/5"
                        width={36}
                        height={36}
                    />
                    <div className="flex flex-col items-center justify-center w-3/5 truncate overflow-hidden">
                      <p className="">{track.album?.artists[0]?.name}</p>
                      <p className="px-2">{(track.album?.name).length > 20 ? `${(track.album?.name).substring(0, 20)}...` : track.album?.name}</p>
                    </div>
                    <PreviewButton className="w-1/5 justify-center flex flex-col items-center" track={track.preview_url} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {selectedTerm === 'long_term' && (
            <ul className={trackCss}>
              {longTermTracks.map(track => (
                <li key={track.id} className="flex flex-col items-center justify-center border-2 border-gray-500 rounded min-h-36 p-2 bg-gradient-to-r from-slate-400 to-slate-700">
                  <h1 className="text-center font-bold text-lg underline underline-offset-4 pb-2">{track.name}</h1>
                  <div className="flex flex-row items-center justify-center w-full pb-2">
                    <Image
                        src={track.album?.images[0]?.url ?? ""}
                        alt="Album Art"
                        className="rounded w-1/5"
                        placeholder="empty"
                        width={36}
                        height={36}
                    />
                    <div className="flex flex-col items-center justify-center w-3/5 truncate overflow-hidden">
                      <p className="">{track.album?.artists[0]?.name}</p>
                      <p className="px-2">{(track.album?.name).length > 20 ? `${(track.album?.name).substring(0, 20)}...` : track.album?.name}</p>
                    </div>
                    <PreviewButton className="w-1/5 justify-center flex flex-col items-center" track={track.preview_url} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          {selectedTerm === 'artists' && (
            <div className="grid grid-cols-1 gap-4 px-4 w-prose">
              {artists.map(artist => (
                <div key={artist.id} className="flex flex-col items-center justify-center border-2 border-gray-500 rounded min-h-36 p-2 bg-gradient-to-r from-slate-400 to-slate-700">
                  <h1 className="text-center font-bold text-lg underline underline-offset-4 pb-2">{artist.name}</h1>
                  <div className="flex flex-row items-center justify-center w-full pb-2">
                    <Image
                        src={artist.images[0]?.url ?? ""}
                        alt="Album Art"
                        className="rounded w-1/5"
                        placeholder="empty"
                        width={36}
                        height={36}
                    />
                    <div className="flex flex-row px-2 truncate overflow-hidden w-full">
                      <div className="flex flex-col justify-center truncate overflow-hidden text-left w-full">
                        <p>Genre:</p>
                        <p>Followers:</p>
                        <p>Popularity:</p>
                      </div>
                      <div className="justify-center flex flex-col text-right">
                        <p>{artist.genres[0]}</p>
                        <p>{artist.followers.total}</p>
                        <p>{artist.popularity}</p>
                      </div>
                    </div>
                  </div>
                </div>
          ))}
            </div>
          )}
          <button className="bg-red-500 text-white px-4 pb-2 py-2 rounded hover:bg-blue-600" onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}