import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const SignInBtn = () => {
  return <Button variant={"secondary"}>Login</Button>;
};

export default function TopBar({ userName }: { userName: string }) {
  return (
    <header className="bg-gray-800 py-2 px-6 flex justify-between items-center">
      <h2 className="font-bold text-white ">TOFORGET</h2>
      <div className="flex gap-6">
        <div className="flex flex-col text-white text-xs">
          <p>Olá! {userName} 👋</p>
          <p>Seja bem-vindo(a)</p>
        </div>
        <SignedOut>
          <SignInButton>
            <SignInBtn />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
