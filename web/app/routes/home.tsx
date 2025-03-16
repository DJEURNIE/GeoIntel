import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Open Geo Intel" },
    { name: "description", content: "Welcome to Open Geo Intel" },
  ];
}

export default function Home() {
  return <Welcome />;
}
