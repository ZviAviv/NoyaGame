import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { Question, Person } from '../types';
import { theme } from '../styles/theme';
import { v4 as uuidv4 } from 'uuid';
import { CSSProperties } from 'react';
import { saveMedia, isIdbUrl, deleteMedia, getIdbId, idbUrlToBase64, base64ToIdbUrl } from '../utils/mediaStore';
import { saveToCloud } from '../services/cloudSync';
import { useMediaUrl } from '../hooks/useMediaUrl';
import Avatar from '../components/common/Avatar';

const GUEST_STARS_ID = '__guest_stars__';

async function handleFileUpload(file: File, callback: (url: string) => void) {
  const url = await saveMedia(file);
  callback(url);
}

async function handleClearMedia(currentUrl: string, callback: (url: string) => void) {
  if (isIdbUrl(currentUrl)) {
    await deleteMedia(getIdbId(currentUrl));
  }
  callback('');
}

function MediaUploadField({
  value,
  accept,
  placeholder,
  buttonText,
  uploadedText,
  onChange,
  previewType,
}: {
  value: string;
  accept: string;
  placeholder: string;
  buttonText: string;
  uploadedText: string;
  onChange: (url: string) => void;
  previewType: 'image' | 'video' | 'audio';
}) {
  const resolvedUrl = useMediaUrl(value);
  const isUploaded = isIdbUrl(value);

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <input
          style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
          value={isUploaded ? uploadedText : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          readOnly={isUploaded}
        />
        <label style={{ ...smallBtnStyle, background: '#6c5ce722', color: '#a29bfe', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {buttonText}
          <input type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, onChange);
          }} />
        </label>
        {value && (
          <button
            style={{ ...smallBtnStyle, background: '#ff174422', color: '#ff6b6b', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
            onClick={() => handleClearMedia(value, onChange)}
          >✕</button>
        )}
      </div>
      {resolvedUrl && previewType === 'image' && (
        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          <img
            src={resolvedUrl}
            alt="תצוגה מקדימה"
            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: theme.borderRadius.sm, border: `1px solid ${theme.colors.cardBorder}` }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      {resolvedUrl && previewType === 'video' && (
        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          <video
            src={resolvedUrl}
            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: theme.borderRadius.sm, border: `1px solid ${theme.colors.cardBorder}` }}
            controls
            muted
          />
        </div>
      )}
      {resolvedUrl && previewType === 'audio' && (
        <div style={{ marginBottom: '0.5rem' }}>
          <audio src={resolvedUrl} controls style={{ width: '100%' }} />
        </div>
      )}
    </>
  );
}

const emptyQuestion = (stageNumber: number): Question => ({
  id: uuidv4(),
  stageNumber,
  questionText: '',
  answers: ['', '', '', ''],
  correctAnswerIndex: 0,
  linkedPersonId: '',
  imageUrl: '',
  hintText: '',
  videoUrl: '',
  postAnswerImageUrl: '',
  phoneFriendText: '',
});

function PersonManager() {
  const { persons, updatePerson, addPerson, deletePerson } = useAdminStore();

  const handleAdd = () => {
    const idx = persons.length;
    addPerson({
      id: uuidv4(),
      name: 'שם חדש',
      avatarEmoji: '',
      avatarUrl: '',
      color: theme.personColors[idx % theme.personColors.length],
    });
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={sectionTitleStyle}>👥 ניהול מתמודדים</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {persons.map((p) => (
          <div
            key={p.id}
            style={{
              background: `${p.color}22`,
              border: `1px solid ${p.color}66`,
              borderRadius: theme.borderRadius.md,
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Avatar avatarUrl={p.avatarUrl} name={p.name} color={p.color} size="2.2rem" fontSize="0.8rem" />
              <input
                style={{ ...inputStyle, width: '7rem', marginBottom: 0 }}
                value={p.name}
                onChange={(e) => updatePerson(p.id, { name: e.target.value })}
                placeholder="שם"
              />
              <input
                style={{ ...inputStyle, width: '4rem', padding: '0.3rem', marginBottom: 0 }}
                type="color"
                value={p.color}
                onChange={(e) => updatePerson(p.id, { color: e.target.value })}
              />
              <button
                style={{ ...smallBtnStyle, background: '#ff174433', color: '#ff6b6b' }}
                onClick={() => deletePerson(p.id)}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, marginBottom: 0, fontSize: '0.8rem', flex: 1 }}
                value={isIdbUrl(p.avatarUrl) ? '(תמונה הועלתה)' : p.avatarUrl}
                onChange={(e) => updatePerson(p.id, { avatarUrl: e.target.value })}
                placeholder="קישור לתמונה או העלה קובץ →"
                dir="ltr"
                readOnly={isIdbUrl(p.avatarUrl)}
              />
              <label style={{ ...smallBtnStyle, background: '#6c5ce722', color: '#a29bfe', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                📷 העלה
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, (url) => updatePerson(p.id, { avatarUrl: url }));
                }} />
              </label>
              {p.avatarUrl && (
                <button
                  style={{ ...smallBtnStyle, background: '#ff174422', color: '#ff6b6b', fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => handleClearMedia(p.avatarUrl, (url) => updatePerson(p.id, { avatarUrl: url }))}
                >✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button style={{ ...smallBtnStyle, background: '#00e67622', color: '#00e676' }} onClick={handleAdd}>
        + הוסף מתמודד
      </button>
    </div>
  );
}

function QuestionForm({
  question,
  onSave,
  onCancel,
}: {
  question: Question;
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<Question>({ ...question });

  const updateAnswer = (index: number, value: string) => {
    const answers = [...q.answers] as [string, string, string, string];
    answers[index] = value;
    setQ({ ...q, answers });
  };

  return (
    <div style={formStyle}>
      <h3 style={{ ...sectionTitleStyle, marginBottom: '1rem' }}>
        {question.questionText ? 'עריכת שאלה' : 'שאלה חדשה'} — שלב {q.stageNumber}
      </h3>

      <label style={labelStyle}>טקסט השאלה</label>
      <textarea
        style={{ ...inputStyle, minHeight: '4rem', resize: 'vertical' }}
        value={q.questionText}
        onChange={(e) => setQ({ ...q, questionText: e.target.value })}
        placeholder="הקלד את השאלה כאן..."
      />

      <label style={labelStyle}>תשובות</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {q.answers.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              style={{
                ...smallBtnStyle,
                background: q.correctAnswerIndex === i ? '#00e676' : '#ffffff22',
                color: q.correctAnswerIndex === i ? '#000' : '#fff',
                fontFamily: theme.fonts.heading,
                width: '2rem',
                height: '2rem',
                flexShrink: 0,
              }}
              onClick={() => setQ({ ...q, correctAnswerIndex: i })}
              title="סמן כתשובה נכונה"
            >
              {theme.answerLabels[i]}
            </button>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={a}
              onChange={(e) => updateAnswer(i, e.target.value)}
              placeholder={`תשובה ${theme.answerLabels[i]}`}
            />
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, marginTop: '0.25rem' }}>
        לחץ על האות כדי לסמן תשובה נכונה
      </p>

      <label style={labelStyle}>תמונה לשאלה</label>
      <MediaUploadField
        value={q.imageUrl}
        accept="image/*"
        placeholder="קישור לתמונה או העלה קובץ →"
        buttonText="📷 העלה תמונה"
        uploadedText="(תמונה הועלתה)"
        onChange={(url) => setQ({ ...q, imageUrl: url })}
        previewType="image"
      />

      <label style={labelStyle}>סרטון אחרי תשובה</label>
      <MediaUploadField
        value={q.videoUrl}
        accept="video/*"
        placeholder="קישור לסרטון או העלה קובץ →"
        buttonText="🎬 העלה סרטון"
        uploadedText="(סרטון הועלה)"
        onChange={(url) => setQ({ ...q, videoUrl: url })}
        previewType="video"
      />
      <label style={labelStyle}>תמונה אחרי תשובה</label>
      <MediaUploadField
        value={q.postAnswerImageUrl}
        accept="image/*"
        placeholder="קישור לתמונה או העלה קובץ →"
        buttonText="📷 העלה תמונה"
        uploadedText="(תמונה הועלתה)"
        onChange={(url) => setQ({ ...q, postAnswerImageUrl: url })}
        previewType="image"
      />
      <p style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, marginTop: '-0.25rem' }}>
        הסרטון/תמונה יוצגו אחרי בחירת תשובה. ניתן להשאיר ריק
      </p>

      <label style={labelStyle}>רמז (לייפליין רמז)</label>
      <input
        style={inputStyle}
        value={q.hintText}
        onChange={(e) => setQ({ ...q, hintText: e.target.value })}
        placeholder="רמז שיעזור לשחקן..."
      />

      <label style={labelStyle}>חבר טלפוני (טקסט)</label>
      <input
        style={inputStyle}
        value={q.phoneFriendText}
        onChange={(e) => setQ({ ...q, phoneFriendText: e.target.value })}
        placeholder="מה החבר אומר..."
      />

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button style={saveBtnStyle} onClick={() => onSave(q)}>
          💾 שמור
        </button>
        <button style={{ ...smallBtnStyle, padding: '0.5rem 1.5rem' }} onClick={onCancel}>
          ביטול
        </button>
      </div>
    </div>
  );
}

export default function AdminScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const { questions, persons, correctAnswerAudioUrl, setCorrectAnswerAudioUrl, questionRevealAudioUrl, setQuestionRevealAudioUrl, addQuestion, updateQuestion, deleteQuestion, reorderQuestions, importData, exportData } =
    useAdminStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedQuestions = [...questions].sort((a, b) => a.stageNumber - b.stageNumber);
  const editingQuestion = editingId ? questions.find((q) => q.id === editingId) : null;

  const handleSave = (q: Question) => {
    if (isAdding) {
      addQuestion(q);
      setIsAdding(false);
    } else {
      updateQuestion(q.id, q);
    }
    setEditingId(null);
  };

  const handleSyncToCloud = useCallback(async () => {
    setSyncing(true);
    try {
      const data = exportData();
      await saveToCloud(data);
      alert('✅ סונכרן לענן בהצלחה! כל המכשירים יראו את השאלות.');
    } catch (e) {
      alert('❌ שגיאה בסנכרון. בדוק חיבור לאינטרנט.');
      console.error(e);
    } finally {
      setSyncing(false);
    }
  }, [exportData]);

  const handleLocalBackup = async () => {
    const data = exportData();
    const resolveUrl = (url: string) => idbUrlToBase64(url);
    const resolvedQuestions = await Promise.all(
      data.questions.map(async (q) => ({
        ...q,
        imageUrl: await resolveUrl(q.imageUrl),
        videoUrl: await resolveUrl(q.videoUrl),
        postAnswerImageUrl: await resolveUrl(q.postAnswerImageUrl),
      }))
    );
    const resolvedPersons = await Promise.all(
      data.persons.map(async (p) => ({
        ...p,
        avatarUrl: await resolveUrl(p.avatarUrl),
      }))
    );
    const exportable = {
      ...data,
      questions: resolvedQuestions,
      persons: resolvedPersons,
      correctAnswerAudioUrl: await resolveUrl(data.correctAnswerAudioUrl),
      questionRevealAudioUrl: await resolveUrl(data.questionRevealAudioUrl),
    };
    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noya-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const data = exportData();

    // Resolve all idb:// references to base64 data URIs so the file is self-contained
    const resolveUrl = (url: string) => idbUrlToBase64(url);

    const resolvedQuestions = await Promise.all(
      data.questions.map(async (q) => ({
        ...q,
        imageUrl: await resolveUrl(q.imageUrl),
        videoUrl: await resolveUrl(q.videoUrl),
        postAnswerImageUrl: await resolveUrl(q.postAnswerImageUrl),
      }))
    );

    const resolvedPersons = await Promise.all(
      data.persons.map(async (p) => ({
        ...p,
        avatarUrl: await resolveUrl(p.avatarUrl),
      }))
    );

    const exportable = {
      ...data,
      questions: resolvedQuestions,
      persons: resolvedPersons,
      correctAnswerAudioUrl: await resolveUrl(data.correctAnswerAudioUrl),
      questionRevealAudioUrl: await resolveUrl(data.questionRevealAudioUrl),
    };

    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'noya-game-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.questions || !data.persons) { alert('קובץ לא תקין'); return; }

        // Re-save any base64 data URIs back into IndexedDB
        const resolveUrl = (url: string) => base64ToIdbUrl(url);

        const resolvedQuestions = await Promise.all(
          data.questions.map(async (q: Question) => ({
            ...q,
            imageUrl: await resolveUrl(q.imageUrl),
            videoUrl: await resolveUrl(q.videoUrl),
            postAnswerImageUrl: await resolveUrl(q.postAnswerImageUrl || ''),
          }))
        );

        const resolvedPersons = await Promise.all(
          data.persons.map(async (p: Person) => ({
            ...p,
            avatarUrl: await resolveUrl(p.avatarUrl),
          }))
        );

        importData({
          ...data,
          questions: resolvedQuestions,
          persons: resolvedPersons,
          correctAnswerAudioUrl: await resolveUrl(data.correctAnswerAudioUrl || ''),
          questionRevealAudioUrl: await resolveUrl(data.questionRevealAudioUrl || ''),
        });
        alert('המשחק יובא בהצלחה!');
      } catch {
        alert('קובץ לא תקין');
      }
    };
    reader.readAsText(file);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderQuestions(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < sortedQuestions.length - 1) reorderQuestions(index, index + 1);
  };

  const getPersonForQuestion = (q: Question) => persons.find((p) => p.id === q.linkedPersonId);

  return (
    <motion.div
      style={screenStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={headerStyle}>
        <button style={backBtnStyle} onClick={() => setScreen('welcome')}>
          → חזרה למשחק
        </button>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '1.8rem' }}>⚙️ ניהול המשחק</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            style={{ ...smallBtnStyle, background: syncing ? '#ffffff11' : '#0984e333', color: '#74b9ff', fontWeight: 700 }}
            onClick={handleSyncToCloud}
            disabled={syncing}
          >
            {syncing ? '⏳ מסנכרן...' : '☁️ סנכרן לענן'}
          </button>
          <button style={{ ...smallBtnStyle, background: '#00b89433', color: '#55efc4' }} onClick={handleLocalBackup}>
            💾 גיבוי מקומי
          </button>
          <button style={{ ...smallBtnStyle, background: '#6c5ce733', color: '#a29bfe' }} onClick={handleExport}>
            📤 ייצוא
          </button>
          <button
            style={{ ...smallBtnStyle, background: '#00b89433', color: '#55efc4' }}
            onClick={() => fileInputRef.current?.click()}
          >
            📥 ייבוא
          </button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </div>
      </div>

      <div style={contentStyle}>
        <div style={sidebarStyle}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={sectionTitleStyle}>🎵 שמע לתשובה נכונה</h3>
            <MediaUploadField
              value={correctAnswerAudioUrl}
              accept="audio/*"
              placeholder="קישור לשמע או העלה קובץ →"
              buttonText="🎵 העלה שמע"
              uploadedText="(שמע הועלה)"
              onChange={setCorrectAnswerAudioUrl}
              previewType="audio"
            />
            <p style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, marginTop: '-0.25rem' }}>
              יושמע לכל תשובה נכונה במשחק
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={sectionTitleStyle}>🔔 שמע לשאלה חדשה</h3>
            <MediaUploadField
              value={questionRevealAudioUrl}
              accept="audio/*"
              placeholder="קישור לשמע או העלה קובץ →"
              buttonText="🔔 העלה שמע"
              uploadedText="(שמע הועלה)"
              onChange={setQuestionRevealAudioUrl}
              previewType="audio"
            />
            <p style={{ fontSize: '0.75rem', color: theme.colors.textSecondary, marginTop: '-0.25rem' }}>
              יושמע בכל פעם ששאלה חדשה מוצגת
            </p>
          </div>

          <h3 style={sectionTitleStyle}>📝 שאלות ({sortedQuestions.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {sortedQuestions.map((q, idx) => {
              const person = getPersonForQuestion(q);
              const isGuestStar = q.linkedPersonId === GUEST_STARS_ID;
              return (
                <div
                  key={q.id}
                  style={{
                    ...questionItemStyle,
                    borderColor: editingId === q.id ? theme.colors.gold : theme.colors.cardBorder,
                    background: editingId === q.id ? `${theme.colors.gold}11` : theme.colors.cardBg,
                  }}
                  onClick={() => { setEditingId(q.id); setIsAdding(false); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <span style={stageNumStyle}>{q.stageNumber}</span>
                    {person && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: person.color,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {isGuestStar && (
                      <span style={{ fontSize: '0.7rem', flexShrink: 0 }}>⭐</span>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                      {q.questionText || 'שאלה ריקה...'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                    <button style={tinyBtnStyle} onClick={(e) => { e.stopPropagation(); handleMoveUp(idx); }}>▲</button>
                    <button style={tinyBtnStyle} onClick={(e) => { e.stopPropagation(); handleMoveDown(idx); }}>▼</button>
                    <button
                      style={{ ...tinyBtnStyle, color: '#ff6b6b' }}
                      onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); if (editingId === q.id) setEditingId(null); }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            style={{ ...smallBtnStyle, background: '#00e67622', color: '#00e676', marginTop: '0.75rem', width: '100%' }}
            onClick={() => {
              const newQ = emptyQuestion(sortedQuestions.length + 1);
              setEditingId(newQ.id);
              setIsAdding(true);
            }}
          >
            + הוסף שאלה
          </button>
        </div>

        <div style={mainAreaStyle}>
          {(editingQuestion || isAdding) ? (
            <QuestionForm
              key={editingId || 'new'}
              question={editingQuestion || emptyQuestion(sortedQuestions.length + 1)}
              onSave={handleSave}
              onCancel={() => { setEditingId(null); setIsAdding(false); }}
            />
          ) : (
            <div style={emptyStateStyle}>
              <span style={{ fontSize: '3rem' }}>📝</span>
              <p>בחר שאלה מהרשימה או הוסף שאלה חדשה</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const screenStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, #1a0a2e, #11052c)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 2rem',
  borderBottom: `1px solid ${theme.colors.cardBorder}`,
  background: `${theme.colors.cardBg}88`,
  backdropFilter: 'blur(10px)',
};

const backBtnStyle: CSSProperties = {
  background: 'none',
  color: theme.colors.textSecondary,
  fontSize: '0.9rem',
  cursor: 'pointer',
  border: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: theme.borderRadius.sm,
  transition: 'color 0.2s',
};

const contentStyle: CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
};

const sidebarStyle: CSSProperties = {
  width: '380px',
  flexShrink: 0,
  padding: '1.5rem',
  borderLeft: `1px solid ${theme.colors.cardBorder}`,
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 65px)',
};

const mainAreaStyle: CSSProperties = {
  flex: 1,
  padding: '1.5rem 2rem',
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 65px)',
};

const sectionTitleStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '1.1rem',
  marginBottom: '0.75rem',
  color: theme.colors.gold,
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  background: '#1a0a2e',
  border: `1px solid ${theme.colors.cardBorder}`,
  borderRadius: theme.borderRadius.sm,
  color: theme.colors.textPrimary,
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  color: theme.colors.textSecondary,
  marginBottom: '0.25rem',
  marginTop: '0.75rem',
};

const smallBtnStyle: CSSProperties = {
  background: '#ffffff11',
  color: theme.colors.textPrimary,
  border: 'none',
  borderRadius: theme.borderRadius.sm,
  padding: '0.35rem 0.75rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const tinyBtnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: theme.colors.textSecondary,
  cursor: 'pointer',
  fontSize: '0.7rem',
  padding: '0.15rem 0.3rem',
  borderRadius: '4px',
};

const saveBtnStyle: CSSProperties = {
  background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldDark})`,
  color: '#1a0a2e',
  border: 'none',
  borderRadius: theme.borderRadius.sm,
  padding: '0.5rem 2rem',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const formStyle: CSSProperties = {
  background: theme.colors.cardBg,
  borderRadius: theme.borderRadius.md,
  padding: '1.5rem',
  border: `1px solid ${theme.colors.cardBorder}`,
};

const questionItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  borderRadius: theme.borderRadius.sm,
  border: `1px solid ${theme.colors.cardBorder}`,
  cursor: 'pointer',
  transition: 'border-color 0.2s, background 0.2s',
};

const stageNumStyle: CSSProperties = {
  fontFamily: theme.fonts.heading,
  fontSize: '0.8rem',
  background: `${theme.colors.gold}22`,
  color: theme.colors.gold,
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  flexShrink: 0,
};

const emptyStateStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: '1rem',
  color: theme.colors.textSecondary,
  fontSize: '1.1rem',
};
