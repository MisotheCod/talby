"use client";
import TalbyPage from "@/components/talby-app/TalbyPage";

export default function HomePage() {
  return <TalbyPage board="SHome" props={{ view: "sample", plan: "active" }} look={null} />;
}
