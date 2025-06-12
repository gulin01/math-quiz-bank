"use client";

import { useEffect, useState } from "react";
import { BlankProblemSolveView } from "./BlankProblemSolveView";
import { MCQProblemSolveView } from "./MCQProblemSolveView";
import { TableProblemSolveView } from "./TableProblemSolveView";

type BaseProblem = {
  id: string;
  type: string;
};

type UserAnswer = {
  id: string;
  correct: boolean;
};

export default function DemoRunner() {
  const [problems, setProblems] = useState<BaseProblem[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<any>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("problems");
    if (raw) {
      setProblems(JSON.parse(raw));
    }
  }, []);

  const handleNext = () => {
    const current = problems[currentIndex];
    const userAns = userInput[current.id];
    let isCorrect = false;

    if (current.type === "MCQ_SINGLE") {
      isCorrect = userAns === (current as any).correctOptionIndex;
    } else if (current.type === "FILL_IN_THE_BLANK") {
      const correct = (current as any).answer?.trim();
      const user = (userAns ?? "").trim();
      isCorrect = correct === user;
    } else if (current.type === "TABLE_FILL_CELLS") {
      // For now, mark all as correct
      isCorrect = true;
    }

    setAnswers([...answers, { id: current.id, correct: isCorrect }]);

    if (currentIndex + 1 < problems.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  const current = problems[currentIndex];
  console.log("Current problem: in DEMO RUNNER", current);

  if (finished) {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <div className="bg-green-100 border-l-4 border-green-500 p-6 rounded-2xl shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-green-600 text-3xl">✅</span>
          <h2 className="text-2xl font-semibold text-green-900">
            테스트 완료!
          </h2>
        </div>
        <p className="text-lg text-green-800">
          총 <span className="font-bold">{answers.length}</span>문제 중{" "}
          <span className="font-bold text-green-900">{correctCount}</span>개
          정답 (
          <span className="font-bold text-green-700">
            {Math.round((correctCount / answers.length) * 100)}%
          </span>
          )
        </p>
      </div>
    );
  }

  return current ? (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        문제 {currentIndex + 1} / {problems.length}
      </p>

      {current.type === "MCQ_SINGLE" && (
        <MCQProblemSolveView
          problem={current as any}
          userAnswer={userInput[current.id]}
          onAnswer={(value) =>
            setUserInput({ ...userInput, [current.id]: value })
          }
        />
      )}

      {current.type === "FILL_IN_THE_BLANK" && (
        <BlankProblemSolveView
          problem={current as any}
          userAnswer={userInput[current.id]}
          onAnswer={(value) =>
            setUserInput({ ...userInput, [current.id]: value })
          }
        />
      )}

      {current.type === "TABLE_FILL_CELLS" && (
        <TableProblemSolveView
          problem={current as any}
          userAnswer={userInput[current.id]}
          onAnswer={(value) =>
            setUserInput({ ...userInput, [current.id]: value })
          }
        />
      )}

      <button
        onClick={handleNext}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        {currentIndex === problems.length - 1 ? "결과 보기" : "다음 문제"}
      </button>
    </div>
  ) : (
    <p>문제를 불러오는 중...</p>
  );
}
