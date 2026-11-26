"use client";
import { signIn, signOut } from "next-auth/react";

// klasa: stili i butonit (parazgjedhja "action"; te paneli "dil-btn").
export default function Hyrja({ brenda, klasa = "action" }: { brenda: boolean; klasa?: string }) {
  return brenda
    ? <button className={klasa} onClick={() => signOut({ callbackUrl: "/panel" })}>Log out</button>
    : <button className={klasa} onClick={() => signIn("github", { callbackUrl: "/panel" })}>Sign in with GitHub</button>;
}