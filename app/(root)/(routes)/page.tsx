import { UserButton } from "@clerk/nextjs";

const Page = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/sign-in"/>
      <h1>Home Page (Procected)</h1>
    </div>
  );
};

export default Page;