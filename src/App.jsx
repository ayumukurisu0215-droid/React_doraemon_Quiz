// src/App.jsx
import React, { useState, useMemo } from "react";
import "./index.css";

/* 問題データ（タイトル, 選択肢1, 2, 3, 正解インデックス(1~3)） */
const QUIZZES = [
  ["しずかちゃんの父親の名前は？", "源義雄（みなもと よしお）", "源高志（みなもと たかし）", "源忠雄（みなもと ただお）", 1],
  ["のび太の父・野比のび助の会社での役職は？", "課長", "課長代理", "社長", 2],
  ["ジャイアンがみんなを集めて開催することといえば？", "ジャイアンコンサート", "ジャイアンフェス", "ジャイアンリサイタル", 3],
  ["劇場版1作目のタイトルは？", "のび太の宇宙開拓史", "のび太の宇宙戦争", "のび太の恐竜", 3],
  ["しずかちゃんは1日に何回お風呂に入る？", "2回", "3回", "5回", 2],
  ["ドラミちゃんの好きな食べ物は？", "メロンパン", "シチュー", "ショートケーキ", 1],
  ["のび太の得意技は？", "昼寝", "あやとり", "ピアノ", 1],
  ["ドラえもんは何ミリ浮いている？", "2.3ミリ", "3ミリ", "3.5ミリ", 2],
  ["タイムマシンが作られたのは？", "2008年", "2058年", "2128年", 1],
  ["ドラえもんの体重は？", "100.0キロ", "129.3キロ", "183.0キロ", 2],
];

/* シャッフル関数（不変性を保つために新配列を返す） */
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ランクを判定する関数 */
function getRank(score, total) {
  const percentage = (score / total) * 100;
  if (percentage === 100) return { title: "ドラえもん博士", comment: "完璧です！あなたは真のドラえもん博士です！" };
  if (percentage >= 80) return { title: "出木杉君レベル", comment: "素晴らしい！とても優秀です！" };
  if (percentage >= 60) return { title: "スネ夫レベル", comment: "なかなかやりますね！" };
  if (percentage >= 40) return { title: "ジャイアンレベル", comment: "もう少し頑張りましょう！" };
  return { title: "のび太レベル", comment: "ドラえもんに助けてもらいましょう！" };
}

export default function App() {
  // 初回レンダー時に問題をシャッフルして固定する（useMemoで初期化）
  const shuffledQuizzes = useMemo(() => shuffleArray(QUIZZES), []);
  const total = shuffledQuizzes.length;

  // index: 現在の問題番号
  const [index, setIndex] = useState(0);
  // selected: 現在選択された選択肢の番号 (1~3) または null
  const [selected, setSelected] = useState(null);
  // score: 正解数
  const [score, setScore] = useState(0);
  // finished: 終了フラグ
  const [finished, setFinished] = useState(false);

  const quiz = shuffledQuizzes[index];

  // 選択処理：既に選んでいたら無視する（多重クリック防止）
  const handleSelect = (choiceIndex) => {
    if (selected !== null) return;
    setSelected(choiceIndex);
    if (choiceIndex === quiz[4]) {
      setScore((s) => s + 1);
    }
  };

  // 次へ処理
  const handleNext = () => {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  // リセット（簡単な方法）
  const handleRestart = () => {
    window.location.reload(); // 学習用に素早くリセットする方法
  };

  if (finished) {
    const rank = getRank(score, total);
    return (
      <main>
        <h1>難問ドラえもん三択クイズ</h1>
        <p className="title">全{total}問のクイズに挑戦！</p>
        <div id="result">
          <h2>クイズ終了！</h2>
          <p className="final-score">正解数: {score} / {total}</p>
          <p className="rank-title">あなたは <span>{rank.title}</span> です</p>
          <p className="rank-comment">{rank.comment}</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleRestart}>もう一度遊ぶ</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>難問ドラえもん三択クイズ</h1>
      <p className="title">全{total}問のクイズに挑戦! 正解だと思う選択肢をクリックしよう</p>
      <section>
        <h3>第{index + 1}問</h3>
        <h2>{quiz[0]}</h2>
        <ul>
          {[quiz[1], quiz[2], quiz[3]].map((choice, i) => {
            const choiceNum = i + 1;
            // 選択済みなら正解/不正解のクラスを付与
            let className = "";
            if (selected !== null) {
              if (choiceNum === quiz[4]) className = "correct";
              else if (choiceNum === selected) className = "wrong";
            }

            return (
              <li
                key={i}
                className={className}
                onClick={() => handleSelect(choiceNum)}
                style={{ pointerEvents: selected !== null ? "none" : "auto" }}
              >
                {choice}
              </li>
            );
          })}
        </ul>

        {selected !== null && (
          <div style={{ textAlign: "right" }}>
            <button onClick={handleNext}>{index < total - 1 ? "次へ" : "結果を見る"}</button>
          </div>
        )}

        <p className="small">現在のスコア: {score} / {total}</p>
      </section>
    </main>
  );
}
