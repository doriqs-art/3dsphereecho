import dynamic from "next/dynamic";

const OrbitScene = dynamic(() => import("@/components/OrbitScene"), {
  ssr: false,
});

export default function Home() {
  return <OrbitScene />;
}
