import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);

  const { data: session } = useSession();

  if (!session) {
    return (
      <div
        className={
          "bg-gray-200 w-screen h-screen flex items-center flex-col justify-center"
        }
      >
        <div className="">
          <p>pabin limbu</p>
        </div>
        <div className="w-full text-center">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg "
          >
            Sign in with google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="block md:hidden flex items-center p-4 ">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex ">
        <Nav show={showNav} />
        <div className="flex-grow  p-4">{children}</div>
      </div>
    </div>
  );
}
