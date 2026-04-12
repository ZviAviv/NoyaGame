import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { theme } from '../styles/theme';
import StageProgress from '../components/game/StageProgress';
import QuestionCard from '../components/game/QuestionCard';
import AnswerGrid from '../components/game/AnswerGrid';
import VideoPlayer from '../components/game/VideoPlayer';
import Scoreboard from '../components/game/Scoreboard';
import MiniScoreboard from '../components/game/MiniScoreboard';
import LifelineBar from '../components/lifelines/LifelineBar';
import HintDisplay from '../components/lifelines/HintDisplay';
import PhoneFriend from '../components/lifelines/PhoneFriend';
import ConfettiEffect from '../components/effects/ConfettiEffect';
import { CSSProperties } from 'react';

export default function GameScreen() {
  const {
    currentStage, stagePhase, selectedAnswer,
    advancePhase, nextStage, personScores, selectAnswer,
    lifelinesUsed, fiftyFiftyEliminated, useLifeline, setScreen,
  } = useGameStore();
  const { questions, persons } = useAdminStore();
  const updateScoresRef = useRef(false);

  const sortedQuestions = [...questions].sort((a, b) => a.stageNumber - b.stageNumber);
  const currentQuestion = sortedQuestions[currentStage];

  const linkedPerson = currentQuestion
    ? persons.find((p) => p.id === currentQuestion.linkedPersonId)
    : null;

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswerIndex;

  // Auto-advance from answer_selected to playing_video after a pause
  useEffect(() => {
    if (stagePhase === 'answer_selected') {
      const timer = setTimeout(() => advancePhase(), 1500);
      return () => clearTimeout(timer);
    }
  }, [stagePhase, advancePhase]);

  // Update scores when revealing answer
  useEffect(() => {
    if (stagePhase === 'revealing_answer' && !updateScoresRef.current) {
      updateScoresRef.current = true;
      if (isCorrect && currentQuestion && linkedPerson) {
        useGameStore.setState((s) => ({
          personScores: {
            ...s.personScores,
            [linkedPerson.id]: (s.personScores[linkedPerson.id] || 0) + 1,
          },
          playerAnswers: s.playerAnswers.map((a, i) => (i === currentStage ? selectedAnswer : a)),
        }));
      } else {
        useGameStore.setState((s) => ({
          playerAnswers: s.playerAnswers.map((a, i) => (i === currentStage ? selectedAnswer : a)),
        }));
      }
    }
    if (stagePhase === 'showing_question') {
      updateScoresRef.current = false;
    }
  }, [stagePhase, isCorrect, currentQuestion, linkedPerson, currentStage, selectedAnswer]);

  const handleVideoEnd = useCallback(() => {
    advancePhase(); // playing_video -> revealing_answer
  }, [advancePhase]);

  const handleRevealDone = useCallback(() => {
    advancePhase(); // revealing_answer -> showing_scoreboard
  }, [advancePhase]);

  const handleLifeline = useCallback(
    (type: 'phoneFriend' | 'fiftyFifty' | 'hint') => {
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
        <StageProgress current={currentStage} total={sortedQuestions.length} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MiniScoreboard persons={persons} scores={personScores} />
          <button
            style={homeBtnStyle}
            onClick={() => { if (window.confirm('לחזור למסך הבית? ההתקדמות תאבד.')) setScreen('welcome'); }}
            title="מסך הבית"
          >🏠</button>
        </div>
      </div>

      {/* Main game area */}
      <div style={gameAreaStyle}>
        <AnimatePresence mode="wait">
          {stagePhase === 'playing_video' && (
            <VideoPlayer
              key="video"
              videoUrl={currentQuestion.videoUrl}
              personName={currentQuestion.linkedPersonId === '__guest_stars__' ? 'כוכבים אורחים' : linkedPerson?.name}
              personEmoji={linkedPerson?.avatarEmoji}
              personAvatarUrl={linkedPerson?.avatarUrl}
              personColor={linkedPerson?.color}
              onEnd={handleVideoEnd}
            />
          )}

          {stagePhase === 'showing_scoreboard' && (
            <Scoreboard
              key="scoreboard"
              persons={persons}
              scores={personScores}
              currentPersonId={currentQuestion.linkedPersonId}
              wasCorrect={isCorrect}
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

      {/* Lifeline overlays */}
      <AnimatePresence>
        {lifelinesUsed.hint && stagePhase === 'showing_question' && currentQuestion.hintText && (
          <HintDisplay key="hint" text={currentQuestion.hintText} />
        )}
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

const gameAreaStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 2rem 2rem',
  position: 'relative',
};
