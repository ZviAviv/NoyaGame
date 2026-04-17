import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { theme } from '../styles/theme';
import { useMediaUrl } from '../hooks/useMediaUrl';
import QuestionCard from '../components/game/QuestionCard';
import AnswerGrid from '../components/game/AnswerGrid';
import VideoPlayer from '../components/game/VideoPlayer';
import Scoreboard from '../components/game/Scoreboard';
import PrizeLadder from '../components/game/PrizeLadder';
import LifelineBar from '../components/lifelines/LifelineBar';
import PhoneFriend from '../components/lifelines/PhoneFriend';
import ConfettiEffect from '../components/effects/ConfettiEffect';
import { CSSProperties } from 'react';

export default function GameScreen() {
  const {
    currentStage, stagePhase, selectedAnswer,
    advancePhase, nextStage, selectAnswer,
    lifelinesUsed, fiftyFiftyEliminated, useLifeline, setScreen,
    prizeAmounts,
  } = useGameStore();
  const { questions, correctAnswerAudioUrl, questionRevealAudioUrl } = useAdminStore();

  const sortedQuestions = [...questions].sort((a, b) => a.stageNumber - b.stageNumber);
  const currentQuestion = sortedQuestions[currentStage];

  const updateScoresRef = useRef(false);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const revealAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevStageRef = useRef(-1);
  const resolvedAudioUrl = useMediaUrl(correctAnswerAudioUrl);
  const resolvedRevealAudioUrl = useMediaUrl(questionRevealAudioUrl);

  useEffect(() => {
    if (!resolvedAudioUrl) { correctAudioRef.current = null; return; }
    correctAudioRef.current = new Audio(resolvedAudioUrl);
  }, [resolvedAudioUrl]);

  useEffect(() => {
    if (!resolvedRevealAudioUrl) { revealAudioRef.current = null; return; }
    revealAudioRef.current = new Audio(resolvedRevealAudioUrl);
  }, [resolvedRevealAudioUrl]);

  // Play question reveal sound on each new stage
  useEffect(() => {
    if (prevStageRef.current !== currentStage) {
      prevStageRef.current = currentStage;
      if (revealAudioRef.current) {
        revealAudioRef.current.currentTime = 0;
        revealAudioRef.current.play().catch(() => {});
      }
    }
  }, [currentStage]);

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswerIndex;
  const currentPrize = prizeAmounts[Math.min(currentStage, prizeAmounts.length - 1)] ?? 0;

  // Auto-advance from answer_selected to playing_video after a pause
  useEffect(() => {
    if (stagePhase === 'answer_selected') {
      const timer = setTimeout(() => advancePhase(), 1500);
      return () => clearTimeout(timer);
    }
  }, [stagePhase, advancePhase]);

  // Play audio and record answer when revealing
  useEffect(() => {
    if (stagePhase === 'revealing_answer' && !updateScoresRef.current) {
      updateScoresRef.current = true;
      if (isCorrect && correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0;
        correctAudioRef.current.play().catch(() => {});
      }
      useGameStore.setState((s) => ({
        playerAnswers: s.playerAnswers.map((a, i) => (i === currentStage ? selectedAnswer : a)),
      }));
    }
    if (stagePhase === 'showing_question') {
      updateScoresRef.current = false;
    }
  }, [stagePhase, isCorrect, currentStage, selectedAnswer]);

  const handleVideoEnd = useCallback(() => {
    advancePhase(); // playing_video -> revealing_answer
  }, [advancePhase]);

  const handleRevealDone = useCallback(() => {
    advancePhase(); // revealing_answer -> showing_scoreboard
  }, [advancePhase]);

  const handleLifeline = useCallback(
    (type: 'phoneFriend' | 'hint') => {
      if (stagePhase !== 'showing_question') return;
      useLifeline(type, currentStage, sortedQuestions);
    },
    [stagePhase, useLifeline, currentStage, sortedQuestions]
  );

  if (!currentQuestion) return null;

  const showConfetti = stagePhase === 'revealing_answer' && isCorrect;

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && <ConfettiEffect />}

      {/* Top bar */}
      <div style={topBarStyle}>
        <LifelineBar
          lifelinesUsed={lifelinesUsed}
          onUse={handleLifeline}
          disabled={stagePhase !== 'showing_question'}
        />
        <div style={titleStyle}>מי רוצה להיות מיליונויה</div>
        <button
          style={homeBtnStyle}
          onClick={() => { if (window.confirm('לחזור למסך הבית? ההתקדמות תאבד.')) setScreen('welcome'); }}
          title="מסך הבית"
        >🏠</button>
      </div>

      {/* Content: prize ladder + game area */}
      <div style={contentRowStyle}>
        {/* Main game area */}
        <div style={gameAreaStyle}>
          <AnimatePresence mode="wait">
            {stagePhase === 'playing_video' && (
              <VideoPlayer
                key="video"
                videoUrl={currentQuestion.videoUrl}
                onEnd={handleVideoEnd}
              />
            )}

            {stagePhase === 'showing_scoreboard' && (
              <Scoreboard
                key="scoreboard"
                wasCorrect={isCorrect}
                prizeAmount={currentPrize}
                onNext={nextStage}
                isLastStage={currentStage >= sortedQuestions.length - 1}
              />
            )}
          </AnimatePresence>

          {stagePhase !== 'playing_video' && stagePhase !== 'showing_scoreboard' && (
            <>
              <QuestionCard
                question={currentQuestion.questionText}
                stageNumber={currentStage + 1}
                totalStages={sortedQuestions.length}
                imageUrl={currentQuestion.imageUrl}
              />
              <AnswerGrid
                answers={currentQuestion.answers}
                correctIndex={currentQuestion.correctAnswerIndex}
                selectedIndex={selectedAnswer}
                phase={stagePhase}
                eliminatedIndices={fiftyFiftyEliminated}
                onSelect={selectAnswer}
                onRevealDone={handleRevealDone}
              />
            </>
          )}
        </div>

        {/* Prize ladder sidebar - right */}
        <PrizeLadder prizeAmounts={prizeAmounts} currentStage={currentStage} />
      </div>

      {/* Lifeline overlays */}
      <AnimatePresence>
        {lifelinesUsed.phoneFriend && stagePhase === 'showing_question' && currentQuestion.phoneFriendText && (
          <PhoneFriend key="phone" text={currentQuestion.phoneFriendText} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const containerStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
};

const topBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 2rem',
  zIndex: 10,
};

const homeBtnStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: 'none',
  borderRadius: '50%',
  width: '2.2rem',
  height: '2.2rem',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.6,
  transition: 'opacity 0.2s',
  flexShrink: 0,
};

const contentRowStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  direction: 'ltr',
  overflow: 'hidden',
};

const gameAreaStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 2rem 2rem',
  position: 'relative',
};

const titleStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: 'clamp(1rem, 2vw, 1.4rem)',
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldLight}, #fff, ${theme.colors.gold})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  pointerEvents: 'none',
  userSelect: 'none',
};
