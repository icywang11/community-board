import { EditorialBoard } from "@/components/board/editorial-board";
import { weeks } from "@/lib/data";

export default function Home() {
  return <EditorialBoard weeks={weeks} />;
}
