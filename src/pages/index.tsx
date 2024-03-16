import { signIn, signOut, useSession, getSession } from "next-auth/react";
import Image from 'next/image'
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession()
  console.log(session, status)

  const apiCall = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`
      }
    })
    const data = await response.json()
    console.log(data)
  }

  useEffect(() => {
    if (session) {
      apiCall()
    }
  }, [session])
    

  return (
    <>
      {!session && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold text-center">
            Oops...
          </h1>
          <p className="text-center">
            Something went wrong. Please try again.
          </p>
        </div>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <div className="border border-gray-300 rounded-full h-20 w-20 overflow-hidden">
            <Image
              src={session.user.image ?? ""}
              className="rounded-full h-20 w-20"
              alt="Profile Image"
              width={40}
              height={40}
            />
          </div>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
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