import type { Metadata } from "next";
import { QuizForm } from "@/components/quiz/QuizForm";
import { getAllProducts } from "@/utils/products";

export const metadata: Metadata = {
  title: "Health Quiz",
  description: "A quick quiz to recommend the best millet or peanut powder for your age group and goals."
};

export default async function QuizPage() {
  const products = await getAllProducts();
  return (
    <div className="container-prose py-10">
      <h1 className="text-3xl font-black tracking-tight text-neutral-900">Health Recommendation Quiz</h1>
      <p className="mt-2 text-sm text-neutral-700">Find your best-fit powder in under a minute.</p>
      <div className="mt-8">
        <QuizForm products={products} />
      </div>
    </div>
  );
}


