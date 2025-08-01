import GetStartedButton from "@/components/GetStartedButton";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="flex items-center justify-center flex-col gap-8">
          <div className="flex justify-center gap-6 flex-col items-center">
            <h1 className="text-6xl font-bold text-center">Welcome to Collab Board</h1>
            <p className="text-center">Start collabing and getting tasks done!</p>
          </div>
          <GetStartedButton />
          <div className="flex items-center justify-center flex-col gap-1">
            <small>Created by</small>
            <Button variant="secondary" className="flex items-center justify-center text-black">
              <Link href="https://github.com/milljo3/collab-board" className="flex items-center gap-1">
                <Image src="/githubpfp.png" alt="GitHub Profile Picture" width="25" height="25" />
                <p>@milljo3</p>
                <Image src="/github.svg" alt="GitHub Icon" width="25" height="25" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
  )
}