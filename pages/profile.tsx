import React from "react";
import getOneUser from "../lib/helpers/userHelpers/getOneUser";
import Head from "next/head";
import Error from "next/error";
import UserProfile from "../components/Profile/UserProfile";
import { getSession } from "next-auth/react";

const Profile: React.FC<{ userProfile: object; status: number; message: string }> = (props) => {
  if (props.status > 300) {
    return <Error statusCode={props.status} title={props.message} />;
  }
  return (
    <div>
      <Head>
        <title>User Profile</title>
        <meta name="description" content="User Profile Page" />
      </Head>
      <UserProfile userProfile={props.userProfile} />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);
  if (session === null || session.role === "admin" || !!Number(session.id) === true) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const userResult = await getOneUser(session?.id);
  
  // Ensure all values are defined and serializable - convert to array for UserProfile component
  const userData = userResult?.body && typeof userResult.body === 'object' ? userResult.body : null;
  const userProfile = userData ? JSON.parse(JSON.stringify([userData])) : []; // Convert to array for UserProfile component
  const status = typeof userResult?.status === 'number' ? userResult.status : 400;
  const message = typeof userResult?.message === 'string' ? userResult.message : '';

  return {
    props: { userProfile: JSON.parse(JSON.stringify(userProfile)), status, message },
  };
}

export default Profile;
