import { signIn, signOut, useSession, getSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession()
  return (
    <>
      {!session && (
        <>
        {/* if user isn't signed in, redirect to sign in page */}
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as you <br />
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